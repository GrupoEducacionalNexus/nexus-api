const express = require('express');
const consign = require('consign');
const cors = require('cors');
const helmet = require('helmet');


//FUNÇÃO RESPONSÁVEL POR CONFIGURAR O APP DO EXPRESS
module.exports = () => {
  const app = express();
  app.use(cors({ origin: ['https://www.gestorgruponexus.com.br', 'http://localhost:3000'], credentials: true }));
  app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));
  app.use(express.json({ extended: false, limit: '50mb' }));

  // app.use(helmet({
  //   referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  // }));
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
      "upgrade-insecure-requests": [],
      "block-all-mixed-content": [],
      "plugin-types": [],
      "sandbox": [],
      "require-sri-for": [],
      "report-uri": [],
      "strict-origin-when-cross-origin": [] // add this directive
    }
  }));

  consign().include('controllers').into(app);
  return app;
};
