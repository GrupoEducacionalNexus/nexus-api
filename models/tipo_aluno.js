const conexao = require('../infraestrutura/conexao');

class TipoAluno {
    listaDeAlunos(id_tipo, res) {
        const sql = `SELECT alunos.id AS id_aluno, usuarios.id AS id_usuario,  
        usuarios.nome, usuarios.email, usuarios.senha, planos.id AS id_plano,
        planos.nome AS plano, GROUP_CONCAT(temas.nome, "") AS temas, 
        DATE_FORMAT(usuarios.dataHoraCriacao, "%Y-%m-%d às %H:%i:%s") AS dataHoraCriacao
        FROM alunos
        INNER JOIN usuarios ON usuarios.id = alunos.id_usuario
        INNER JOIN alunosxplanos ON alunosxplanos.id_aluno = alunos.id
        INNER JOIN planos ON planos.id = alunosxplanos.id_plano
        LEFT JOIN temasxalunos ON alunos.id = temasxalunos.id_aluno
        LEFT JOIN temas ON temas.id = temasxalunos.id_tema
        WHERE alunos.id_tipo = 2 GROUP BY alunos.id, usuarios.id, planos.id, usuarios.dataHoraCriacao
        ORDER BY alunos.id DESC`;

        conexao.query(sql, [id_tipo], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados}); 
            }
        });
    }

    
}

module.exports = new TipoAluno;