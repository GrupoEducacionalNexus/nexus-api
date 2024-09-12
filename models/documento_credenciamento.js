const moment = require('moment');
const AWS = require("aws-sdk");
const conexao = require('../infraestrutura/conexao');
const socket = require('../services/socket');
const conectados = require('../services/conectados');
const { listaDeUsuariosDoSetor } = require('../services/listaDeusuariosDoSetor');
const { registrarNoficacao } = require('../services/registrarNotificacao');
const { buscarUsuario } = require('../services/buscaUsuario');
const { sendEmailNotification } = require('../services/emailService');

class DocumentoCredenciamento {

    adiciona(documentoCredenciamento, res) {
        const { id_credenciamento, id_usuario, id_checklist_credenciamento, anexo, status, cnpj, razao_social } = documentoCredenciamento;

        const io = socket.getIO();
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const documentoCredenciamentoDatado = { id_credenciamento, id_usuario, id_checklist_credenciamento, anexo, status, observacao: 0, dataHoraCriacao };

        const sql = `INSERT INTO documento_credenciamento SET ?`;

        conexao.query(sql, documentoCredenciamentoDatado, async (erro, resultados) => {
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
                // Envio do e-mail de notificação
                const emailSubject = `Novo anexo adicionado por ${razao_social}`;
                const emailMessage = `
                                    <p>Um novo documento foi adicionado ao credenciamento da razão social: <strong>${razao_social}</strong>.</p>
                                    <p><strong>Anexo:</strong> ${anexo}</p>
                                    <p><strong>Status:</strong> ${status}</p>
                                    <p><strong>Data de envio:</strong> ${dataHoraCriacao}</p>
                                `;
                await sendEmailNotification('emaildestinatario@empresa.com', emailSubject, emailMessage);
                res.status(200).json({ status: 200, msg: "Documento anexado com sucesso." });
            }
        });
    }

    altera(id, valores, res) {
        const { id_status, observacao, email, item_checklist } = valores;
        const sql = `UPDATE documento_credenciamento SET ? WHERE documento_credenciamento.id = ?`;

        conexao.query(sql, [{ status: id_status, observacao: observacao.length > 0 ? observacao : 0 }, id], async (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                const io = socket.getIO();
                buscarUsuario(email).then(result => {
                    if (result.length > 0) {
                        if (conectados.find(objeto => objeto.nome === result[0].nome)) {
                            io.to(conectados.find(objeto => objeto.nome === result[0].nome).id).emit('notification', { message: `O documento anexado referente ao item do checklist "${item_checklist}" recebeu uma nova avaliação.` });
                        }
                        registrarNoficacao(`O documento anexado referente ao item do checklist "${item_checklist}" recebeu uma nova avaliação.`, 9, result[0].id);
                    }
                });
                const emailSubject = `Alteração no status do anexo referente ao item: ${item_checklist}`;
                const emailMessage = `
                    <p>O status do documento referente ao item do checklist <strong>${item_checklist}</strong> foi atualizado.</p>
                    <p><strong>Status Atual:</strong> ${id_status}</p>
                    <p><strong>Observação:</strong> ${observacao}</p>
                `;
                await sendEmailNotification(email, emailSubject, emailMessage);

                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }

    // deleta(id, anexo, res) {
    //     const S3_BUCKET = 'gestor-administrativo';
    //     const s3 = new AWS.S3({
    //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //         secretAccessKey: process.env.AWS_SECRET_KEY,
    //         region: 'us-east-1',
    //     });

    //     const params = {
    //         Bucket: S3_BUCKET,
    //         Key: anexo.split('/').pop(),  // Extrair o nome do arquivo da URL
    //     };

    //     // Deletar o arquivo do S3
    //     s3.deleteObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Erro ao deletar do S3:', err);
    //             return res.status(500).json({ status: 500, msg: 'Erro ao deletar arquivo do S3' });
    //         }

    //         // Deletar o documento do banco de dados
    //         const sql = 'DELETE FROM documento_credenciamento WHERE id = ?';
    //         conexao.query(sql, [id], (erro, resultados) => {
    //             if (erro) {
    //                 console.error('Erro ao deletar do banco:', erro);
    //                 return res.status(400).json({ status: 400, msg: erro });
    //             } else {
    //                 res.status(200).json({ status: 200, msg: 'Documento deletado com sucesso.' });
    //             }
    //         });
    //     });
    // }
}

module.exports = new DocumentoCredenciamento;
