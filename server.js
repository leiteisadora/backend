require('dotenv').config();
const http = require('http');

if (typeof process.env.JWT_SECRET !== 'string' || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
   throw new Error('Configure JWT_SECRET com pelo menos 32 bytes aleatórios antes de iniciar o servidor.');
}

if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_ORIGIN) {
   throw new Error('Configure FRONTEND_ORIGIN com a origem do frontend antes de iniciar em produção.');
}

const app = require('./app');

const port = process.env.PORT || 5000;
const host = process.env.IP || process.env.HOST;

const server = http.createServer(app);

const onListening = () => {
   console.log(`Servidor rodando em ${host || '0.0.0.0'}:${port}`);
};

if (host) {
   server.listen(port, host, onListening);
} else {
   server.listen(port, onListening);
}
