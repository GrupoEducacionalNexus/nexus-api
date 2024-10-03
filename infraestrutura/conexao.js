// infraestrutura/conexao.js
const mysql = require('mysql2');

const conexao = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
 
module.exports = conexao;

