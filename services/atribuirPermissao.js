const conexao = require('../infraestrutura/conexao');
const moment = require('moment');

const atribuirPermissao = async (id_usuario, id_permissao) => {
    try {
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const sql = `INSERT INTO usuariosxpermissoes SET ?`;
        const resultado = await new Promise((resolve, reject) => {
            conexao.query(sql, { id_usuario, id_permissao, dataHoraCriacao }, (erro, resultados) => {
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
        console.error('Erro na função buscar usuário:', erro);
        return 0;
    }
}

module.exports = { atribuirPermissao }