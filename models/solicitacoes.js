const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const permissoes = require('../helpers/permissoes');

class Solicitacao {

    adiciona(solicitacao, res) {
        const { permissao } = solicitacao;
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        let sql = ``;

        const { bairro, endereco, cidade, uf, numero, telefone,
            rg, cpf, nacionalidade, naturalidade, dt_nascimento,
            estado_civil, link, idSolicitante, idTipo
        } = solicitacao;

        if (idTipo === 1) {
            sql = 'UPDATE usuarios SET ? WHERE usuarios.id = ?';
            conexao.query(sql, [{
                bairro, logradouro: endereco, cidade, estado: uf, numero, telefone,
                rg, cpf_cnpj: cpf, nacionalidade, naturalidade, dt_nascimento,
                estado_civil
            }, idSolicitante], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    sql = `SELECT * FROM solicitacoes WHERE solicitacoes.idSolicitante = ?
                        AND solicitacoes.idTipo = ?`;

                    conexao.query(sql, [idSolicitante, idTipo], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {

                            if (resultados.length > 0) {
                                res.status(400).json({ msg: `Você já realizou a sua solicitação de diploma!`, status: 400 });
                                return
                            }

                            const solicitacaoDatada = { link, idTipo, idSolicitante, status: 8, dataHoraCriacao }
                            sql = `INSERT INTO solicitacoes SET ?`;
                            conexao.query(sql, solicitacaoDatada, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    res.status(200).json({ status: 200, msg: "Solicitação enviado com sucesso" });
                                }
                            });
                        }
                    });
                }
            });
            return
        }

        if (idTipo === 2) {
            sql = `SELECT * FROM solicitacoes WHERE solicitacoes.idSolicitante = ?
                        AND solicitacoes.idTipo = ?`;

            conexao.query(sql, [idSolicitante, idTipo], (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    if (resultados.length > 0) {
                        res.status(400).json({ msg: `Você já realizou a sua solicitação de ficha catalográfica!`, status: 400 });
                        return
                    }

                    const solicitacaoDatada = { link, idTipo, idSolicitante, status: 8, dataHoraCriacao }

                    sql = `INSERT INTO solicitacoes SET ?`;
                    conexao.query(sql, solicitacaoDatada, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "Solicitação enviado com sucesso" });
                        }
                    });
                }
            });
        }

    }

    altera(id, valores, res) {
        const { email, bairro, endereco, cidade, uf, numero, telefone,
            rg, cpf, nacionalidade, naturalidade, dt_nascimento,
            estado_civil, link, id_usuario, idTipo, tipo, id_permissao, id_status, status } = valores;

        let sql = ``;

        if (id_permissao.includes(permissoes.orientandos)) {
            if (idTipo === 1) {
                let sql = `UPDATE usuarios SET ? WHERE usuarios.id = ?`;
                conexao.query(sql, [
                    {
                        bairro, logradouro: endereco, cidade, estado: uf, numero, telefone,
                        rg, cpf_cnpj: cpf, nacionalidade, naturalidade, dt_nascimento,
                        estado_civil
                    }, id_usuario], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json({ status: 400, msg: erro });
                        } else {
                            if (link !== "") {
                                sql = `UPDATE solicitacoes SET ? WHERE solicitacoes.id = ?`;
                                conexao.query(sql, [
                                    { link }, id], (erro, resultados) => {
                                        if (erro) {
                                            res.status(400).json({ status: 400, msg: erro });
                                        } else {
                                            res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                                        }
                                    });
                                return;
                            }
                            res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                        }
                    });
                return
            }

            sql = `UPDATE solicitacoes SET ? WHERE solicitacoes.id = ?`;
            conexao.query(sql, [
                { link }, id], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                    }
                });
            return
        }

        if (id_permissao.includes(permissoes.secretaria)) {
            sql = `UPDATE solicitacoes SET ? WHERE solicitacoes.id = ?`;
            conexao.query(sql, [{ status: id_status }, id], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
                    enviarEmail(`${email.trim()}`, `Atualização no status da solicitação de ${tipo.toLowerCase()} - Enber University"!`,
                        `<b>Se encontra ${parseInt(id_status) === 7 ? `FINALIZADO(A)` : parseInt(id_status) === 8 ? `EM ANÁLISE` : `EM PRODUÇÃO`}, Para verificar acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br</a>."<b/>`);
                }
            });
        }
    }

    lista(res) {
        const sql = `SELECT solicitacoes.id, solicitacoes.link AS anexo, 
        solicitacoes.idTipo, tipo_solicitacao.nome AS tipo,
        DATE_FORMAT(solicitacoes.dataHoraCriacao, "%d/%m/%Y às %H:%i") AS dataHoraCriacao,
        status.id as id_status, status.nome AS status, usuarios.email,
        usuarios.nome AS solicitante, usuarios.cpf_cnpj,
        usuarios.rg, usuarios.dt_nascimento,
        usuarios.telefone, usuarios.cep, usuarios.estado, usuarios.cidade,
        usuarios.bairro, usuarios.logradouro, usuarios.numero, usuarios.naturalidade,
        usuarios.nacionalidade, usuarios.estado_civil,
        DATE_FORMAT(usuarios.dt_nascimento, "%Y-%m-%d") AS dt_nascimento,
        orientandos.id_curso, bancas.titulo AS titulo_teseOuDissertacao, 
        DATE_FORMAT(bancas.data_horaPrevista,'%d/%m/%Y %H:%i') AS data_horaPrevista,
        (SELECT UPPER(usuarios.nome) FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS orientador,
		  (SELECT orientador.assinatura FROM orientador WHERE orientador.id_usuario = bancas.id_orientador) 
        AS assinatura_presidente,
        
        (SELECT UPPER(usuarios.nome) FROM usuarios WHERE usuarios.id =  bancas.id_membroInterno)
        AS membro_interno,
        (SELECT orientador.assinatura FROM orientador WHERE orientador.id_usuario = bancas.id_membroInterno)
        AS assinatura_membroInterno,
        
        (SELECT UPPER(usuarios.nome) FROM membro_externo 
			INNER JOIN usuarios ON membro_externo.id_usuario = usuarios.id
			WHERE bancas.id_membroExterno = membro_externo.id_usuario)
        AS membro_externo,
        (SELECT membro_externo.assinatura FROM membro_externo 
        WHERE bancas.id_membroExterno = membro_externo.id_usuario)
        AS assinatura_membroExterno,
        ata.id AS id_ata, ata.status AS id_statusAta,
        DATE_FORMAT(ata.dataHoraCriacao, "%M %d, %Y") AS dtCadAta,
        DATE_FORMAT(bancas.data_horaPrevista,'%Y/%m/%d') AS dataFormatAmericano
        FROM solicitacoes
        INNER JOIN usuarios ON usuarios.id = solicitacoes.idSolicitante
        INNER JOIN tipo_solicitacao ON tipo_solicitacao.id = solicitacoes.idTipo
        INNER JOIN status ON solicitacoes.status = status.id
        INNER JOIN orientandos ON usuarios.id = orientandos.id_usuario
        INNER JOIN bancas ON bancas.id_orientando = orientandos.id
        LEFT JOIN ata ON ata.id_banca = bancas.id
        GROUP BY solicitacoes.id`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

}

module.exports = new Solicitacao;