const conexao = require('../infraestrutura/conexao');

const buscarSetorResponsavel = async (idChamado) => {

    //Lista de usuários dos setores que participam 
    const sql = `SELECT chamados.idSetorResponsavel FROM chamados WHERE chamados.id = ?`;

    try {
        const resultados = await new Promise((resolve, reject) => {
            conexao.query(sql, [idChamado], (erro, resultados) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });

        if (resultados.length > 0) {
            return resultados[0].idSetorResponsavel;
        } 
    } catch (erro) {
        return erro;
    }
}

module.exports = { buscarSetorResponsavel }; 