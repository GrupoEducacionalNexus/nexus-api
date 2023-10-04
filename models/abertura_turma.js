const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const socket = require('../services/socket');
const conectados = require('../services/conectados');
const { listaDeUsuariosDoSetor } = require('../services/listaDeusuariosDoSetor');
const { registrarNoficacao } = require('../services/registrarNotificacao');

class AberturaTurma {
    adiciona(abertura_turma, res) {
        const io = socket.getIO();

        const { cnpj, razao_social, id_instituicao,
            email, telefone, observacao, metodologia, curso, id_estado
        } = abertura_turma; 
        
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const dataInicial = `${moment().format('YYYY-MM')}-01`;
        const dataFinal = `${moment().format('YYYY-MM')}-30`;        

        let sql = `SELECT * FROM abertura_turma WHERE abertura_turma.id_instituicao = ? AND
        abertura_turma.dataHoraCriacao >= ? AND 
        abertura_turma.dataHoraCriacao <= ?`; 

        conexao.query(sql, [id_instituicao, dataInicial, dataFinal], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else { 
                if (resultados.length > 0) {
                    res.status(400).json({ msg: `Você já solicitou abertura de turma no mês atual`, status: 400 });
                } else {
                    // const aberturaTurmaDatada = { id_instituicao , id_estado, email, telefone, observacao, dataHoraCriacao }
                    sql = `INSERT INTO abertura_turma SET ?`;

                    const aberturaTurma = { email, telefone, observacao, metodologia, curso: curso.length > 0 ? curso : 0,  
                        dataHoraCriacao, id_instituicao, id_estado };
                    
                    conexao.query(sql, aberturaTurma, (erro, resultados) => {
                        if (erro) {      
                            res.status(400).json(erro);      
                        } else {
                            listaDeUsuariosDoSetor(2).then(result => {
                                result.map(item => {
                                    if (conectados.find(objeto => objeto.nome === item.nome)) {
                                        io.to(conectados.find(objeto => objeto.nome === item.nome).id).emit('notification', { message: `O cnpj ${cnpj} com a razão social ${razao_social} solicitou abertura de turma` });
                                    }
                                    registrarNoficacao(`O cnpj ${cnpj} com a razão social "${razao_social}" solicitou abertura de turma`, 9, item.id_usuario);
                                });
                            });
                            
                            res.status(200).json({ status: 200, msg: "Solicitação de abertura de turma confirmada com sucesso" });
                            // enviarEmail(`solicitacoes@centroeducanexus.com.br`, "SOLICITAÇÃO DE ABERTURA DE TURMA",
                            // `<b>
                            //     <p>SEGUE OS DADOS DO SOLICITANTE:</p>
                            //     <p>CNPJ: ${cnpj.toUpperCase()}</p>
                            //     <p>RAZÃO SOCIAL:  ${razao_social.toUpperCase()}</p>
                            //     <p>NOME FANTASIA:  ${nome_fantasia.toUpperCase()}</p>
                            //     <p>E-MAIL DO POLO:  ${email.toUpperCase()}</p>
                            //     <p>TELEFONE:  ${telefone.toUpperCase()}</p>
                            //     <p>OBSERVAÇÃO:  ${observacao.toUpperCase()}</p>
                            // <b/>`);
                        }
                    });
                }
            }
        }); 
    }

    lista(fitro, res) {
        const {dataAtual, cnpj, nome_fantasia, data_solicitacao} = fitro;

        const consulta_dataAtual = dataAtual !== "" ? `AND DATE_FORMAT(abertura_turma.dataHoraCriacao, "%Y-%m-%d") = '${dataAtual}'` : ``;
        const consulta_cnpj = cnpj !== "" ? `AND instituicoes.cnpj LIKE '%${cnpj}%' ` : "";
        const consulta_nomeFantasia = nome_fantasia !== "" ? `AND instituicoes.nome_fantasia LIKE '%${nome_fantasia}%' ` : "";
        const consulta_dataSolicitacao = data_solicitacao !== "" ? `AND DATE_FORMAT(abertura_turma.dataHoraCriacao, "%Y-%m-%d") = '${data_solicitacao}' ` : "";

        const sql = `SELECT instituicoes.cnpj, instituicoes.nome_fantasia, 
        instituicoes.razao_social, abertura_turma.email AS email_solicitante, 
        abertura_turma.telefone, abertura_turma.observacao,
        DATE_FORMAT(abertura_turma.dataHoraCriacao, "%d-%m-%Y às %H:%i") AS dataHoraCriacao,
        estados.nome AS estado, abertura_turma.metodologia, abertura_turma.curso
        FROM abertura_turma
        INNER JOIN instituicoes on instituicoes.id = abertura_turma.id_instituicao
        INNER JOIN estados ON estados.id = abertura_turma.id_estado
        WHERE instituicoes.id <> 0 ${consulta_dataAtual} ${consulta_cnpj} ${consulta_nomeFantasia} ${consulta_dataSolicitacao} ORDER BY abertura_turma.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

}

module.exports = new AberturaTurma;