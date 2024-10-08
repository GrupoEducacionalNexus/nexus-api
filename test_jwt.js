const jwt = require('jsonwebtoken');

const payload = { test: 'test' };
const secret = 'mysecretkey';

try {
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  console.log('Token gerado com sucesso:', token);
} catch (error) {
  console.error('Erro ao gerar o token:', error);
}
