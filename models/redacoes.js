const moment = require('moment');

const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');

class Redacao {
    adiciona(redacao, res) {
        const { id_tema, link_envio, id_aluno, nomeDoAluno, tema } = redacao;
        const dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        //Verifica se o tema já está cadastrado no sistema
        let sql = `SELECT count(redacoes.id) AS totRedacoesDoTema FROM redacoes WHERE redacoes.id_tema = ? AND redacoes.id_aluno = ?`;

        conexao.query(sql, [id_tema, id_aluno], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                const redacaoDatada = { id_tema, link_envio, id_aluno, dataHoraCriacao };
                console.log(resultados);
                if (resultados[0].totRedacoesDoTema === 2) {
                    res.status(400).json({ msg: `O número máximo de tentativas permitidas para esse tema é de duas redações`, status: 400 });
                    return
                }
 
                sql = `INSERT INTO redacoes SET ?`;
                conexao.query(sql, redacaoDatada, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        res.status(200).json({ status: 200, msg: "Redação cadastrada com sucesso" });
                        // enviarEmail(`${emailDoAluno}`, "Envio de redação",
                        //     `<p>O aluno ${nomeDoAluno}, realizou o envio de uma redacão com o tema "${tema}" para correção.<p/>
                        //                                 <p>Acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!.<p/>`);
                    }
                });
            }
        });
    }

    altera(id, valores, res) {
        console.log(valores);
        const { link_recebimento, corrigido, nota, nome, tema, emailDoAluno } = valores;

        let sql = 'UPDATE redacoes SET ? WHERE redacoes.id = ?';
        conexao.query(sql, [{ link_recebimento, corrigido, nota }, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, msg: "Redação corrigida com sucesso." });
                enviarEmail(`${emailDoAluno}`, "Correção de redação",
                    `<p>${nome}, a sua redacão com o tema "${tema}" foi corrigida.<p/>
                                                        <p>Acesse o link <a href="https://www.gestorgruponexus.com.br/">https://www.gestorgruponexus.com.br/</a> para verificar!.<p/>`);
            }
        });
    }

    lista(res) {
        const sql = `SELECT usuarios.nome AS aluno, redacoes.id, redacoes.link_envio, 
        redacoes.nota, redacoes.corrigido, temas.nome AS tema,
        DATE_FORMAT(redacoes.dataHoraCriacao, "%d-%m-%Y às %H:%i") AS dataHoraCriacao,
        redacoes.link_recebimento, usuarios.email AS emailDoAluno
        FROM redacoes
        INNER JOIN temas ON temas.id = redacoes.id_tema
        INNER JOIN alunos ON alunos.id = redacoes.id_aluno
        INNER JOIN usuarios ON usuarios.id = alunos.id_usuario
        WHERE redacoes.id IN (SELECT MAX(redacoes.id) FROM redacoes GROUP BY redacoes.id_tema)
        ORDER BY redacoes.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new Redacao;