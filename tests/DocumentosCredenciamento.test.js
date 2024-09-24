// tests/DocumentosCredenciamento.test.js

// Mockar os módulos antes de importá-los
jest.mock('../infraestrutura/conexao');
jest.mock('../services/send-email');
jest.mock('../services/buscaUsuario', () => ({
    buscarUsuario: jest.fn(),
}));
jest.mock('../services/registrarNotificacao', () => ({
    registrarNoficacao: jest.fn(),
}));
jest.mock('../services/socket', () => ({
    getIO: jest.fn(),
}));
jest.mock('../services/conectados', () => ([
    { nome: 'Usuario Teste', id: 123 }, // Mock do usuário conectado
]));

// Importar os módulos após mockar
const DocumentoCredenciamento = require('../models/documento_credenciamento');
const conexao = require('../infraestrutura/conexao');
const enviarEmail = require('../services/send-email');
const { buscarUsuario } = require('../services/buscaUsuario');
const { registrarNoficacao } = require('../services/registrarNotificacao');
const socket = require('../services/socket'); // Importar o socket mockado

describe('DocumentoCredenciamento', () => {
    describe('altera', () => {
        it('deve atualizar o status e enviar notificações e e-mails', async () => {
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock dos dados de entrada
            const id = 1;
            const valores = {
                id_status: 2,
                observacao: 'Aprovado pelo admin',
                email: 'usuario@dominio.com',
                item_checklist: 'Item 1'
            };

            // Mock da resposta do banco de dados
            conexao.query.mockImplementation((sql, params, callback) => {
                // Verifique se a consulta SQL está correta
                expect(sql).toContain('UPDATE documento_credenciamento SET status = ?, observacao = ? WHERE id = ?');
                expect(params).toEqual([valores.id_status, valores.observacao, id]);
                callback(null, { affectedRows: 1 });
            });

            // Mock das funções assíncronas
            buscarUsuario.mockResolvedValue([{ nome: 'Usuario Teste', id: 123 }]);
            registrarNoficacao.mockResolvedValue();

            // Mock do socket.io
            const emitMock = jest.fn();
            const toMock = jest.fn().mockReturnValue({ emit: emitMock });
            socket.getIO.mockReturnValue({ to: toMock });

            // Executa o método
            await DocumentoCredenciamento.altera(id, valores, mockRes);

            // Verifica se o status foi atualizado
            expect(conexao.query).toHaveBeenCalledTimes(1);

            // Verifica se o e-mail foi enviado
            expect(enviarEmail).toHaveBeenCalledWith(
                'usuario@dominio.com',
                'Atualização no Documento do Checklist "Item 1"',
                expect.stringContaining('O documento anexado referente ao item do checklist "<strong>Item 1</strong>" recebeu uma nova avaliação.')
            );

            // Verifica se a notificação foi registrada
            expect(registrarNoficacao).toHaveBeenCalledWith(
                'O documento anexado referente ao item do checklist "Item 1" recebeu uma nova avaliação.',
                9,
                123
            );

            // Verifica se o socket.emit foi chamado corretamente
            expect(socket.getIO).toHaveBeenCalledTimes(1);
            expect(toMock).toHaveBeenCalledWith(123); // Número, não string
            expect(emitMock).toHaveBeenCalledWith('notification', {
                message: 'O documento anexado referente ao item do checklist "Item 1" recebeu uma nova avaliação.'
            });

            // Verifica a resposta enviada
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ status: 200, msg: "Atualizado com sucesso." });
        });
    });
});
