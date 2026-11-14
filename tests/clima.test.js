// Testa o clima atual usado no check-in (src/mocks/clima.json).

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

describe('GET /api/clima', () => {
  it('devolve cidade, temperatura, mínima, máxima e condição', async () => {
    const resposta = await fetch(new URL('/api/clima', baseUrl));
    assert.equal(resposta.status, 200);

    const clima = await resposta.json();
    assert.equal(typeof clima.cidade, 'string');
    assert.equal(typeof clima.temperatura, 'number');
    assert.equal(typeof clima.minima, 'number');
    assert.equal(typeof clima.maxima, 'number');
    assert.equal(typeof clima.condicao, 'string');
    assert.ok(clima.minima <= clima.maxima);
  });

  it('não expõe pressão nem umidade', async () => {
    const clima = await (await fetch(new URL('/api/clima', baseUrl))).json();
    assert.equal(clima.pressao, undefined);
    assert.equal(clima.umidade, undefined);
  });

  it('?cidade= devolve o clima da cidade, sem diferenciar acento nem maiúscula', async () => {
    const resposta = await fetch(new URL('/api/clima?cidade=sao%20paulo', baseUrl));
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).cidade, 'São Paulo');
  });

  it('?cidade= inexistente responde 404', async () => {
    const resposta = await fetch(new URL('/api/clima?cidade=Atlantida', baseUrl));
    assert.equal(resposta.status, 404);
    assert.deepEqual(await resposta.json(), { error: 'Cidade não encontrada.' });
  });
});

describe('GET /api/clima/cidades', () => {
  it('lista nome e UF das cidades disponíveis', async () => {
    const cidades = await (await fetch(new URL('/api/clima/cidades', baseUrl))).json();
    assert.ok(cidades.length > 0);
    cidades.forEach((item) => assert.deepEqual(Object.keys(item), ['cidade', 'uf']));
  });
});

describe('GET /api/clima/automatica', () => {
  it('devolve o clima da localização do mock', async () => {
    const resposta = await fetch(new URL('/api/clima/automatica', baseUrl));
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).cidade, 'Floriano');
  });
});
