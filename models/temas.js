const moment = require('moment');

const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');

class Tema {
    adiciona(tema, res) {
        const { nome, texto_base } = tema;
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const temaDatado = { nome, texto_base: texto_base.replace(/["]/g, ''), dataHoraCriacao };

        //Verifica se o tema já está cadastrado no sistema
        let sql = `SELECT * FROM temas WHERE temas.nome = ?`;

        conexao.query(sql, [nome], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
                console.log(erro)
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: `Já existe um tema registrado com essa descrição`, status: 400 });
                } else {
                    sql = `INSERT INTO temas SET ?`;
                    conexao.query(sql, temaDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            const id_tema = resultados.insertId;
                            console.log(id_tema);
                            //Lista de alunos
                            sql = `SELECT alunos.id AS id_aluno, usuarios.id AS id_usuario,  usuarios.nome, 
                            usuarios.email, usuarios.senha, planos.id AS id_plano,
                            planos.nome AS plano,
                            DATE_FORMAT(usuarios.dataHoraCriacao, "%Y-%m-%d às %H:%i:%s") AS dataHoraCriacao
                            FROM alunos 
                            INNER JOIN usuarios ON usuarios.id = alunos.id_usuario
                            INNER JOIN alunosxplanos ON alunosxplanos.id_aluno = alunos.id
                            INNER JOIN planos ON planos.id = alunosxplanos.id_plano
                            WHERE alunos.id_tipo = ?`;

                            conexao.query(sql, [2], (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json({ status: 400, msg: erro });
                                } else {
                                    let array_alunos = resultados;
                                    let array_emails = [];

                                    let planosXalunos = [];
                                    if (resultados.length > 0) {
                                        array_alunos.map((aluno, index) => {
                                            planosXalunos.push([aluno.id_aluno, id_tema, dataHoraCriacao]);
                                            array_emails.push(aluno.email)
                                        });

                                        //Apontamento do tema para os alunos
                                        sql = `INSERT INTO temasxalunos (id_aluno, id_tema, dataHoraCriacao) VALUES ?`;
                                        conexao.query(sql, [planosXalunos], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json(erro);
                                            } else {
                                                res.status(200).json({ status: 200, msg: "Tema cadastrada com sucesso" });
                                                enviarEmail(array_emails, "Um novo tema inserido no sistema de redações!",
                                                    `<p>Caro aluno(a), um novo tema "${nome}" foi inserido para você.<p/>
                                                        <p>Acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!.<p/>`);
                                            }
                                        });
                                        return;
                                    }
                                    res.status(200).json({ status: 200, msg: "Tema cadastrada com sucesso" });
                                }
                            });

                        }
                    });
                }
            }
        });
    }

    altera(id, valores, res) {
        const { nome, texto_base } = valores;

        let sql = 'UPDATE temas SET ? WHERE id = ?';
        conexao.query(sql, [texto_base !== null ? { nome, texto_base: texto_base.replace(/["]/g, '') } : { nome }, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }

    lista(res) {
        const sql = `SELECT temas.id, temas.nome, temas.texto_base, 
        DATE_FORMAT(temas.dataHoraCriacao, "%d-%m-%Y às %H:%i") AS dataHoraCriacao 
        FROM temas ORDER BY temas.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new Tema;