const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');

class Resposta {
    adiciona(respostas, res) {
        const { dadosUsuario, arrayResposta } = respostas;
        console.log(dadosUsuario, arrayResposta);

        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const respostasDatadas = [];
        if (arrayResposta.length > 0) {
            //Verifica se usuário já está cadastrado
            let sql = `SELECT * FROM usuarios WHERE email = ?`;
            conexao.query(sql, [dadosUsuario.email], (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    if (resultados.length > 0) {
                        let id_usuario = resultados[0].id;
                        sql = 'UPDATE usuarios SET ? WHERE usuarios.id = ?';
                        conexao.query(sql, [{ ...dadosUsuario }, id_usuario], (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro })
                            } else {
                                sql = `INSERT INTO teste_vocacional SET ?`;
                                conexao.query(sql, { id_usuario, dataHoraCriacao }, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        for (let i = 0; i < arrayResposta.length; i++) {
                                            respostasDatadas.push([resultados.insertId, arrayResposta[i].pergunta_id, arrayResposta[i].resposta, dataHoraCriacao]);
                                        }
                                        //Salva as repostas do vocabulário respondido pelo usuário
                                        sql = `INSERT INTO respostas (id_testeVocacional, pergunta_id, resposta, dataHoraCriacao) VALUES ?`;
                                        conexao.query(sql, [respostasDatadas], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json(erro);
                                            } else {
                                                console.log(resultados.insertId);
                                                let ids_respostas = [];
                                                for (let i = 0; i < 20; i++) ids_respostas.push(resultados.insertId++);
                                                console.log(ids_respostas);

                                                //Analisa as habilidades com base no teste respondido
                                                sql = `SELECT habilidades.nome AS habilidade, 
                                                (SELECT GROUP_CONCAT(areas_de_atuacao.descricao) 
                                                FROM areas_de_atuacao WHERE areas_de_atuacao.habilidade_id = habilidades.id) AS areas_atuacao,
                                                COUNT(perguntas.habilidade_id) AS quantPergPorHabt, 
                                                COUNT(if(respostas.resposta = 1, 1, NULL)) AS pontuacaoPorHab
                                                FROM respostas
                                                INNER JOIN perguntas ON perguntas.id = respostas.pergunta_id
                                                INNER JOIN habilidades ON habilidades.id = perguntas.habilidade_id
                                                WHERE respostas.id IN (?) GROUP BY perguntas.habilidade_id ORDER BY pontuacaoPorHab DESC`;

                                                conexao.query(sql, [ids_respostas], (erro, resultados) => {
                                                    if (erro) {
                                                        res.status(400).json({ status: 400, msg: erro });
                                                    } else {
                                                        res.status(200).json({ status: 200, resultados });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                       
                        //Guarda os dados do usuário que respondeu o teste vocacional
                        sql = `INSERT INTO usuarios SET ?`;
                        conexao.query(sql, { ...dadosUsuario, dataHoraCriacao }, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro);
                            } else {
                                sql = `INSERT INTO teste_vocacional SET ?`;
                                conexao.query(sql, { id_usuario: resultados.insertId, dataHoraCriacao }, (erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        for (let i = 0; i < arrayResposta.length; i++) {
                                            respostasDatadas.push([resultados.insertId, arrayResposta[i].pergunta_id, arrayResposta[i].resposta, dataHoraCriacao]);
                                        }
                                        //Salva as repostas do vocabulário respondido pelo usuário
                                        sql = `INSERT INTO respostas (id_testeVocacional, pergunta_id, resposta, dataHoraCriacao) VALUES ?`;
                                        conexao.query(sql, [respostasDatadas], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json(erro);
                                            } else {
                                                console.log(resultados.insertId);
                                                let ids_respostas = [];
                                                for (let i = 0; i < 20; i++) ids_respostas.push(resultados.insertId++);
                                                console.log(ids_respostas);

                                                //Analisa as habilidades com base no teste respondido
                                                sql = `SELECT habilidades.nome AS habilidade, 
                                                (SELECT GROUP_CONCAT(areas_de_atuacao.descricao) 
                                                FROM areas_de_atuacao WHERE areas_de_atuacao.habilidade_id = habilidades.id) AS areas_atuacao,
                                                COUNT(perguntas.habilidade_id) AS quantPergPorHabt, 
                                                COUNT(if(respostas.resposta = 1, 1, NULL)) AS pontuacaoPorHab
                                                FROM respostas
                                                INNER JOIN perguntas ON perguntas.id = respostas.pergunta_id
                                                INNER JOIN habilidades ON habilidades.id = perguntas.habilidade_id
                                                WHERE respostas.id IN (?) GROUP BY perguntas.habilidade_id ORDER BY pontuacaoPorHab DESC`;

                                                conexao.query(sql, [ids_respostas], (erro, resultados) => {
                                                    if (erro) {
                                                        res.status(400).json({ status: 400, msg: erro });
                                                    } else {
                                                        res.status(200).json({ status: 200, resultados });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })
                            }
                        });
                    }
                }
            });
        }
    }
}

module.exports = new Resposta;