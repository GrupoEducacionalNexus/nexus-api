const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Coordenador {
    
    lista(res) {
        const sql = `SELECT usuarios.id, usuarios.nome FROM usuarios
        LEFT JOIN orientador ON orientador.id = usuarios.id 
        WHERE usuarios.id_permissao = 5`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            } 
        });
    }

    listaDeOrientandos(id_coordenador, res) {
        const sql = `SELECT orientandos.id, usuarios.id as id_usuario, usuarios.nome, usuarios.email, cursos.id as id_curso, cursos.nome as curso,
        tipo_banca.id AS id_tipoBanca, tipo_banca.nome AS fase_processo, 
        DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%Y-%m-%d %H:%i:%s") AS dataHoraInicialFaseProcesso, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%Y-%m-%d %H:%i:%s") AS dataHoraFinalFaseProcesso, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%Y-%m-%d %H:%i:%s") AS dataHoraConclusao,
        DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraInicialFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraFinalFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%d-%m-%Y %H:%i:%s") AS dataHoraConclusaoTb,
        DATE_FORMAT(orientandos.dataHoraCriacao, "%d-%m-%Y %H:%i:%s") AS dataHoraCriacao,
        usuarios.senha, orientandos.informacoes_adicionais,
        linhas_pesquisas.id AS id_linhaPesquisa, linhas_pesquisas.id_areaConcentracao,
        orientandos.id_orientador,
       	(SELECT usuarios.nome FROM usuarios WHERE usuarios.id = orientandos.id_orientador ) AS orientador,
        (SELECT usuarios.email FROM usuarios WHERE usuarios.id = orientandos.id_orientador ) AS email_orientador
        FROM orientandos
        INNER JOIN cursos ON orientandos.id_curso = cursos.id
        INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
        LEFT JOIN tipo_banca ON orientandos.fase_processo = tipo_banca.id
        LEFT JOIN linhas_pesquisas ON orientandos.id_linhaPesquisa = linhas_pesquisas.id
        WHERE orientandos.id_coordenador = ? ORDER by usuarios.id DESC`;

        conexao.query(sql, [id_coordenador], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    busca(id, res) {
        let sql = `SELECT usuarios.email, coordenador.id_areaConcentracao FROM coordenador
        INNER JOIN usuarios ON coordenador.id_usuario = usuarios.id
        WHERE coordenador.id_usuario = ?`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados }); 
            }
        });
    }
}

module.exports = new Coordenador;