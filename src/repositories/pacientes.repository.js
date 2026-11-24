const fs = require('node:fs');
const path = require('node:path');

// único lugar que lê/grava os mocks.
// o .json é lido uma vez ao subir o servidor; cadastro e troca de senha
// gravam de volta no arquivo. quando a API real existir, só este arquivo muda.
// PACIENTES_ARQUIVO troca o arquivo (os testes usam uma cópia temporária).
const ARQUIVO = process.env.PACIENTES_ARQUIVO || path.join(__dirname, '..', 'mocks', 'pacientes.json');

const pacientes = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));

function gravar() {
  fs.writeFileSync(ARQUIVO, `${JSON.stringify(pacientes, null, 2)}\n`);
}

function buscarPorEmail(email) {
  const procurado = email.toLowerCase();
  return pacientes.find((paciente) => paciente.email.toLowerCase() === procurado) || null;
}

function buscarPorId(id) {
  return pacientes.find((paciente) => paciente.id === id) || null;
}

function criar({ nome, email, senha }) {
  const id = pacientes.reduce((maior, paciente) => Math.max(maior, paciente.id), 0) + 1;
  const paciente = { id, nome, email, senha };
  pacientes.push(paciente);
  gravar();
  return paciente;
}

function atualizarSenha(id, senha) {
  const paciente = buscarPorId(id);
  if (!paciente) return null;
  paciente.senha = senha;
  gravar();
  return paciente;
}

module.exports = { buscarPorEmail, buscarPorId, criar, atualizarSenha };
