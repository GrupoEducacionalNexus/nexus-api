const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Documento {
    adiciona(documento, res) {
        const { autor,
            titulo,
            tituloEmOutroIdioma,
            idOrientador,
            idTipoDocumento,
            dataDefesa,
            resumo,
            idioma,
            idLinhaPesquisa,
            descricaoDoArquivo,
            url } = documento;
        let dataHoraCriacao = moment().format('YYYY-MM-DD hh:mm:ss');

        const documentoDatado = {
            autor,
            titulo,
            tituloEmOutroIdioma,
            data_defesa: moment(dataDefesa).format('YYYY-MM-DD hh:mm:ss'),
            resumo,
            idioma,
            id_linhaPesquisa: idLinhaPesquisa,
            descricao: descricaoDoArquivo,
            url,
            dataHoraCriacao,
            id_orientador: idOrientador,
            id_tipoDocumento: idTipoDocumento,
        };

        let sql = `SELECT * FROM documentos WHERE documentos.titulo = ?`;

        conexao.query(sql, [titulo], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
                console.log(erro);
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe um documento cadastrado com esse titulo.", status: 400 })
                } else {
                    //Cadastro do documento
                    sql = `INSERT INTO documentos SET ?`;
                    conexao.query(sql, documentoDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "Documento cadastrado com sucesso" });
                        }
                    });
                }
            }
        });
    }


    altera(id, valores, res) {
        const sql = `UPDATE documentos SET ? WHERE documentos.id = ?`; 
        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
                console.log(erro);
            } else {
                res.status(200).json({ status: 200, msg: "Documento atualizado com sucesso." });
            }
        });
    }

    lista(res) {
        const sql = `SELECT documentos.id, documentos.autor, tipo_documento.id AS idTipoDocumento, 
        tipo_documento.nome AS tipo_documento, documentos.tituloEmOutroIdioma,
        DATE_FORMAT( documentos.data_defesa, "%d-%m-%Y %H:%i") AS data_defesa, 
        DATE_FORMAT( documentos.data_defesa, "%Y-%m-%d %H:%i:%s") AS inputData_defesa,
        documentos.titulo,
        documentos.resumo, documentos.idioma,
        documentos.descricao, documentos.url, 
        DATE_FORMAT(documentos.dataHoraCriacao, "%d-%m-%Y %H:%i:%s") AS dataHoraCriacao,
        orientador.id AS idOrientador, linhas_pesquisas.id AS id_linhaPesquisa,
        linhas_pesquisas.nome AS linha_pesquisa, linhas_pesquisas.id_areaConcentracao,
        usuarios.nome AS orientador
        FROM documentos
        LEFT JOIN tipo_documento ON documentos.id_tipoDocumento = tipo_documento.id
        LEFT JOIN orientador ON orientador.id = documentos.id_orientador
        LEFT JOIN usuarios ON usuarios.id = orientador.id
        LEFT JOIN linhas_pesquisas ON linhas_pesquisas.id = documentos.id_linhaPesquisa
        ORDER BY documentos.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new Documento;