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
            email, telefone, observacao, metodologia, curso, id_estado, tipo_turma
        } = abertura_turma;

        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const dataInicial = `${moment().format('YYYY-MM-DD')}`;
        const dataFinal = `${moment().format('YYYY-MM-DD')}`;

        let sql = `SELECT * FROM abertura_turma WHERE abertura_turma.id_instituicao = ? AND abertura_turma.dataHoraCriacao >= ? AND abertura_turma.dataHoraCriacao <= ?`;

        conexao.query(sql, [id_instituicao, dataInicial, dataFinal], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: `Você já solicitou abertura de turma no mês atual`, status: 400 });
                } else {
                    //const aberturaTurmaDatada = { id_instituicao , id_estado, email, telefone, observacao, dataHoraCriacao }
                    sql = `INSERT INTO abertura_turma SET ?`;

                    const aberturaTurma = {
                        email, telefone, observacao, metodologia, curso: curso.length > 0 ? curso : "NEXUS - 25",
                        dataHoraCriacao, id_instituicao, id_estado, tipo_turma
                    };

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
                            enviarEmail(`solicitacoes@centroeducanexus.com.br`, "SOLICITAÇÃO DE ABERTURA DE TURMA",
                            `<b>
                                <p>SEGUE OS DADOS DO SOLICITANTE:</p>
                                <p>CNPJ: ${cnpj.toUpperCase()}</p>
                                <p>RAZÃO SOCIAL:  ${razao_social.toUpperCase()}</p>
                                <p>NOME FANTASIA:  ${nome_fantasia.toUpperCase()}</p>
                                <p>E-MAIL DO POLO:  ${email.toUpperCase()}</p>
                                <p>TELEFONE:  ${telefone.toUpperCase()}</p>
                                <p>OBSERVAÇÃO:  ${observacao.toUpperCase()}</p>
                                <p>TIPO DE TURMA:  ${tipo_turma.toUpperCase()}</p>
                            // <b/>`);
                        }
                    });
                }
            }
        });
    }

    lista(filtro, res) {
        const { dataAtual, cnpj, nome_fantasia, data_solicitacao, estado } = filtro;
       
        let where = `WHERE instituicoes.id <> 0 `;
        where += estado.trim() !== '' ? ` AND abertura_turma.id_estado = ${estado}` : ``;
        where += dataAtual !== "" ? ` AND DATE_FORMAT(abertura_turma.dataHoraCriacao, "%Y-%m-%d") = '${dataAtual}'` : ``;
        where += cnpj !== "" ? ` AND instituicoes.cnpj = '${cnpj}' ` : "";
        where += nome_fantasia !== "" ? ` AND instituicoes.nome_fantasia LIKE '%${nome_fantasia}%' ` : "";
        where += data_solicitacao !== "" ? ` AND DATE_FORMAT(abertura_turma.dataHoraCriacao, "%Y-%m-%d") = '${data_solicitacao}' ` : "";
        
        const sql = `SELECT abertura_turma.id as id_abertura_turma, instituicoes.cnpj, instituicoes.nome_fantasia, 
        instituicoes.razao_social, abertura_turma.email AS email_solicitante, 
        abertura_turma.telefone, abertura_turma.observacao,
        DATE_FORMAT(abertura_turma.dataHoraCriacao, "%d-%m-%Y às %H:%i") AS dataHoraCriacao,
        estados.nome AS estado, abertura_turma.metodologia, abertura_turma.curso, abertura_turma.id_status
        FROM abertura_turma
        INNER JOIN instituicoes on instituicoes.id = abertura_turma.id_instituicao
        INNER JOIN estados ON estados.id = abertura_turma.id_estado
        ${where} ORDER BY abertura_turma.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    altera(id, valores, res) {
        const { idStatus, email_solicitante,
            razao_social, nome_fantasia, 
            telefone, observacao, cnpj, tipo_turma } = valores;
        const sql = `UPDATE abertura_turma SET ? WHERE abertura_turma.id = ?`;
        conexao.query(sql, [{ id_status: idStatus }, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Solicitação atualizada com sucesso." });
                if(parseInt(idStatus) === 2) {
                    enviarEmail(`${email_solicitante.trim()}`, "CONFIRMAÇÃO DE ABERTURA DE TURMA",
                    `<b>
                        <p>Olá ${nome_fantasia.toUpperCase()}, é com grande satisfação que o setor de convênios do Grupo Nexus
                         informa que a sua solicitação de abertura de turma foi confirmada.</p>
                    <b/>`); 
                }
 
                if(parseInt(idStatus) === 10) {  
                    enviarEmail(`${email_solicitante.trim()}`, "SOLICITAÇÃO DE ABERTURA DE TURMA REALIZADA FORA DE PRAZO!",
                    `<b>
                        <p>Prazo para solicitação de abertura de turma sempre serão do dia 1 ao dia 25 de todo mês! Excerto as unidades de MG cadastradas na filial de MG, que serão do dia 15 ao dia 10 do mês seguinte.
                        Obs.: Não serão abertas exceções, então é importante estar atento(a) ao prazo.<br/>
                        -Você poderá estar solicitando a abertura no inicio do próximo mês!</p>
                    <b/>`); 
                }
            }
        });
    }

    quantidadeDeSolicitacoesPorEstado(res) {
        const sql = `SELECT estados.nome AS estado, count(abertura_turma.id_instituicao) AS qtd_solicitacao
        FROM abertura_turma
        INNER JOIN estados ON estados.id = abertura_turma.id_estado
        GROUP BY abertura_turma.id_estado`;
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                const estados = [];
                const qtd_solicitacao = [];
                resultados.map((item) => {
                    estados.push(item.estado);
                    qtd_solicitacao.push(item.qtd_solicitacao);
                });
                res.status(200).json({ status: 200, resultados:[estados, qtd_solicitacao] });
            }
        });
    }

    percentualDoStatusDasSolicitacoes(res) {
        const sql = `SELECT abertura_turma.id_status, status.nome AS status,
        FORMAT((COUNT(abertura_turma.id) / (SELECT COUNT(*) FROM abertura_turma)) * 100, 2)
        AS perc_solicitacoes 
        FROM abertura_turma
        INNER JOIN status ON status.id = abertura_turma.id_status
        GROUP BY abertura_turma.id_status, status.nome`;
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                const status = [];
                const perc_solicitacoes = [];
                resultados.map((item) => {
                    status.push(item.status);
                    perc_solicitacoes.push(parseFloat(item.perc_solicitacoes));
                });
                //console.log(status, perc_solicitacoes);
                res.status(200).json({ status: 200, resultados:[status, perc_solicitacoes] });
            }
        });
    }

    quantidadeDeSolicitacoesDasInstituicoesPorEstado(estado, res) {
        const sql = `SELECT instituicoes.nome_fantasia, count(abertura_turma.id) AS qtd_solicitacao,
        abertura_turma.id_estado
        FROM abertura_turma
        INNER JOIN instituicoes ON instituicoes.id = abertura_turma.id_instituicao
        WHERE abertura_turma.id_estado = ?
        GROUP BY instituicoes.nome_fantasia, abertura_turma.id_estado`;

        conexao.query(sql, [estado],(erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                const nome_fantasia = [];
                const qtd_solicitacao = []; 
                resultados.map((item) => {
                    nome_fantasia.push(item.nome_fantasia);
                    qtd_solicitacao.push(item.qtd_solicitacao);
                });
                //console.log(nome_fantasia, qtd_solicitacao);
                res.status(200).json({ status: 200, resultados:[nome_fantasia, qtd_solicitacao] });
            }
        });
    }

    solicitacoesMensal(ano, res) {
        const filtroAno = ano === 0 ? moment().format('YYYY') : ano;
        const sql = `SELECT meses.mes, IFNULL(COUNT(abertura_turma.id_instituicao), 0) qtd_solicitacao
        FROM (
            SELECT 1 AS mes
            UNION SELECT 2
            UNION SELECT 3
            UNION SELECT 4
            UNION SELECT 5
            UNION SELECT 6
            UNION SELECT 7
            UNION SELECT 8
            UNION SELECT 9
            UNION SELECT 10
            UNION SELECT 11
            UNION SELECT 12
        ) AS meses
        LEFT JOIN abertura_turma
        ON meses.mes = MONTH(abertura_turma.dataHoraCriacao)
        AND YEAR(abertura_turma.dataHoraCriacao) = ?
        GROUP BY meses.mes`;

        conexao.query(sql, [filtroAno], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                const meses = [
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro'
                  ];
                const qtd_solicitacao = [];
                resultados.map((item) => {
                    qtd_solicitacao.push(item.qtd_solicitacao);
                });
                //console.log(meses, qtd_solicitacao);
                res.status(200).json({ status: 200, resultados:[meses, qtd_solicitacao] });
            }
        });
    }



}

module.exports = new AberturaTurma;