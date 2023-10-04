const conexao = require('../infraestrutura/conexao');

const registrarComentario = async (comentario) => {
    try {
        const sql = `INSERT INTO chamadosxcomentarios SET ?`;
        const resultado = await new Promise((resolve, reject) => {
            conexao.query(sql, comentario, (erro, resultados) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });

        if(resultado.insertId > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return error;
    }
}

module.exports = { registrarComentario };