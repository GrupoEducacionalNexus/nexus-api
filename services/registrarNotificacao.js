const conexao = require('../infraestrutura/conexao');
const moment = require('moment');

const registrarNoficacao = async (descricao, id_tipo_notificacao, id_usuario) => {
    try {
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const sql = `INSERT INTO notificacoes SET ?`;
        const resultado = await new Promise((resolve, reject) => {
            conexao.query(sql, { descricao, id_tipo_notificacao, id_usuario, dataHoraCriacao }, (erro, resultados) => {
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

module.exports = { registrarNoficacao }