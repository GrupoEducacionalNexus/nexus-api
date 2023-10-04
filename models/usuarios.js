const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const permissoes = require('../helpers/permissoes');

class Usuario {

    adiciona(usuario, res) {
        const { email } = usuario;
        let sql = `SELECT * FROM usuarios WHERE email = ?`;
        conexao.query(sql, [email], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe um usuário cadastrado com esse email.", status: 400 })
                } else {
                    const dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
                    const usuarioDatado = { ...usuario, dataHoraCriacao }
                    sql = `INSERT INTO usuarios SET ?`;
                    conexao.query(sql, usuarioDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 200, msg: "usuário cadastrado com sucesso" });
                        }
                    });
                }
            }
        });
    }

    altera(id, valores, res) {
        const { email } = valores;
        console.log(valores)
        let sql = `SELECT * FROM usuarios WHERE usuarios.email = ?`;
        conexao.query(sql, [email], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    sql = 'UPDATE usuarios SET ? WHERE id = ?';
                    conexao.query(sql, [valores, id],(erro, resultados) => {
                        if(erro) {
                            res.status(400).json({status: 400, msg: erro})
                        } else {
                            res.status(200).json({status: 200, msg: "Atualizado com sucesso."});
                        }
                    });
                } else {
                    res.status(400).json({ msg: "Nenhuma informação encontrada para esse email.", status: 400 })
                }
            }
        });
    }

    lista(res) {
        let sql = `SELECT usuarios.id, usuarios.cpf_cnpj, usuarios.nome,
        usuarios.email, usuarios.status,
        DATE_FORMAT(usuarios.dataHoraCriacao, '%d/%m/%Y %H:%i:%s') AS dataHoraCriacao,
        usuarios.senha, usuarios.id_setor
        from usuarios
        LEFT JOIN usuariosxpermissoes ON usuariosxpermissoes.id_usuario = usuarios.id
        ORDER BY usuarios.nome DESC`;
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });  
            }
        });

    }

    busca(id, res) {
        let sql = `SELECT usuarios.id, usuarios.nome, usuarios.email, usuarios.cpf_cnpj, usuarios.senha,
        usuarios.id_setor
         FROM usuarios WHERE usuarios.id = ?`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados }); 
            }
        });

    }

    listaDePermissoes(id, res) {
        const sql = `SELECT usuarios.id, usuarios.email, usuarios.nome, usuarios.senha, usuarios.id_setor,
        usuariosxpermissoes.id_permissao, permissoes.nome AS permissao
        FROM usuarios  
        INNER JOIN usuariosxpermissoes ON usuariosxpermissoes.id_usuario = usuarios.id
        INNER JOIN permissoes ON usuariosxpermissoes.id_permissao = permissoes.id
        WHERE usuarios.id = ? ORDER BY permissoes.nome`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeNotificacoes(id, res) {
        const sql = `SELECT notificacoes.id, notificacoes.descricao, notificacoes.id_tipo_notificacao,
        DATE_FORMAT(notificacoes.dataHoraCriacao, "%d-%m-%Y às %H:%i") AS dataHoraCriacao
         FROM notificacoes WHERE notificacoes.id_usuario = ? ORDER BY notificacoes.id DESC`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    buscaSolicitacaoDeCredenciamento(id, res) {
        const sql = `SELECT usuarios.id AS id_usuario, usuarios.nome AS gestor, 
        usuarios.email, usuarios.telefone, usuarios.cpf_cnpj, usuarios.senha,
        instituicoes.id AS id_instituicao, instituicoes.cnpj, 
        instituicoes.nome_fantasia, instituicoes.razao_social,
        estados.id as id_estado, estados.nome AS estado, estados.sigla,
        credenciamento.id AS id_credenciamento, credenciamento.observacao, 
        status.id AS id_status, status.nome AS status, credenciamento.id AS id_credenciamento
        FROM credenciamento 
        inner join usuarios on usuarios.id = credenciamento.id_usuario 
        inner join estados on estados.id = credenciamento.id_estado 
        inner join instituicoes on instituicoes.id = credenciamento.id_instituicao 
        inner join status on status.id = credenciamento.status
        WHERE credenciamento.id_usuario = ?;`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new Usuario;