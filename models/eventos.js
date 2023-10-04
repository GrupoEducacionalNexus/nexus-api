const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Evento {
    
    adiciona(evento, res) {
        console.log(evento);
        const { tema, dataEventoInicial, dataEventoFinal, carga_horaria } = evento;
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        
        let sql = `SELECT * FROM eventos WHERE tema = ?`;
        // console.log(parseInt(dataEventoInicial.slice(5, 7)) + dataEventoInicial.slice(0, 4));
        // console.log(parseInt(dataEventoFinal.slice(5, 7) + dataEventoFinal.slice(0, 4)));

        if(parseInt(dataEventoInicial.slice(5, 7)) + dataEventoInicial.slice(0, 4) <= parseInt(dataEventoFinal.slice(5, 7) + dataEventoFinal.slice(0, 4))) {
            conexao.query(sql, [tema], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    if (resultados.length > 0) {
                        res.status(400).json({ msg: "Já existe um evento cadastrado com esse tema.", status: 400 });
                    } else {
                        const eventoDatado = { tema, dataEventoInicial, dataEventoFinal, carga_horaria, dataHoraCriacao, status: 1 };
                        //Cadastro do ciclo
                        sql = `INSERT INTO eventos SET ?`;
                        conexao.query(sql, eventoDatado, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro);
                            } else {
                                res.status(200).json({ status: 200, msg: "evento cadastrado com sucesso" });
                            }
                        });
                    }
                }
            });
        } else {
            res.status(400).json({ msg: "A data de inicio do evento tem que ser menor que a data final do evento.", status: 400 });
        }
    }

    lista(res) {
        const sql = `SELECT eventos.id, eventos.tema, date_format(eventos.dataEventoInicial, '%d/%m/%Y') AS dataEventoInicial,
        date_format(eventos.dataEventoFinal, '%d/%m/%Y') AS dataEventoFinal,
        date_format(eventos.dataHoraCriacao, '%d/%m/%Y') as dataHoraCriacao,
        eventos.carga_horaria, eventos.grupo_trabalho
        FROM eventos WHERE eventos.status = 1
        ORDER BY eventos.id DESC`; 

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                // console.log(resultados);
            }
        });
    }

    listaMembros(id_evento, res) {
        let sql = `SELECT
            membros.dataHoraCriacao, usuarios.cpf_cnpj AS cpf,
            usuarios.nome AS nome_completo, usuarios.email,
            date_format(membros.dataHoraCriacao, '%d/%m/%Y') AS dataHoraCriacao,
            membros.codigo_validacao, date_format(eventos.dataEventoInicial, '%d/%m/%Y') AS dataEventoInicial,
            date_format(eventos.dataEventoFinal, '%d/%m/%Y') AS dataEventoFinal,
            eventos.carga_horaria
            FROM membrosxeventos
            INNER JOIN usuarios ON usuarios.id = membrosxeventos.id_usuario
            INNER JOIN membros ON membros.id_usuario = usuarios.id
            INNER JOIN eventos ON eventos.id = membrosxeventos.id_evento
            WHERE membrosxeventos.id_evento = ? `; 

        conexao.query(sql, [id_evento], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeGruposDeTrabalho(id_evento, res) {
        let sql = `SELECT * FROM grupos_trabalho WHERE grupos_trabalho.id_evento = ?`; 

        conexao.query(sql, [id_evento], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeLideresDosGruposDeTrabalhos(id_evento, res) {
        let sql = `SELECT lider_gt.id, (SELECT usuarios.nome FROM usuarios WHERE usuarios.id = lider_gt.id_usuario)
        AS nome, (SELECT usuarios.email FROM usuarios WHERE usuarios.id = lider_gt.id_usuario)
        AS email, grupos_trabalho.nome AS grupo_trabalho
        FROM lider_gtxgrupo_trabalho
        INNER JOIN lider_gt ON lider_gtxgrupo_trabalho.id_liderGt = lider_gt.id
        INNER JOIN grupos_trabalho ON lider_gtxgrupo_trabalho.id_grupoTrabalho = grupos_trabalho.id
        WHERE lider_gtxgrupo_trabalho.id_evento = ?`; 

        conexao.query(sql, [id_evento], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    deleta(id_evento, res) {
        let sql = `SELECT membros.id FROM membros WHERE membros.id_evento = ?`;
        conexao.query(sql, [id_evento], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                let arrayIdsMembros = [];

                resultados.map(item => { arrayIdsMembros.push(item.id); });

                //console.log(arrayIdsMembros);

                sql = 'DELETE FROM eventos WHERE eventos.id = ?';

                conexao.query(sql, [id_evento], (erro, resultados) => {
                    if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                    } else {
                        sql = 'DELETE FROM membros WHERE membros.id IN (?)';

                        conexao.query(sql, [arrayIdsMembros], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });
                            } else {
                                res.status(200).json({ status: 200, msg: "Evento excluido com sucesso!" });
                            }
                        });
                    }
                });
            }
        });

    }
}

module.exports = new Evento;