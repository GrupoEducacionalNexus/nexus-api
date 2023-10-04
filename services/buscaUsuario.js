const conexao = require('../infraestrutura/conexao');

const buscarUsuario = async (email) => {
    
    try {
        // Dados do usuário
        let sql = `SELECT usuarios.id, usuarios.nome, usuarios.email, usuarios.cpf_cnpj, usuarios.senha,
        usuarios.id_setor
        FROM usuarios WHERE usuarios.email = ?`;

        const resultados = await new Promise((resolve, reject) => {
            conexao.query(sql, [email], (erro, resultados) => {
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
        console.error('Erro na função buscar usuário:', erro);
        return [];
    }
};

module.exports = { buscarUsuario }; 