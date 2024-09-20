// src/models/DocumentoCredenciamento.js

const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const socket = require('../services/socket');
const conectados = require('../services/conectados');
const { listaDeUsuariosDoSetor } = require('../services/listaDeusuariosDoSetor');
const { registrarNoficacao } = require('../services/registrarNotificacao');
const { buscarUsuario } = require('../services/buscaUsuario');
const enviarEmail = require('../services/send-email');

class DocumentoCredenciamento {

    async adiciona(documentoCredenciamento, res) {
        const {
            id_credenciamento,
            id_usuario,
            id_checklist_credenciamento,
            anexo,
            status,
            cnpj,
            razao_social
        } = documentoCredenciamento;

        console.log('Iniciando processo de adição de documento:', documentoCredenciamento);

        const io = socket.getIO();
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const documentoCredenciamentoDatado = {
            id_credenciamento,
            id_usuario,
            id_checklist_credenciamento,
            anexo,
            status,
            observacao: 0,
            dataHoraCriacao
        }

        const sql = `INSERT INTO documento_credenciamento SET ?`;

        try {
            const resultado = await new Promise((resolve, reject) => {
                conexao.query(sql, documentoCredenciamentoDatado, (erro, resultados) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        resolve(resultados);
                    }
                });
            });

            console.log('Documento de credenciamento inserido com sucesso:', resultado);

            // Busca usuários do setor 2
            const usuarios = await listaDeUsuariosDoSetor(2);
            console.log(`Usuários do setor 2 encontrados: ${usuarios.length}`);

            // Para cada usuário, envia notificações e e-mails
            await Promise.all(usuarios.map(async (item) => {
                const usuarioConectado = conectados.find(objeto => objeto.nome === item.nome);
                if (usuarioConectado) {
                    // Envio de notificação via socket
                    io.to(usuarioConectado.id).emit('notification', { message: `O cnpj ${cnpj} com a razão social ${razao_social} anexou um novo documento` });
                    console.log(`Notificação enviada via socket para ${item.nome}`);
                }

                // Envio do e-mail de notificação
                const emailSubject = `Novo anexo adicionado por ${razao_social}`;
                const emailMessage = `
                    <p>Um novo documento foi adicionado ao credenciamento da razão social: <strong>${razao_social}</strong>.</p>
                    <p><strong>Anexo:</strong> ${anexo}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Data de envio:</strong> ${dataHoraCriacao}</p>
                `;
                try {
                    await enviarEmail(
                        'solicitacoes@centroeducanexus.com.br', // Substitua pelo e-mail correto do destinatário
                        emailSubject,
                        emailMessage
                    );
                    console.log(`E-mail enviado para solicitacoes@centroeducanexus.com.br referente a ${razao_social}`);
                } catch (emailError) {
                    console.error(`Erro ao enviar e-mail para solicitacoes@centroeducanexus.com.br referente a ${razao_social}:`, emailError);
                }

                // Registro de notificação no banco de dados
                try {
                    await registrarNoficacao(
                        `O cnpj ${cnpj} com a razão social "${razao_social}" anexou um novo documento`, 
                        8, 
                        item.id_usuario
                    );
                    console.log(`Notificação registrada para o usuário ID ${item.id_usuario}`);
                } catch (notificacaoError) {
                    console.error(`Erro ao registrar notificação para o usuário ID ${item.id_usuario}:`, notificacaoError);
                }
            }));

            res.status(200).json({ status: 200, msg: "Documento anexado com sucesso." });
        } catch (erro) {
            console.error('Erro ao adicionar documento de credenciamento:', erro);
            res.status(400).json({ status: 400, msg: erro.message || erro });
        }
    }

    async altera(id, valores, res) {
        const { id_status, observacao, email, item_checklist } = valores;
        console.log(`Recebido para atualização: id=${id}, id_status=${id_status}, observacao=${observacao}, email=${email}, item_checklist=${item_checklist}`);

        // Ajuste o SQL conforme o nome correto da coluna no banco de dados
        const sql = `UPDATE documento_credenciamento SET status = ?, observacao = ? WHERE id = ?`;
        const statusAtualizado = observacao.length > 0 ? observacao : 0;

        try {
            const resultado = await new Promise((resolve, reject) => {
                conexao.query(sql, [id_status, statusAtualizado, id], (erro, resultados) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        resolve(resultados);
                    }
                });
            });

            console.log(`Documento com ID ${id} atualizado com sucesso. Resultado:`, resultado);

            const io = socket.getIO();

            const usuarios = await buscarUsuario(email);
            console.log(`Usuário encontrado para o e-mail ${email}:`, usuarios);

            if (usuarios.length > 0) {
                const usuario = usuarios[0];
                const usuarioConectado = conectados.find(objeto => objeto.nome === usuario.nome);
                if (usuarioConectado) {
                    io.to(usuarioConectado.id).emit('notification', { message: `O documento anexado referente ao item do checklist "${item_checklist}" recebeu uma nova avaliação.` });
                    console.log(`Notificação enviada via socket para ${usuario.nome}`);
                }

                // Registro de notificação no banco de dados
                try {
                    await registrarNoficacao(
                        `O documento anexado referente ao item do checklist "${item_checklist}" recebeu uma nova avaliação.`,
                        9,
                        usuario.id
                    );
                    console.log(`Notificação registrada para o usuário ID ${usuario.id}`);
                } catch (notificacaoError) {
                    console.error(`Erro ao registrar notificação para o usuário ID ${usuario.id}:`, notificacaoError);
                }

                // Envio de e-mail após atualização
                const emailSubject = `Atualização no Documento do Checklist "${item_checklist}"`;
                const emailMessage = `
                    <p>O documento anexado referente ao item do checklist "<strong>${item_checklist}</strong>" recebeu uma nova avaliação.</p>
                    <p><strong>Status:</strong> ${id_status}</p>
                    <p><strong>Observação:</strong> ${observacao || 'Nenhuma'}</p>
                `;
                try {
                    await enviarEmail(
                        email, // E-mail do usuário que deve receber a notificação
                        emailSubject,
                        emailMessage
                    );
                    console.log(`E-mail enviado para ${email} referente à atualização do checklist "${item_checklist}"`);
                } catch (emailError) {
                    console.error(`Erro ao enviar e-mail para ${email}:`, emailError);
                }
            } else {
                console.warn(`Nenhum usuário encontrado com o e-mail ${email}.`);
            }

            res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
        } catch (erro) {
            console.error('Erro ao atualizar documento de credenciamento:', erro);
            res.status(400).json({ status: 400, msg: erro.message || erro });
        }
    }
}

module.exports = new DocumentoCredenciamento;
