const TipoBanca = require('../models/tipo_banca');

module.exports = app => {

    app.get('/tipo_banca', (req, res) => {
        TipoBanca.lista(res);
    });
}

