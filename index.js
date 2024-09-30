require("dotenv-safe").config({
  allowEmptyValues: true
});

require("dotenv-safe").config();
//A responsabilidade desse arquivo é subir o servidor
const customExpress = require('./config/customExpress');
const conexao = require("./infraestrutura/conexao");
const Tabelas = require('./infraestrutura/tabelas');

// const fs = require('fs');

// var options = {
//     key: fs.readFileSync('./ssl/privkey.pem'),
//     cert: fs.readFileSync('./ssl/cert.pem'),
// };
Tabelas.init(conexao);
const app = customExpress();
const port = process.env.PORT || 4000;
const server = require('http').createServer(app);

const socket = require('./services/socket');

const io = socket.init(server); 
// Mapa para armazenar o ID do usuário por nome de usuário
const conectados = require('./services/conectados');

io.on('connection', (socket) => { 
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

    //Localizar o indice do usuário que está conectado
    let indice = conectados.findIndex(objeto => objeto.id === socket.id);

    //Verificar se o objeto foi encontrado na matriz
    if (indice !== -1) {
      //Remover o objeto utlizando o método splice()
      conectados.splice(indice, 1); 
    } 
  });
});

// https.createServer(options, app).listen(port, function () {
//     console.log("Servidor rodando na porta " + port);
// });

server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));


