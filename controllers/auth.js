const Auth = require('../models/auth');

module.exports = app => {
    app.post('/login', (req, res) => {
        const auth = req.body;
        Auth.login(auth, res);
    });

    app.get('/logout', (req, res) => {
        res.status(201).send({ auth: false, token: null });
    });
}

