const conexao = require('../infraestrutura/conexao');

const listaDeUsuariosDoSetor = async (idSetor) => {
    try {
        const sql = `SELECT usuarios.id AS id_usuario, usuarios.nome FROM usuarios WHERE usuarios.id_setor = ?`;

        const resultados = await new Promise((resolve, reject) => {
            conexao.query(sql, [idSetor], (erro, resultados) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });

        if (resultados.length > 0) {
            return resultados;
        } else {
            return [];
        }

    } catch (erro) {
        return erro;
    }
}

module.exports = { listaDeUsuariosDoSetor }; 