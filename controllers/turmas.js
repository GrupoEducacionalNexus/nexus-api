const Turma = require('../models/turmas');

module.exports = app => {
    app.get('/turmas', (req, res) => {
        Turma.lista(res);
    });

}