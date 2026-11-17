// Testa o resumo do dashboard montado a partir dos mocks
// (src/mocks/registros.json e src/mocks/clima.json).

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const dashboardService = require('../src/services/dashboard.service');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

function buscarDashboard(query) {
  return fetch(new URL(`/api/dashboard?${query}`, baseUrl));
}

// data fixa, logo depois do último registro do mock (2026-11-09)
const HOJE = new Date(2026, 10, 10);

describe('GET /api/dashboard', () => {
  it('devolve o resumo do paciente do mock', async () => {
    const resposta = await buscarDashboard('pacienteId=1&dias=30');
    assert.equal(resposta.status, 200);

    const dados = await resposta.json();
    assert.equal(dados.paciente.nome, 'Vivi Teste');
    assert.equal(dados.paciente.senha, undefined);
    assert.equal(dados.periodo.dias, 30);
    assert.ok(dados.clima.alerta);
  });

  it('período inválido responde 400', async () => {
    const resposta = await buscarDashboard('pacienteId=1&dias=15');
    assert.equal(resposta.status, 400);
  });

  it('paciente inexistente responde 404', async () => {
    const resposta = await buscarDashboard('pacienteId=999&dias=7');
    assert.equal(resposta.status, 404);
  });
});

describe('dashboard.service.montarResumo', () => {
  it('calcula dor recente, média e pico dos últimos 7 dias', () => {
    const resumo = dashboardService.montarResumo(1, 7, HOJE);

    assert.equal(resumo.periodo.inicio, '2026-11-04');
    assert.equal(resumo.periodo.fim, '2026-11-10');
    assert.equal(resumo.dor.recente.data, '2026-11-09');
    assert.ok(resumo.dor.pico.valor >= resumo.dor.media);
    assert.ok(resumo.areas.length <= 3);
    assert.equal(resumo.cargaSintomas.ultimoDia, '2026-11-09');
  });

  it('sem registros no período devolve valores vazios', () => {
    const resumo = dashboardService.montarResumo(1, 7, new Date(2030, 0, 1));

    assert.equal(resumo.periodo.registros, 0);
    assert.equal(resumo.dor.recente, null);
    assert.equal(resumo.contexto, null);
    assert.deepEqual(resumo.areas, []);
    assert.equal(resumo.insights.disposicao.tendencia, 'sem-dados');
  });
});
