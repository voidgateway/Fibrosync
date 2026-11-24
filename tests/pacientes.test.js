// Testa a API de pacientes que lê os mocks (src/mocks/pacientes.json).
// Cadastro e troca de senha gravam no arquivo; por isso o teste usa uma cópia temporária.

const { describe, it, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'fibrosync-'));
process.env.PACIENTES_ARQUIVO = path.join(pasta, 'pacientes.json');
fs.copyFileSync(path.join(__dirname, '..', 'src', 'mocks', 'pacientes.json'), process.env.PACIENTES_ARQUIVO);

const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(pasta, { recursive: true, force: true });
});

function pedir(caminho, corpo) {
  return fetch(new URL(caminho, baseUrl), corpo === undefined ? {} : {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });
}

const login = (corpo) => pedir('/api/pacientes/login', corpo);

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

describe('POST /api/pacientes (cadastro)', () => {
  it('cria a conta, grava no arquivo e já deixa entrar', async () => {
    const resposta = await pedir('/api/pacientes', { nome: 'Ana', email: 'ana@email.com', senha: 'Senha!123' });
    assert.equal(resposta.status, 201);

    const { paciente } = await resposta.json();
    assert.equal(paciente.nome, 'Ana');
    assert.equal(paciente.senha, undefined);

    const gravados = JSON.parse(fs.readFileSync(process.env.PACIENTES_ARQUIVO, 'utf8'));
    assert.ok(gravados.some((p) => p.email === 'ana@email.com'));

    assert.equal((await login({ email: 'ana@email.com', senha: 'Senha!123' })).status, 200);
  });

  it('e-mail que já tem conta responde 409, sem diferenciar maiúsculas', async () => {
    const resposta = await pedir('/api/pacientes', { nome: 'Outra', email: 'VIVI@gmail.com', senha: 'Senha!123' });
    assert.equal(resposta.status, 409);
  });

  it('senha fora das regras responde 400', async () => {
    const resposta = await pedir('/api/pacientes', { nome: 'Ana', email: 'nova@email.com', senha: 'semregras' });
    assert.equal(resposta.status, 400);
  });
});

describe('recuperar a senha', () => {
  // o link sai no terminal (não há envio de e-mail); o teste o lê de lá
  async function pedirLink(email) {
    const log = mock.method(console, 'log', () => {});
    const resposta = await pedir('/api/pacientes/senha/link', { email });
    const linha = log.mock.calls.map((c) => c.arguments.join(' ')).find((l) => l.includes('token='));
    log.mock.restore();
    return { resposta, token: linha ? new URL(linha.split(' ').pop()).searchParams.get('token') : null };
  }

  it('responde 202 mesmo sem conta, e só gera link para quem tem conta', async () => {
    const sem = await pedirLink('ninguem@email.com');
    assert.equal(sem.resposta.status, 202);
    assert.equal(sem.token, null);

    const com = await pedirLink('vivi@gmail.com');
    assert.equal(com.resposta.status, 202);
    assert.ok(com.token);
  });

  it('o link mostra a conta, troca a senha uma vez só e a senha nova entra', async () => {
    const { token } = await pedirLink('vivi@gmail.com');

    const conferir = await pedir(`/api/pacientes/senha/${token}`);
    assert.equal(conferir.status, 200);
    assert.equal((await conferir.json()).email, 'vivi@gmail.com');

    assert.equal((await pedir('/api/pacientes/senha', { token, senha: 'Nova!1234' })).status, 200);
    assert.equal((await pedir('/api/pacientes/senha', { token, senha: 'Outra!1234' })).status, 410);
    assert.equal((await login({ email: 'vivi@gmail.com', senha: 'Nova!1234' })).status, 200);
  });

  it('link inventado responde 410', async () => {
    assert.equal((await pedir('/api/pacientes/senha/naoexiste')).status, 410);
  });
});
