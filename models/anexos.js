const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const permissoes = require('../helpers/permissoes');

class Anexo {
    adiciona(anexo, res) {
        const { id_usuario, titulo, link, coautor, id_gt, id_permissao, id_orientacao, email_orientador, orientando } = anexo;
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

        if (id_permissao.includes(permissoes.eventos)) {
            const { id_usuario, titulo, link, coautor, id_gt } = anexo;
            let sql = `SELECT anexosxmembrosxgt.titulo FROM anexosxmembrosxgt WHERE anexosxmembrosxgt.titulo = ?`;
            conexao.query(sql, [titulo], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    if (resultados.length > 0) {
                        res.status(400).json({ status: 400, msg: `Um documento com o titulo "${titulo}", já foi anexo no sistema!` });
                        return;
                    }
                    sql = `INSERT INTO anexosxmembrosxgt SET ?`;
                    conexao.query(sql, { id_usuario, titulo, link, coautor, id_gt, dataHoraCriacao }, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "Anexo cadastrado com sucesso" });
                        }
                    });
                }
            });
            return;
        }
    }

    atualiza(id, valores, res) {
        const { id_permissao } = valores;
        let sql = ``;
        let dataHoraAtualizacao = moment().format('YYYY-MM-DD HH:mm:ss');

        if (id_permissao.includes(permissoes.grupo_trabalho)) {
            const { id_status, anexo_resposta, observacao, idUsuarioMovto} = valores;

            sql = `UPDATE anexosxmembrosxgt SET ? WHERE anexosxmembrosxgt.id = ?`;
            conexao.query(sql, [{ id_status, anexo_resposta, observacao, idUsuarioMovto, dataHoraAtualizacao }, id], (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    res.status(200).json({ status: 200, msg: "Anexo atualizado com sucesso!" });
                }
            });
            return;
        }
    }
}

module.exports = new Anexo;