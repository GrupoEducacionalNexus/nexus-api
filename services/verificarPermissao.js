const conexao = require('../infraestrutura/conexao');

const verificarPermissao = async (id_usuario, id_permissao) => {
    
    try {
        // Dados do usuário
        let sql = `SELECT usuariosxpermissoes.id_usuario FROM usuarios
        WHERE usuarios.id_usuario = ? AND usuarios.id_permissao = ?`;

        const resultados = await new Promise((resolve, reject) => {
            conexao.query(sql, [id_usuario, id_permissao], (erro, resultados) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });

        console.log(resultados);

        if (resultados.length > 0) {
            return resultados;
        }

        return [];
    } catch (erro) {
        // Trate o erro aqui
        console.error('Erro na função verificarPermissao do usuário:', erro);
        return [];
    }
};

module.exports = { verificarPermissao }; 