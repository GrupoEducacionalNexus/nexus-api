const moment = require('moment');

const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const permissoes = require('../helpers/permissoes');

class Anexo {
    adiciona(anexo, res) {
        const { id_usuario, nome, link, coautor, id_grupoTrabalho, id_permissao, id_orientacao, email_orientador, orientando } = anexo;
        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        let sql = ``;


        if (id_permissao.includes(permissoes.orientandos)) {
            const anexoDatado = { id_usuario, nome, link, coautor: 0, dataHoraCriacao };
            sql = `INSERT INTO anexos SET ?`;
            conexao.query(sql, anexoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    const id_anexo = resultados.insertId;
                    sql = `INSERT INTO orientacaoxanexosxorientandos SET ?`;
                    conexao.query(sql, { id_orientacao, id_anexo, id_orientando: id_usuario, dataHoraCriacao }, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "Arquivo cadastrado com sucesso." });
                            enviarEmail(`${email_orientador.trim()}`, "Mensagem sobre anexo de arquivo!",
                            `<b>O orientando(a) ${orientando}, enviou um novo arquivo referente a orientação de número: ${id_orientacao}, 
                        acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!.<b/>`);
                        }
                    });
                }
            });
            return;
        }

        const anexoDatado = { id_usuario, nome, link, coautor, dataHoraCriacao };
        sql = `INSERT INTO anexos SET ?`;
        conexao.query(sql, anexoDatado, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                sql = `INSERT INTO anexosxmembros SET ?`;
                conexao.query(sql, { id_usuario, id_anexo: resultados.insertId, id_grupoTrabalho, dataHoraCriacao }, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        res.status(200).json({ status: 200, msg: "Anexo cadastrado com sucesso" });
                    }
                });
            }
        });

    }
}

module.exports = new Anexo;