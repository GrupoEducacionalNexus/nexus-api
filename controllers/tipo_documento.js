const TipoDocumento = require('../models/tipo_documento');

module.exports = app => {
    app.get('/tipo_documento', (req, res) => {
        TipoDocumento.lista(res);
    });
}

