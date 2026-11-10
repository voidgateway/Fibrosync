const fs = require('node:fs');
const path = require('node:path');

// leitura do clima atual. por enquanto vem do mock;
// quando houver um serviço de clima de verdade, só este arquivo muda.
const ARQUIVO = path.join(__dirname, '..', 'mocks', 'clima.json');

const clima = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));

function buscarAtual() {
  return clima;
}

module.exports = { buscarAtual };
