// index.js
require("dotenv").config();

//A responsabilidade desse arquivo é subir o servidor
const customExpress = require('./config/customExpress');
const conexao = require("./infraestrutura/conexao");
const Tabelas = require('./infraestrutura/tabelas');

const fs = require('fs');
const http = require('http');
const https = require('https');
const socketIo = require('socket.io');

// Opções para o servidor HTTPS
const options = {
    key: fs.readFileSync('./ssl/privkey.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
};

// Inicializar tabelas e banco de dados
Tabelas.init(conexao);

// Inicializar o servidor Express
const app = customExpress();
const port = process.env.PORT || 3000;
let server;

// Criar servidor HTTPS ou HTTP
if (process.env.USE_HTTPS === 'true') {
    server = https.createServer(options, app);
    console.log("Servidor HTTPS configurado.");
} else {
    server = http.createServer(app);
    console.log("Servidor HTTP configurado.");
}

// // Configurar CORS manualmente
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "https://www.gestorgruponexus.com.br:21036, http://localhost:3000");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     if (req.method === "OPTIONS") {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });

// Inicializar o Socket.IO
const io = socketIo(server, {
    cors: {
        origin: ["https://www.gestorgruponexus.com.br:21036", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});
const conectados = [];

io.on('connection', (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);
    socket.on('entrar', (username) => {
        // Armazenar o ID do usuário no mapa
        conectados.push({ id: socket.id, nome: username });
        console.log(conectados);
        console.log(`Usuário ${username} entrou com ID ${socket.id}`);

        // Enviar o ID do usuário para o cliente
        socket.emit('userId', socket.id);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);

        // Localizar o índice do usuário que está conectado
        let indice = conectados.findIndex(objeto => objeto.id === socket.id);

        // Verificar se o objeto foi encontrado na matriz
        if (indice !== -1) {
            // Remover o objeto utilizando o método splice()
            conectados.splice(indice, 1);
        }
    });
});

// Ouvir na porta especificada
server.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.error(`Erro ao iniciar o servidor: ${err.message}`);
        process.exit(1);
    }
    console.log(`Servidor rodando na porta ${port}`);
});