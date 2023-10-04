const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const socket = require('../services/socket');
const conectados = require('../services/conectados');
const { listaDeParticipantesDoChamado } = require('../services/participantesDoChamado');
const { registrarNoficacao } = require('../services/registrarNotificacao');

class Comentario {
    adiciona(comentario, res) {
        const { id_usuario, id_chamado, descricao, nome_usuario, id_setor, anexo } = comentario;
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');      
        
        const comentarioDatado = { id_usuario, id_chamado, descricao, anexo, dataHoraCriacao };

        let sql = `INSERT INTO chamadosxcomentarios SET ?`;
        conexao.query(sql, comentarioDatado, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({ status: 200, msg: "Comentário cadastrado com sucesso" });
                
                const io = socket.getIO();

                listaDeParticipantesDoChamado(id_chamado).then(result => {
                    result.map(item => {  
                        if(conectados.find(objeto => objeto.nome === item.nome)) {
                            io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `${nome_usuario} fez um novo comentário no chamado ${id_chamado}` });
                        }
                        registrarNoficacao(`${nome_usuario} fez um novo comentário no chamado ${id_chamado}`, 1, item.id_usuario);
                    });
                });
            } 
        });
    }

}

module.exports = new Comentario;