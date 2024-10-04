// Importando os módulos necessários
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { readdirSync } = require('fs');
const path = require('path');

// FUNÇÃO RESPONSÁVEL POR CONFIGURAR O APP DO EXPRESS
module.exports = () => {
  const app = express();

  // Configurando o CORS para permitir apenas origens específicas
  app.use(cors({
    origin: ['https://www.gestorgruponexus.com.br', 'http://localhost:3000'],
    credentials: true
  }));

  // Configuração de limite de tamanho de payload
  app.use(express.urlencoded({ limit: '10mb', extended: false, parameterLimit: 10000 }));
  app.use(express.json({ extended: false, limit: '10mb' }));

  // Middleware de segurança - Helmet
  app.use(helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "style-src": ["'self'"],
      "img-src": ["'self'"],
      "connect-src": ["'self'"],
      "font-src": ["'self'"],
      "object-src": ["'none'"],
      "media-src": ["'self'"],
      "frame-src": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
      "manifest-src": ["'self'"],
      "frame-ancestors": ["'none'"],
      "worker-src": ["'self'"],
    }
  }));

  // Limitar requisições por IP para evitar ataques de DoS
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita cada IP a 100 requisições por janela de 15 minutos
    message: 'Muitas requisições feitas deste IP, por favor tente novamente mais tarde.'
  });
  app.use(limiter);

  // Carregar controladores manualmente
  const controllersPath = path.join(__dirname, '../controllers');
  readdirSync(controllersPath).forEach((file) => {
    const controller = require(path.join(controllersPath, file));
    if (typeof controller === 'function') {
      controller(app);
    }
  });

  return app;
};