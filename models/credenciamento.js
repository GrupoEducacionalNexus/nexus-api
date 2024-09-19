// models/credenciamento.js
const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const { buscarUsuario } = require('../services/buscaUsuario');
const { atribuirPermissao } = require('../services/atribuirPermissao');
const { cadastrarUsuario } = require('../services/cadastrarUsuario');
const socket = require('../services/socket');
const conectados = require('../services/conectados');
const { listaDeUsuariosDoSetor } = require('../services/listaDeusuariosDoSetor');
const { registrarNoficacao } = require('../services/registrarNotificacao');
const { verificarPermissao } = require('../services/verificarPermissao');

class Credenciamento {

    async adiciona(credenciamento, res) {
        try {
            const io = socket.getIO();
            const {
                nome, email, telefone, cpf,
                senha, cnpj, razao_social,
                nome_fantasia, id_instituicao,
                id_estado, cidade
            } = credenciamento;

            const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

            // Verifica se o usuário já está cadastrado
            const usuarios = await buscarUsuario(email);
            let id_usuario;

            if (usuarios.length > 0) {
                // Usuário existe
                id_usuario = usuarios[0].id;

                // Verifica se já existe uma solicitação de credenciamento para este usuário
                const credenciamentoExistente = await this.verificaCredenciamentoExistente(id_usuario);
                if (credenciamentoExistente) {
                    return res.status(400).json({ msg: "Você já solicitou credenciamento", status: 400 });
                }

                // Verifica se o usuário possui a permissão necessária
                const possuiPermissao = await verificarPermissao(id_usuario, 15);
                if (!possuiPermissao) {
                    await atribuirPermissao(id_usuario, 15);
                }

            } else {
                // Usuário não existe, cria um novo usuário
                id_usuario = await cadastrarUsuario({ nome, email, telefone, cpf_cnpj: cpf, senha, dataHoraCriacao });
                if (!id_usuario) {
                    return res.status(400).json({ msg: "Erro ao cadastrar usuário", status: 400 });
                }

                // Atribui a permissão necessária ao novo usuário
                await atribuirPermissao(id_usuario, 15);
            }

            // Insere a solicitação de credenciamento
            await this.inserirCredenciamento({ id_usuario, id_instituicao, id_estado, cidade, cnpj, razao_social, nome_fantasia, telefone, email }, res);

            // Envia notificações e emails
            await this.notificar(credenciamento);

            // Retorna sucesso
            return res.status(200).json({ status: 200, msg: "Solicitação de credenciamento confirmada com sucesso" });

        } catch (error) {
            console.error("Erro ao adicionar credenciamento:", error);
            return res.status(500).json({ status: 500, msg: "Erro interno do servidor" });
        }
    }

    verificaCredenciamentoExistente(id_usuario) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM credenciamento WHERE credenciamento.id_usuario = ?`;
            conexao.query(sql, [id_usuario], (erro, resultados) => {
                if (erro) {
                    return reject(erro);
                }
                resolve(resultados.length > 0);
            });
        });
    }

    inserirCredenciamento(credenciamento, res) {
        return new Promise((resolve, reject) => {
            const { id_usuario, id_instituicao, id_estado, cidade } = credenciamento;
            const credenciamentoDatado = { 
                id_usuario, 
                id_instituicao, 
                id_estado, 
                cidade, 
                observacao: 0, 
                status: 5, 
                dataHoraCriacao: moment().format('YYYY-MM-DD HH:mm:ss') 
            };
            const sql = `INSERT INTO credenciamento SET ?`;
            conexao.query(sql, credenciamentoDatado, (erro, resultados) => {
                if (erro) {
                    return reject(erro);
                }
                resolve(resultados);
            });
        });
    }

    async notificar(credenciamento) {
        const io = socket.getIO();
        const { cnpj, razao_social, nome_fantasia, email, telefone } = credenciamento;

        // Busca os usuários do setor 2 para notificação
        const usuarios = await listaDeUsuariosDoSetor(2);

        for (const usuario of usuarios) {
            const conectado = conectados.find(objeto => objeto.nome === usuario.nome);
            if (conectado) {
                io.to(conectado.id).emit('notification', { message: `O CNPJ ${cnpj.toUpperCase()} com a razão social ${razao_social.toUpperCase()} solicitou credenciamento` });
            }
            await registrarNoficacao(`O CNPJ ${cnpj.toUpperCase()} com a razão social "${razao_social.toUpperCase()}" solicitou credenciamento`, 7, usuario.id_usuario);
            await enviarEmail(
                `solicitacoes@centroeducanexus.com.br`,
                "SOLICITAÇÃO DE CREDENCIAMENTO",
                `<b>
                    <p>SEGUE OS DADOS DO SOLICITANTE:</p>
                    <p>CNPJ: ${cnpj.toUpperCase()}</p>
                    <p>RAZÃO SOCIAL: ${razao_social.toUpperCase()}</p>
                    <p>NOME FANTASIA: ${nome_fantasia.toUpperCase()}</p>
                    <p>E-MAIL DO POLO: ${email.toUpperCase()}</p>
                    <p>TELEFONE: ${telefone.toUpperCase()}</p>
                <b/>`
            );
        }
    }

    altera(id, valores, res) {
        const { id_usuario, nome, email, telefone, cpf, senha, id_instituicao, cnpj, razao_social, nome_fantasia, status } = valores;

        atualizarUsuario(id_usuario, { nome, email, telefone, cpf_cnpj: cpf, senha }).then(affectedRows => {
            if (affectedRows > 0) {
                let sql = `UPDATE instituicoes SET ? WHERE instituicoes.id = ?`;
                conexao.query(sql, [{ cnpj, razao_social, nome_fantasia }, id_instituicao], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        sql = `UPDATE credenciamento SET ? WHERE credenciamento.id = ?`;
                        conexao.query(sql, [{ status }, id], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });
                            } else {
                                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                            }
                        });
                    }
                });
            }
        }).catch(erro => {
            console.error("Erro ao atualizar usuário:", erro);
            res.status(500).json({ status: 500, msg: "Erro interno do servidor" });
        });
    }

    anexosDoCredenciamento(id_credenciamento, res) {
        const sql = `
            SELECT 
                documento_credenciamento.id AS id_documento_credenciamento, 
                checklist_credenciamento.nome AS item_checklist, 
                documento_credenciamento.id_credenciamento, 
                status.id AS id_status,
                status.nome AS status, 
                documento_credenciamento.anexo, 
                documento_credenciamento.observacao,
                DATE_FORMAT(documento_credenciamento.dataHoraCriacao, "%d-%m-%Y") AS dataHoraCriacao
            FROM documento_credenciamento
            INNER JOIN status ON status.id = documento_credenciamento.status
            INNER JOIN checklist_credenciamento ON checklist_credenciamento.id = documento_credenciamento.id_checklist_credenciamento
            WHERE documento_credenciamento.id_credenciamento = ?
            ORDER BY documento_credenciamento.id DESC
        `;

        conexao.query(sql, [id_credenciamento], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

}

module.exports = new Credenciamento();
