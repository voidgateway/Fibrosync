const fs = require('node:fs');
const path = require('node:path');

// leitura do clima. por enquanto vem dos mocks;
// quando houver um serviço de clima de verdade, só este arquivo muda.
const ARQUIVO = path.join(__dirname, '..', 'mocks', 'clima.json');
const ARQUIVO_CIDADES = path.join(__dirname, '..', 'mocks', 'clima-cidades.json');

const clima = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));
const { automatica, cidades } = JSON.parse(fs.readFileSync(ARQUIVO_CIDADES, 'utf8'));

// clima atual (usado pelo dashboard)
function buscarAtual() {
  return clima;
}

// cidades com clima disponível (usadas no "Selecione o local" do check-in)
function listarCidades() {
  return cidades;
}

// compara sem diferenciar maiúsculas nem acentos: "sao paulo" acha "São Paulo"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
}

function buscarPorCidade(nome) {
  const alvo = normalizar(nome);
  return cidades.find((item) => normalizar(item.cidade) === alvo) || null;
}

// cidade que faz o papel da localização do aparelho enquanto não há GPS de verdade
function buscarAutomatica() {
  return buscarPorCidade(automatica);
}

module.exports = { buscarAtual, listarCidades, buscarPorCidade, buscarAutomatica };
