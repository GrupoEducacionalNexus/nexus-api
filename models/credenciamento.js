const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const { buscarUsuario } = require('../services/buscaUsuario');
const { atribuirPermissao } = require('../services/atribuirPermissao');
const { cadastrarUsuario } = require('../services/cadastrarUsuario');
const { atualizarUsuario } = require('../services/atualizarUsuario');
const socket = require('../services/socket');
const conectados = require('../services/conectados');
const { listaDeUsuariosDoSetor } = require('../services/listaDeusuariosDoSetor');
const { registrarNoficacao } = require('../services/registrarNotificacao');
const { verificarPermissao } = require('../services/verificarPermissao');


class Credenciamento {

    adiciona(credenciamento, res) {
        const io = socket.getIO();

        const {
            nome, email, telefone, cpf,
            senha, cnpj, razao_social,
            nome_fantasia, id_instituicao,
            id_estado, cidade
        } = credenciamento;

        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        let sql = ``;

        buscarUsuario(email).then(result => {
            //Verifica se o solicitante está cadastrado

            if (result.length > 0) {
                console.log(result[0].id)
                const id_usuario = result[0].id;
                sql = `SELECT * FROM credenciamento WHERE credenciamento.id_usuario = ?`;

                conexao.query(sql, [id_usuario], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                        return
                    }

                    //Verifica se a solicitação já foi realizada
                    if (resultados.length > 0) {
                        res.status(400).json({ msg: "Você já solicitou credenciamento", status: 400 });
                        return
                    }

                    //Verificar se o usuário já possui a permissão
                    verificarPermissao(id_usuario, 15).then(result => {
                        if (result.length > 0) {
                            //Registra a solicitafção de credenciamento
                            sql = `INSERT INTO credenciamento SET ?`;
                            conexao.query(sql, credenciamentoDatado, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                    return;
                                }

                                listaDeUsuariosDoSetor(2).then(result => {
                                    result.map(item => {
                                        if (conectados.find(objeto => objeto.nome === item.nome)) {
                                            io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `O cnpj ${cnpj} com a razão social ${razao_social} solicitou credenciamento` });
                                        }
                                        registrarNoficacao(`O cnpj ${cnpj} com a razão social "${razao_social}" solicitou credenciamento`, 7, item.id_usuario);
                                    });
                                });

                                res.status(200).json({ status: 200, msg: "Solicitação de credenciamento confirmada com sucesso" });

                                enviarEmail(`solicitacoes@centroeducanexus.com.br`, "SOLICITAÇÃO DE CREDENCIAMENTO",
                                    `<b>
                                        <p>SEGUE OS DADOS DO SOLICITANTE:</p>
                                        <p>CNPJ: ${cnpj.toUpperCase()}</p>
                                        <p>RAZÃO SOCIAL:  ${razao_social.toUpperCase()}</p>
                                        <p>NOME FANTASIA:  ${nome_fantasia.toUpperCase()}</p>
                                        <p>E-MAIL DO POLO:  ${email.toUpperCase()}</p>
                                        <p>TELEFONE:  ${telefone.toUpperCase()}</p>
                                    <b/>`);
                                    
                            });
                            return
                        }

                        verificarPermissao(id_usuario, 15).then(result => {
                            if (result.length > 0) {
                                //Registra a solicitafção de credenciamento
                                sql = `INSERT INTO credenciamento SET ?`;
                                conexao.query(sql, credenciamentoDatado, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                        return;
                                    }

                                    listaDeUsuariosDoSetor(2).then(result => {
                                        result.map(item => {
                                            if (conectados.find(objeto => objeto.nome === item.nome)) {
                                                io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `O cnpj ${cnpj} com a razão social ${razao_social} solicitou credenciamento` });
                                            }
                                            registrarNoficacao(`O cnpj ${cnpj} com a razão social "${razao_social}" solicitou credenciamento`, 7, item.id_usuario);
                                        });
                                    });

                                    res.status(200).json({ status: 200, msg: "Solicitação de credenciamento confirmada com sucesso" });

                                    enviarEmail(`solicitacoes@centroeducanexus.com.br`, "SOLICITAÇÃO DE CREDENCIAMENTO",
                                        `<b>
                                        <p>SEGUE OS DADOS DO SOLICITANTE:</p>
                                        <p>CNPJ: ${cnpj.toUpperCase()}</p>
                                        <p>RAZÃO SOCIAL:  ${razao_social.toUpperCase()}</p>
                                        <p>NOME FANTASIA:  ${nome_fantasia.toUpperCase()}</p>
                                        <p>E-MAIL DO POLO:  ${email.toUpperCase()}</p>
                                        <p>TELEFONE:  ${telefone.toUpperCase()}</p>
                                    <b/>`);
                                });
                                return
                            }
                            //Atribuir permissão de gestor
                            atribuirPermissao(id_usuario, 15).then(insertId => {
                                if (insertId > 0) {
                                    const credenciamentoDatado = { id_usuario, id_instituicao, id_estado, cidade, observacao: 0, status: 5, dataHoraCriacao };

                                    //Registra a solicitafção de credenciamento
                                    sql = `INSERT INTO credenciamento SET ?`;
                                    conexao.query(sql, credenciamentoDatado, (erro, resultados) => {
                                        if (erro) {
                                            res.status(400).json(erro);
                                            return;
                                        }

                                        listaDeUsuariosDoSetor(2).then(result => {
                                            result.map(item => {
                                                if (conectados.find(objeto => objeto.nome === item.nome)) {
                                                    io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `O cnpj ${cnpj} com a razão social ${razao_social} solicitou credenciamento` });
                                                }
                                                registrarNoficacao(`O cnpj ${cnpj} com a razão social "${razao_social}" solicitou credenciamento`, 7, item.id_usuario);
                                            });
                                        });

                                        res.status(200).json({ status: 200, msg: "Solicitação de credenciamento confirmada com sucesso" });

                                        enviarEmail(`solicitacoes@centroeducanexus.com.br`, "SOLICITAÇÃO DE CREDENCIAMENTO",
                                            `<b>
                                        <p>SEGUE OS DADOS DO SOLICITANTE:</p>
                                        <p>CNPJ: ${cnpj.toUpperCase()}</p>
                                        <p>RAZÃO SOCIAL:  ${razao_social.toUpperCase()}</p>
                                        <p>NOME FANTASIA:  ${nome_fantasia.toUpperCase()}</p>
                                        <p>E-MAIL DO POLO:  ${email.toUpperCase()}</p>
                                        <p>TELEFONE:  ${telefone.toUpperCase()}</p>
                                    <b/>`);
                                    });
                                }
                            });
                        })
                    });
                });
                return
            }

            cadastrarUsuario({ nome, email, telefone, cpf_cnpj: cpf, senha, dataHoraCriacao }).then(insertId => {
                if (insertId > 0) {
                    atribuirPermissao(insertId, 15).then(insertId => {
                        if (insertId > 0) {
                            const credenciamentoDatado = { id_usuario: insertId, id_instituicao, id_estado, cidade, observacao: 0, status: 5, dataHoraCriacao };

                            //Registra a solicitafção de credenciamento
                            sql = `INSERT INTO credenciamento SET ?`;
                            conexao.query(sql, credenciamentoDatado, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                    return;
                                }

                                listaDeUsuariosDoSetor(2).then(result => {
                                    result.map(item => {
                                        if (conectados.find(objeto => objeto.nome === item.nome)) {
                                            io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `O cnpj ${cnpj} com a razão social ${razao_social} solicitou credenciamento` });
                                        }
                                        registrarNoficacao(`O cnpj ${cnpj} com a razão social "${razao_social}" solicitou credenciamento`, 7, item.id_usuario);
                                    });
                                });

                                res.status(200).json({ status: 200, msg: "Solicitação de credenciamento confirmada com sucesso" });

                                enviarEmail(`solicitacoes@centroeducanexus.com.br`, "SOLICITAÇÃO DE CREDENCIAMENTO",
                                    `<b>
                                    <p>SEGUE OS DADOS DO SOLICITANTE:</p>
                                    <p>CNPJ: ${cnpj.toUpperCase()}</p>
                                    <p>RAZÃO SOCIAL:  ${razao_social.toUpperCase()}</p>
                                    <p>NOME FANTASIA:  ${nome_fantasia.toUpperCase()}</p>
                                    <p>E-MAIL DO POLO:  ${email.toUpperCase()}</p>
                                    <p>TELEFONE:  ${telefone.toUpperCase()}</p>
                                <b/>`);
                            });
                        }
                    });
                }
            });
        });
    }

    altera(id, valores, res) {
        const { id_usuario, nome, email, telefone, cpf,
            senha, id_instituicao, cnpj, razao_social, nome_fantasia, status } = valores;

        atualizarUsuario(id_usuario, { nome, email, telefone, cpf_cnpj: cpf, senha }).then(affectedRows => {
            if (affectedRows > 0) {
                let sql = `UPDATE instituicoes SET ? WHERE instituicoes.id = ?`;
                conexao.query(sql, [{
                    cnpj, razao_social, nome_fantasia
                }, id_instituicao], (erro, resultados) => {
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
        });
    }

    anexosDoCredenciamento(id_credenciamento, res) {
        const sql = `SELECT documento_credenciamento.id as id_documento_credenciamento, 
        checklist_credenciamento.nome as item_checklist, 
        documento_credenciamento.id_credenciamento, status.id AS id_status,
         status.nome AS status, 
        documento_credenciamento.anexo, documento_credenciamento.observacao,
        DATE_FORMAT(documento_credenciamento.dataHoraCriacao, "%d-%m-%Y") AS dataHoraCriacao
        FROM documento_credenciamento
        INNER JOIN status on status.id = documento_credenciamento.status
        INNER JOIN checklist_credenciamento on checklist_credenciamento.id = documento_credenciamento.id_checklist_credenciamento
        WHERE documento_credenciamento.id_credenciamento = ?
        ORDER BY documento_credenciamento.id DESC`;

        conexao.query(sql, [id_credenciamento], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

}

module.exports = new Credenciamento;