const fs = require('node:fs');
const path = require('node:path');

// único lugar que lê/grava os mocks.
// o .json é lido uma vez ao subir o servidor; gravações ficam só em memória
// e somem ao reiniciar. quando a API real existir, só este arquivo muda.
const ARQUIVO = path.join(__dirname, '..', 'mocks', 'pacientes.json');

const pacientes = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));

function buscarPorEmail(email) {
  const procurado = email.toLowerCase();
  return pacientes.find((paciente) => paciente.email.toLowerCase() === procurado) || null;
}

function buscarPorId(id) {
  return pacientes.find((paciente) => paciente.id === id) || null;
}

module.exports = { buscarPorEmail, buscarPorId };
