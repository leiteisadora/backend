require('dotenv').config();
const http = require('http');

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
