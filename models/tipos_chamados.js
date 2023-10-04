const moment = require('moment');

const conexao = require('../infraestrutura/conexao');

class TipoChamado {
    adiciona(tipo_chamado, res) {
        
        const { nome, idSetorResponsavel } = tipo_chamado;

        let dataHoraCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

        let sql = `SELECT * FROM tipos_chamados WHERE tipos_chamados.nome = ?`;

        conexao.query(sql, [nome], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
                console.log(erro)
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: `Já existe um tipo de chamado registrado com esse nome!`, status: 400});
                } else {
                    
                    const tipoChamadoDatado = { nome, idSetor: idSetorResponsavel, dataHoraCriacao };
                    sql = `INSERT INTO tipos_chamados SET ?`;
                    conexao.query(sql, tipoChamadoDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(200).json({ status: 200, msg: "Tipo de chamado cadastrada com sucesso" });
                        }
                    });
                }
            }
        });
    }

    altera(id, valores, res) {
        const { nome, idSetorResponsavel } = valores; 

            const tipoChamadoDatado = { nome, idSetor: idSetorResponsavel };
        console.log(tipoChamadoDatado);
        
        let sql = 'UPDATE tipos_chamados SET ? WHERE id = ?';
        conexao.query(sql, [tipoChamadoDatado, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                res.status(200).json({ status: 200, msg: "Atualizado com sucesso."});
            } 
        });
    } 

    lista(res) {
        const sql = `SELECT tipos_chamados.id, tipos_chamados.idSetor AS idSetorResponsavel, tipos_chamados.nome AS tipo, setores.nome AS setor_responsavel,
        DATE_FORMAT(tipos_chamados.dataHoraCriacao, "%d-%m-%Y %H:%i:%s") AS dataHoraCriacao
        FROM tipos_chamados
        INNER JOIN setores ON setores.id = tipos_chamados.idSetor
        ORDER BY tipos_chamados.id DESC `;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }

}

module.exports = new TipoChamado;