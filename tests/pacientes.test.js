// Testa a API de pacientes que lê os mocks (src/mocks/pacientes.json).

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

function login(corpo) {
  return fetch(new URL('/api/pacientes/login', baseUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });
}

describe('POST /api/pacientes/login', () => {
  it('credenciais do mock entram e a senha não volta na resposta', async () => {
    const resposta = await login({ email: 'vivi@gmail.com', senha: 'Vivi1234' });
    assert.equal(resposta.status, 200);

    const { paciente } = await resposta.json();
    assert.equal(paciente.email, 'vivi@gmail.com');
    assert.equal(paciente.senha, undefined);
  });

  it('senha errada responde 401', async () => {
    const resposta = await login({ email: 'vivi@gmail.com', senha: 'errada123' });
    assert.equal(resposta.status, 401);
  });

  it('campos vazios respondem 400', async () => {
    const resposta = await login({ email: '', senha: '' });
    assert.equal(resposta.status, 400);
  });
});
