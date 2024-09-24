// send-email-test.js
const enviarEmail = require('./send-email');

(async () => {
    try {
        const resultado = await enviarEmail(
            'solicitacoes@centroeducanexus.com.br', // Substitua pelo e-mail de teste
            'Teste de E-mail',
            `<b>Este é um teste de envio de e-mail.</b>`
        );
        console.log('E-mail enviado com sucesso:', resultado.response);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
})();
