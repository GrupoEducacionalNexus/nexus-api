const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Prova {
    buscaPorId(id, res) {
        const sql = `SELECT questoes.id, questoes.enunciado AS questao, 
        GROUP_CONCAT(alternativas.enunciado ORDER BY alternativas.enunciado ASC SEPARATOR '-') AS alternativas,
        (SELECT alternativas.enunciado FROM alternativas 
        WHERE respostas.id_alternativa = alternativas.id) AS gabarrito
        FROM questoes
        INNER JOIN provas ON questoes.id_prova = provas.id
        INNER JOIN alternativas ON questoes.id = alternativas.id_questao
        LEFT JOIN respostas ON alternativas.id = respostas.id_alternativa
        WHERE questoes.id_prova = ? GROUP BY questoes.id ORDER BY questoes.id`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.length > 0) {
                    let result = [];
                    let alternativas = [];
                    for (let index = 0; index < resultados.length; index++) {
                        console.log(resultados[index].questao, resultados[index].alternativas);
                        alternativas = resultados[index].alternativas.split('-');
                        result.push({ questao: resultados[index].questao, alternativas, gabarito: resultados[index].gabarrito });
                    }
                    console.log(result);
                    res.status(200).json({ status: 200, result });
                } else {
                    res.status(400).json({ status: 400, msg: "Não foi encontrada nenhuma informação." });
                }

            }
        });
    }


}

module.exports = new Prova;