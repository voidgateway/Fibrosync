const fs = require('node:fs');
const path = require('node:path');

// único lugar que lê os registros de dor/sintomas dos mocks.
// o .json é lido uma vez ao subir o servidor; quando a API real existir,
// só este arquivo muda.
const ARQUIVO = path.join(__dirname, '..', 'mocks', 'registros.json');

const registros = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));

// registros do paciente, do mais antigo para o mais recente
function listarPorPaciente(pacienteId) {
  return registros
    .filter((registro) => registro.pacienteId === pacienteId)
    .sort((a, b) => a.data.localeCompare(b.data));
}

module.exports = { listarPorPaciente };
