const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class GrupoTrabalho {

    listaDeMembros(id_grupoTrabalho, res) {
        const sql = `SELECT DISTINCT (SELECT count(anexosxmembros.id_anexo) FROM anexosxmembros WHERE anexosxmembros.id_grupoTrabalho = grupos_trabalho.id)
        AS totTrabalhosSubmetidos, 
        usuarios.id AS id_usuario, usuarios.nome, usuarios.email,
        grupos_trabalho.id AS id_grupoTrabalho, grupos_trabalho.nome AS grupo_trabalho
        FROM membrosxgrupos_trabalho
        INNER JOIN grupos_trabalho ON grupos_trabalho.id = membrosxgrupos_trabalho.id_grupo_trabalho
        INNER JOIN usuarios ON usuarios.id = membrosxgrupos_trabalho.id_membro
        LEFT JOIN anexosxmembros ON anexosxmembros.id_usuario = usuarios.id
        WHERE grupos_trabalho.id = ? GROUP BY usuarios.id`;

        conexao.query(sql, [id_grupoTrabalho], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }
}

module.exports = new GrupoTrabalho;