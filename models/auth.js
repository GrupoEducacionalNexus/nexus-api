
// models/auth.js
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
                    for (let i = 0; i < resultados.length; i++) {
                        id_permissao.push(resultados[i].id_permissao);
                    }
        
                    let id = resultados[0].id;
                    let nome = resultados[0].nome;
                    let email = resultados[0].email;
                    // id_permissao = resultados[0].id_permissao;
                    let permissao = resultados[0].permissao;
                    let id_setor = resultados[0].id_setor;
                    
                    // Adicionando logs para depuração
                    console.log('id:', id);
                    console.log('nome:', nome);
                    console.log('email:', email);
                    console.log('id_permissao:', id_permissao);
                    console.log('permissao:', permissao);
                    console.log('id_setor:', id_setor);
                    console.log('process.env.SECRET:', process.env.SECRET);

                    // Verificando se process.env.SECRET está definido
                    if (!process.env.SECRET) {
                        console.error('A variável SECRET não está definida.');
                        res.status(500).send('Erro no servidor');
                        return;
                    }

                    try {
                        // Removendo o objeto de opções vazio ou definindo opções válidas
                        const token = jwt.sign(
                            { id, nome, email, id_permissao, permissao, id_setor },
                            process.env.SECRET,
                            { expiresIn: '1h' } // Definindo opções se necessário
                        );

                        res.status(200).send({
                            auth: true,
                            token: token,
                            id,
                            nome,
                            email,
                            id_permissao,
                            permissao,
                            id_setor,
                            status: 200
                        });
                    } catch (error) {
                        console.error('Erro ao gerar o token JWT:', error);
                        res.status(500).json({ status: 500, msg: 'Erro no servidor ao gerar token' });
                    }
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
                req.id_setor = decoded.id_setor;
                next();
            });
        }
    }
}

module.exports = new Auth();
