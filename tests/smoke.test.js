// Smoke test: sobe o servidor e confere se as páginas e seus arquivos carregam.
// Roda com `pnpm test` e no CI (.github/workflows/ci.yml).
//
// Página nova em public/views/ entra no teste sozinha, sem precisar mexer aqui.

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const app = require('../src/app');
const { VIEWS_DIR } = require('../src/config/paths');

// todas as pastas de public/views, menos a 404 (testada à parte)
const PAGINAS = fs
  .readdirSync(VIEWS_DIR, { withFileTypes: true })
  .filter((item) => item.isDirectory() && item.name !== '404')
  .map((item) => item.name);

let server;
let baseUrl;

before(async () => {
  server = app.listen(0); // 0 = qualquer porta livre
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

function pedir(caminho, opcoes = {}) {
  return fetch(new URL(caminho, baseUrl), { redirect: 'manual', ...opcoes });
}

// CSS, JS e imagens que a página carrega.
// Links <a> e window.location ficam de fora: podem apontar para telas ainda não criadas.
function recursosDaPagina(html, urlDaPagina) {
  const base = html.match(/<base\s+href="([^"]+)"/i);
  const urlBase = new URL(base ? base[1] : urlDaPagina, urlDaPagina);

  const caminhos = [
    ...[...html.matchAll(/<link\b[^>]*\bhref="([^"]+)"/gi)].map((m) => m[1]),
    ...[...html.matchAll(/\bsrc="([^"]+)"/gi)].map((m) => m[1]),
  ];

  return caminhos
    .filter((caminho) => !/^(https?:|data:|\/\/)/.test(caminho)) // externos (Google Fonts etc.)
    .map((caminho) => new URL(caminho, urlBase));
}

async function conferirRecursos(html, urlDaPagina) {
  for (const recurso of recursosDaPagina(html, urlDaPagina)) {
    const resposta = await pedir(recurso);
    assert.equal(
      resposta.status,
      200,
      `${recurso.pathname} (usado em ${urlDaPagina.pathname}) respondeu ${resposta.status}`,
    );

    // regra dos caminhos relativos também vale para os redirecionamentos do script.js
    if (recurso.pathname.endsWith('.js')) {
      assert.doesNotMatch(await resposta.text(), /["'`]\/public\//, `${recurso.pathname} usa caminho /public/`);
    }
  }
}

describe('páginas', () => {
  it('/ redireciona para a landing page', async () => {
    const resposta = await pedir('/');
    assert.equal(resposta.status, 302);
    assert.equal(resposta.headers.get('location'), '/landing-page/');
  });

  for (const pagina of PAGINAS) {
    it(`/${pagina}/ carrega com CSS, scripts e imagens`, async () => {
      const url = new URL(`/${pagina}/`, baseUrl);
      const resposta = await pedir(url);
      assert.equal(resposta.status, 200);

      const html = await resposta.text();
      assert.doesNotMatch(html, /(href|src)="\/public\//, 'a página usa caminho /public/ (use caminho relativo)');
      await conferirRecursos(html, url);
    });
  }
});

describe('página 404', () => {
  it('URL inexistente mostra a página de erro com status 404', async () => {
    const url = new URL('/rota/que/nao/existe', baseUrl);
    const resposta = await pedir(url, { headers: { accept: 'text/html' } });
    assert.equal(resposta.status, 404);
    assert.match(resposta.headers.get('content-type'), /text\/html/);

    await conferirRecursos(await resposta.text(), url);
  });

  for (const caminho of ['/404', '/404/', '/404/index.html']) {
    it(`${caminho} acessada direto responde 404 (e não 200)`, async () => {
      const resposta = await pedir(caminho, { headers: { accept: 'text/html' } });
      assert.equal(resposta.status, 404);
    });
  }

  it('chamada de API inexistente responde 404 em JSON', async () => {
    const resposta = await pedir('/api/nao-existe', { headers: { accept: 'application/json' } });
    assert.equal(resposta.status, 404);
    assert.deepEqual(await resposta.json(), { error: 'Recurso não encontrado' });
  });
});
