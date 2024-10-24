const Orientador = require('../models/orientadores');
const Auth = require('../models/auth');

module.exports = (app) => {

    // Busca informações do orientador
    app.get('/orientadores/:id', Auth.verificaJWT, (req, res) => {
        try {
            const id_orientador = req.userId; // recuperando o id do orientador do token JWT
            Orientador.busca(id_orientador, res);
        } catch (error) {
            console.error('Erro ao buscar informações do orientador:', error);
            res.status(500).json({ status: 500, msg: 'Erro interno do servidor' });
        }
    });

    // Lista orientandos do orientador
    app.get('/orientadores/:id/orientandos', Auth.verificaJWT, (req, res) => {
        try {
            const id_orientador = req.params.id; // recuperando o id do orientador pela URL
            Orientador.listaDeOrientandos(id_orientador, req.query, res);
        } catch (error) {
            console.error('Erro ao listar orientandos:', error);
            res.status(500).json({ status: 500, msg: 'Erro interno do servidor' });
        }
    });

    // Lista bancas do orientador
    app.get('/orientadores/:id/bancas', Auth.verificaJWT, (req, res) => {
        try {
            const id_orientador = req.userId;
            const { tipo_banca: id_tipoBanca } = req.query;  // Pegando tipo_banca da query string
    
            if (!id_tipoBanca) {
                return res.status(400).json({ status: 400, msg: 'id_tipoBanca é necessário' });
            }
    
            console.log('id_tipoBanca recebido:', id_tipoBanca);  // Log para monitorar o valor de id_tipoBanca
    
            Orientador.listaDeBancas(id_orientador, id_tipoBanca, res);
        } catch (error) {
            console.error('Erro ao listar bancas:', error);
            res.status(500).json({ status: 500, msg: 'Erro interno do servidor' });
        }
    });

    // Lista orientações do orientador
    app.get('/orientadores/:id/orientacao', Auth.verificaJWT, (req, res) => {
        try {
            const id_orientador = req.userId;
            Orientador.listaDeOrientandos(id_orientador, res);
        } catch (error) {
            console.error('Erro ao listar orientações:', error);
            res.status(500).json({ status: 500, msg: 'Erro interno do servidor' });
        }
    });

    // Lista orientadores por área de concentração
    app.get('/orientadores', (req, res) => {
        try {
            const area_concentracao = req.query.area_concentracao;
            Orientador.lista(area_concentracao, res);
        } catch (error) {
            console.error('Erro ao listar orientadores:', error);
            res.status(500).json({ status: 500, msg: 'Erro interno do servidor' });
        }
    });
};
