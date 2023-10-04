const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
let jwt = require('jsonwebtoken');

class Auth { 
    
    login(auth, res) {
        const { email, senha } = auth;
        const sql = `SELECT usuarios.id, usuarios.email, usuarios.nome, usuarios.senha, usuarios.id_setor,
        usuariosxpermissoes.id_permissao, permissoes.nome AS permissao
        FROM usuarios  
        INNER JOIN usuariosxpermissoes ON usuariosxpermissoes.id_usuario = usuarios.id
        INNER JOIN permissoes ON usuariosxpermissoes.id_permissao = permissoes.id
        WHERE usuarios.email = ? and usuarios.senha = ?
        ORDER BY permissoes.nome`;

        conexao.query(sql, [email, senha], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    let id_permissao = [];
                    for(let i = 0; i < resultados.length; i++) {
                        id_permissao.push(resultados[i].id_permissao);
                    }
        
                    let id = resultados[0].id;
                    let nome = resultados[0].nome;
                    let email = resultados[0].email;
                    // id_permissao = resultados[0].id_permissao;
                    let permissao = resultados[0].permissao;
                    let id_setor = resultados[0].id_setor;
                    
                    const token = jwt.sign({ id, nome, email, id_permissao, permissao, id_setor }, process.env.SECRET, {});

                    res.status(200).send({ auth: true, token: token, id, nome, email, id_permissao, permissao, id_setor, status: 200 });
                } else {
                    res.status(400).json({ status: 400, msg: "Email, senha ou nível de acesso estão incorretos!" });
                }
            }
        });
    }

    verificaJWT(req, res, next) {
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;
        if (!token) {
            res.status(401).send({ auth: false, message: 'Acesso Restrito.' });
        } else {
            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if (err) return res.status(500).send({ auth: false, message: 'Token Inválido.', status: 500 });

                // se tudo estiver ok, salva no request para uso posterior
                req.userId = decoded.id;
                req.nome = decoded.nome;
                req.email = decoded.email;
                req.id_permissao = decoded.id_permissao;
                req.permissao = decoded.permissao;
                req.id_setor = decoded.id_setor
                next();
            });
        }
    }
}


module.exports = new Auth;