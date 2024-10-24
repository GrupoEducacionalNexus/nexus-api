const conexao = require('../infraestrutura/conexao');

const cadastrarUsuario = async (usuario) => {
    console.log(usuario);
    
    try {
        const sql = `INSERT INTO usuarios SET ?`;
        const resultado = await new Promise((resolve, reject) => {
            conexao.query(sql, usuario, (erro, resultados) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });

        if(resultado.insertId > 0) {
            return resultado.insertId;
        } else {
            return 0;
        }
    } catch (erro) {
        // Trate o erro aqui
        console.error('Erro na função cadastrar usuário:', erro);
        return 0;
    }
}

module.exports = { cadastrarUsuario }