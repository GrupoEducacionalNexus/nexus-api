const conexao = require('../infraestrutura/conexao');

const listaDeParticipantesDoChamado = async (idChamado) => {
    try {
        //Lista de usuários dos setores que participam do chamado
        let sql = `SELECT usuarios.id AS id_usuario, usuarios.nome, usuarios.id_setor
        FROM chamadosxsetores
        INNER JOIN usuarios ON usuarios.id_setor = chamadosxsetores.id_setor
        WHERE chamadosxsetores.id_chamado = ?`;

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
            return resultados;
        }
    } catch (erro) {
        return erro;
    }
}

module.exports = { listaDeParticipantesDoChamado }; 