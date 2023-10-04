const Auth  = require('../models/auth');
const VinculoInstitucional = require('../models/vinculo_institucional');

module.exports = app => {
    app.get('/vinculo_institucional', (req, res) => {
        VinculoInstitucional.lista(res);
    });
}