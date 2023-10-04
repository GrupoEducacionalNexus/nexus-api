const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Orientador {

    lista(area_concentracao, res) {
        const sql = `SELECT orientador.id, orientador.id_usuario, usuarios.nome FROM orientador
        INNER JOIN usuarios ON orientador.id_usuario = usuarios.id
        ${area_concentracao > 0 ? `WHERE orientador.id_areaConcentracao = ${area_concentracao}` : ``}`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else { 
                res.status(200).json({ status: 200, resultados });
            } 
        });
    }

    listaDeOrientandos(id_orientador, filtro, res) {
        const {nome, idLinhaPesquisa, idFaseProcesso} = filtro;
        //console.log(id_orientador, nome, idLinhaPesquisa, idFaseProcesso);

        const sql = `SELECT orientandos.id, usuarios.id as id_usuario, usuarios.nome, usuarios.email, cursos.id as id_curso, cursos.nome as curso,
        tipo_banca.id AS id_tipoBanca, tipo_banca.nome AS fase_processo, 
        DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%Y-%m-%d %H:%i:%s") AS dataHoraInicialFaseProcesso, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%Y-%m-%d %H:%i:%s") AS dataHoraFinalFaseProcesso, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%Y-%m-%d %H:%i:%s") AS dataHoraConclusao,
        DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraInicialFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraFinalFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%d-%m-%Y %H:%i:%s") AS dataHoraConclusaoTb,
        DATE_FORMAT(orientandos.dataHoraCriacao, "%d-%m-%Y %H:%i:%s") AS dataHoraCriacao,
        usuarios.senha, orientandos.informacoes_adicionais, linhas_pesquisas.nome AS linha_pesquisa,
        linhas_pesquisas.id AS id_linhaPesquisa, linhas_pesquisas.id_areaConcentracao,
        orientandos.id_orientador,
       	(SELECT usuarios.nome FROM usuarios WHERE usuarios.id = orientandos.id_orientador ) AS orientador,
        (SELECT usuarios.email FROM usuarios WHERE usuarios.id = orientandos.id_orientador ) AS email_orientador,
        orientandos.status_confirmacaoBancaD
        FROM orientandos
        LEFT JOIN cursos ON orientandos.id_curso = cursos.id
        LEFT JOIN usuarios ON orientandos.id_usuario = usuarios.id
        LEFT JOIN tipo_banca ON orientandos.fase_processo = tipo_banca.id
        LEFT JOIN linhas_pesquisas ON linhas_pesquisas.id = orientandos.id_linhaPesquisa
        WHERE orientandos.id_orientador = ? 
        ${nome.length > 0 ? `AND usuarios.nome LIKE '%${nome}%'` : ``} 
        ${parseInt(idLinhaPesquisa) > 0 ? `AND linhas_pesquisas.id = ${idLinhaPesquisa}` : ``}
        ${parseInt(idFaseProcesso) > 0 ? `AND tipo_banca.id = ${idFaseProcesso}` : ``}
        ORDER BY orientandos.id DESC`; 

        conexao.query(sql, [id_orientador], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    listaDeBancas(id_orientador, id_tipoBanca, res) {
        const sql = `SELECT bancas.id, bancas.title, bancas.titulo, orientandos.id AS id_orientando, linhas_pesquisas.id_areaConcentracao, 
        linhas_pesquisas.nome AS linha_pesquisa, areas_concentracao.nome AS areaConcentracao,
        DATE_FORMAT(bancas.data_horaPrevista,'%d/%m/%Y %H:%i:%s') AS data_horaPrevista, 
        DATE_FORMAT(bancas.data_horaPrevista,'%Y/%m/%d') AS dataFormatAmericano,
        usuarios.nome AS orientando, usuarios.email AS email_orientando, cursos.nome AS curso, 
        tipo_banca.id AS id_tipoBanca, tipo_banca.nome AS tipo_banca, bancas.status,
        (SELECT usuarios.id FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS id_orientador,
        (SELECT UPPER(usuarios.nome) FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS orientador,
        (SELECT usuarios.email FROM usuarios WHERE usuarios.id = bancas.id_orientador) AS email_orientador,
        (SELECT orientador.assinatura FROM orientador WHERE orientador.id_usuario = bancas.id_orientador) 
        AS assinatura_presidente, orientandos.id_curso, 
        (SELECT tipo_banca.nome FROM tipo_banca WHERE tipo_banca.id = orientandos.fase_processo) AS fase_processo,
        DATE_FORMAT(orientandos.dataHoraInicialFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraInicialFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraFinalFaseProcesso, "%d-%m-%Y %H:%i:%s") AS dataHoraFinalFaseProcessoTb, 
        DATE_FORMAT(orientandos.dataHoraConclusao, "%d-%m-%Y %H:%i:%s") AS dataHoraConclusaoTb,
        ata.id AS id_ata, ata.link, ata.titulo_teseOuDissertacao, ata.status AS id_statusAta,
        ata.quant_pag, (SELECT status.nome FROM status WHERE status.id = ata.status) AS status_ata,
        DATE_FORMAT(bancas.data_horaPrevista, "%M %d, %Y") AS dtCadAta,
        DATE_FORMAT(orientandos.dt_confirmacaoTaxaQ, "%d-%m-%Y %H:%i:%s") AS dt_confirmacaoTaxaQ,
        IF(orientandos.status_confirmacaoBancaQ = 1, "AGUARDANDO", IF(orientandos.status_confirmacaoBancaQ = 7, "FINALIZADA", "CONFIRMADO")) AS status_confirmacaoBancaQ,
        DATE_FORMAT(orientandos.dt_confirmacaoTaxaD, "%d-%m-%Y %H:%i:%s") AS dt_confirmacaoTaxaD,
        IF(orientandos.status_confirmacaoBancaD = 1, "AGUARDANDO", IF(orientandos.status_confirmacaoBancaD = 7, "FINALIZADA", "CONFIRMADO")) AS status_confirmacaoBancaD,
        orientandos.observacao, 
        bancas.id_membroInterno, 
		(SELECT UPPER(usuarios.nome) FROM usuarios WHERE usuarios.id =  bancas.id_membroInterno)
        AS membro_interno,
        (SELECT orientador.assinatura FROM orientador WHERE orientador.id_usuario = bancas.id_membroInterno)
        AS assinatura_membroInterno,
        bancas.id_membroExterno,
        (SELECT UPPER(usuarios.nome) FROM membro_externo 
		INNER JOIN usuarios ON membro_externo.id_usuario = usuarios.id
		WHERE bancas.id_membroExterno = membro_externo.id_usuario)
        AS membro_externo,
         (SELECT membro_externo.assinatura FROM membro_externo WHERE bancas.id_membroExterno = membro_externo.id_usuario)
        AS assinatura_membroExterno,
        ficha_avaliacao.id AS id_fichaAvaliacao, orientandos.id_linhaPesquisa,
        ficha_avaliacao.titulo_projeto, ficha_avaliacao.pergunta_condutora,
        ficha_avaliacao.hipotese, ficha_avaliacao.fundamentacao_teorica,
        ficha_avaliacao.objetivo, ficha_avaliacao.metodo, ficha_avaliacao.cronograma,
        ficha_avaliacao.conclusao_avaliacao, ficha_avaliacao.resumoQ1,
        ficha_avaliacao.resumoQ2, ficha_avaliacao.resumoQ2, ficha_avaliacao.resumoQ3,
        ficha_avaliacao.resumoQ4, ficha_avaliacao.resumoQ5, ficha_avaliacao.resumoQ6,
        ficha_avaliacao.resumoQ7, ficha_avaliacao.resumoQ8,
        (CASE
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'January' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Janeiro de %Y") 
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'February' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Fevereiro de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'March' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Março de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'April' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Abril de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'May' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Maio de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'June' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Junho de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'July' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Julho de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'August' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Agosto de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'September' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Setembro de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'October' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Outubro de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'November' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Novembro de %Y")
            WHEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%M") = 'December' THEN DATE_FORMAT(ficha_avaliacao.dataHoraCriacao, "%d de Dezembro de %Y")
        END) AS dataFichaAvaliacaoPtBr, 
		  folha_aprovacao.id AS idFolhaDeAprovacao,
		  DATE_FORMAT(folha_aprovacao.dataAprovacao, "%Y-%m-%d") AS dtFolhaAprovacao,
          declaracao_orientacao.id As idDeclaracaoOrientacao,
          declaracao_orientacao.codigo_validacao AS codigoDeclaracaoDeOrientacao,
          DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M %d, %Y") AS dataDeclaracaoDeOrientacaoEnUs,
          (CASE
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'January' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Janeiro de %Y") 
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'February' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Fevereiro de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'March' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Março de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'April' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Abril de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'May' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Maio de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'June' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Junho de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'July' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Julho de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'August' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Agosto de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'September' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Setembro de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'October' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Outubro de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'November' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Novembro de %Y")
              WHEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%M") = 'December' THEN DATE_FORMAT(declaracao_orientacao.dataHoraCriacao, "%d de Dezembro de %Y")
          END) AS dataDeclaracaoDeOrientacaoPtBr
        FROM bancas
        INNER JOIN orientandos ON bancas.id_orientando = orientandos.id
        INNER JOIN cursos ON cursos.id = orientandos.id_curso
        INNER JOIN tipo_banca ON tipo_banca.id = bancas.id_tipoBanca 
        INNER JOIN usuarios ON orientandos.id_usuario = usuarios.id
        INNER JOIN linhas_pesquisas ON bancas.id_linhaPesquisa = linhas_pesquisas.id
        INNER JOIN areas_concentracao ON areas_concentracao.id = linhas_pesquisas.id_areaConcentracao
        LEFT JOIN ata ON ata.id_banca = bancas.id
        LEFT JOIN ficha_avaliacao ON ficha_avaliacao.id_banca = bancas.id
        LEFT JOIN folha_aprovacao ON folha_aprovacao.id_banca = bancas.id
        LEFT JOIN declaracao_orientacao on bancas.id = declaracao_orientacao.id_banca 
        WHERE bancas.id_orientador = ? AND bancas.id_tipoBanca = ? order by bancas.id DESC`;
        conexao.query(sql, [id_orientador, id_tipoBanca], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados, id_tipoBanca });
                console.log(resultados);
            }
        });
    }

    listaDeOrientacao(id_orientador, res) {
        const sql = `SELECT orientacao.id, orientacao.id_orientando,
        (SELECT usuarios.nome FROM usuarios WHERE usuarios.id = orientandos.id_usuario) AS orientando, 
        orientacao.link, orientacao.observacao,
        DATE_FORMAT(orientacao.dataHoraPrevista, "%Y-%m-%d %H:%i:%s") AS dataHoraPrevista, 
        DATE_FORMAT(orientacao.dataHoraPrevista, "%d/%m/%Y %H:%i:%s") AS dataHoraPrevistaTb,
        orientacao.anexo
        FROM orientacao
        INNER JOIN orientandos ON orientacao.id_orientando = orientandos.id
        WHERE orientacao.id_orientador = ? ORDER BY orientacao.id DESC`;  

        conexao.query(sql, [id_orientador], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados});
            }
        });
    }

    busca(id, res) {
        let sql = `SELECT orientador.id_areaConcentracao FROM orientador
        WHERE orientador.id_usuario = ?`;

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados }); 
            }
        });

    }
}

module.exports = new Orientador;