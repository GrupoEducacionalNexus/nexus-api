const conexao = require('../infraestrutura/conexao');

const atualizarUsuario = async (id, usuario) => {
    try {
        const sql = `UPDATE usuarios SET ? WHERE usuarios.id = ?`;
        const resultado = await new Promise((resolve, reject) => {
            conexao.query(sql, [usuario, id], (erro, resultados) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });

        if(resultado.affectedRows > 0) {
            return resultado.affectedRows;
        } else {
            return 0;
        }
    } catch (erro) {
        // Trate o erro aqui
        console.error('Erro na função atualizar usuário:', erro);
        return 0;
    }
}

module.exports = { atualizarUsuario }