const conexao = require('../infraestrutura/conexao');
const dayjs = require('dayjs');

class Orientador {
    // Função para listar os orientandos com base nos filtros fornecidos
    listaDeOrientandos(id_orientador, filtro, res) {
        const { nome = "", idLinhaPesquisa = 0, idFaseProcesso = 0 } = filtro;

        // Consulta SQL
        let sql = `
        SELECT 
            orientandos.id, 
            usuarios.nome, 
            usuarios.email, 
            cursos.nome AS curso,
            tipo_banca.id AS id_tipoBanca, 
            tipo_banca.nome AS fase_processo,
            orientandos.status_confirmacaoBancaD
        FROM orientandos
        LEFT JOIN cursos ON orientandos.id_curso = cursos.id
        LEFT JOIN usuarios ON orientandos.id_usuario = usuarios.id
        LEFT JOIN tipo_banca ON orientandos.fase_processo = tipo_banca.id
        WHERE orientandos.id_orientador = ?`;

        // Aplicar filtros opcionais
        const queryParams = [id_orientador];

        if (nome.length > 0) {
            sql += ` AND usuarios.nome LIKE ?`;
            queryParams.push(`%${nome}%`);
        }

        if (parseInt(idLinhaPesquisa) > 0) {
            sql += ` AND linhas_pesquisas.id = ?`;
            queryParams.push(idLinhaPesquisa);
        }

        if (parseInt(idFaseProcesso) > 0) {
            sql += ` AND tipo_banca.id = ?`;
            queryParams.push(idFaseProcesso);
        }

        // Ordenação
        sql += ` ORDER BY orientandos.id DESC`;

        // Executar a consulta
        conexao.query(sql, queryParams, (erro, resultados) => {
            if (erro) {
                return res.status(400).json({ status: 400, msg: erro });
            }
            return res.status(200).json({ status: 200, resultados });
        });
    }

    // Função para listar as bancas
    listaDeBancas(id_orientador, id_tipoBanca, res) {
        if (!id_tipoBanca) {
            return res.status(400).json({ status: 400, msg: 'id_tipoBanca é necessário' });
        }

        const sql = `
        SELECT 
            orientandos.id, 
            usuarios.nome, 
            usuarios.email, 
            cursos.nome AS curso,
            tipo_banca.id AS id_tipoBanca, 
            tipo_banca.nome AS fase_processo,
            orientandos.status_confirmacaoBancaD,
            orientandos.status_confirmacaoBancaQ
        FROM orientandos
        LEFT JOIN cursos ON orientandos.id_curso = cursos.id
        LEFT JOIN usuarios ON orientandos.id_usuario = usuarios.id
        LEFT JOIN tipo_banca ON orientandos.fase_processo = tipo_banca.id
        WHERE orientandos.id_orientador = ? AND tipo_banca.id = ?
        ORDER BY orientandos.id DESC`;

        conexao.query(sql, [id_orientador, id_tipoBanca], (erro, resultados) => {
            if (erro) {
                return res.status(400).json({ status: 400, msg: erro });
            }
            return res.status(200).json({ status: 200, resultados });
        });
    }

    // Busca área de concentração de um orientador
    busca(id, res) {
        const sql = `SELECT orientador.id_areaConcentracao FROM orientador WHERE orientador.id_usuario = ?`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                return res.status(400).json({ status: 400, msg: erro });
            }
            return res.status(200).json({ status: 200, resultados });
        });
    }

    // Lista orientadores com base na área de concentração (se houver)
    lista(area_concentracao, res) {
        const sql = `
        SELECT orientador.id, orientador.id_usuario, usuarios.nome 
        FROM orientador
        INNER JOIN usuarios ON orientador.id_usuario = usuarios.id
        ${area_concentracao > 0 ? `WHERE orientador.id_areaConcentracao = ?` : ``}`;

        const queryParams = area_concentracao > 0 ? [area_concentracao] : [];

        conexao.query(sql, queryParams, (erro, resultados) => {
            if (erro) {
                return res.status(400).json({ status: 400, msg: erro });
            }
            return res.status(200).json({ status: 200, resultados });
        });
    }

    // Função auxiliar para consultas assíncronas
    queryAsync(sql, params) {
        return new Promise((resolve, reject) => {
            conexao.query(sql, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    // Função para formatar datas usando dayjs
    formatDate(dateStr, format = 'YYYY-MM-DD') {
        return dayjs(dateStr).format(format);
    }
}

module.exports = new Orientador();
