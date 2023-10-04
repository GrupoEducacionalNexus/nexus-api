const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const socket = require('../services/socket');
const conectados = require('../services/conectados');
const { listaDeUsuariosDoSetor } = require('../services/listaDeusuariosDoSetor');
const { registrarNoficacao } = require('../services/registrarNotificacao');
const { buscarUsuario } = require('../services/buscaUsuario');

class DocumentoCredenciamento {

    adiciona(documentoCredenciamento, res) {
       
        const { id_credenciamento, id_usuario, id_checklist_credenciamento,
            anexo, status, cnpj, razao_social } = documentoCredenciamento;

        const io = socket.getIO();
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const documentoCredenciamentoDatado = { id_credenciamento, id_usuario, id_checklist_credenciamento,
            anexo, status, observacao: 0, dataHoraCriacao }
        
        const sql = `INSERT INTO documento_credenciamento SET ?`;

        conexao.query(sql, documentoCredenciamentoDatado, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                listaDeUsuariosDoSetor(2).then(result => {
                    result.map(item => {
                        if (conectados.find(objeto => objeto.nome === item.nome)) {
                            io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `O cnpj ${cnpj} com a razão social ${razao_social} anexou um novo documento` });
                        }
                        registrarNoficacao(`O cnpj ${cnpj} com a razão social "${razao_social}" anexou um novo documento`, 8, item.id_usuario);
                    });
                });
                res.status(200).json({ status: 200, msg: "Documento anexado com sucesso." });
            }
        });
    }

    altera(id, valores, res) {
        const { id_status, observacao, email, item_checklist } = valores;
        console.log(item_checklist);

        const sql = `UPDATE documento_credenciamento SET ? WHERE documento_credenciamento.id = ?`;
        conexao.query(sql, [{ status: id_status, observacao: observacao.length > 0 ? observacao: 0  }, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                console.log(email);
                const io = socket.getIO();
               
                buscarUsuario(email).then(result => {
                    console.log(result);
                    if(result.length > 0) {
                        if (conectados.find(objeto => objeto.nome === result[0].nome)) {
                            io.to(conectados.find(objeto => objeto.nome === result[0].nome).id).emit('notification', { message: `O documento anexado referente ao item do checklist "${item_checklist}" recebeu uma nova avaliação.` });
                        }
                        registrarNoficacao(`O documento anexado referente ao item do checklist "${item_checklist}" recebeu uma nova avaliação.`, 9, result[0].id);
                    }
                });
                
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }
}

module.exports = new DocumentoCredenciamento;