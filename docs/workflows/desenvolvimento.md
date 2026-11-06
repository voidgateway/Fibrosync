# Fluxo de desenvolvimento

Este documento descreve como trabalhar no código do Fibrosync no dia a dia: rodar o projeto, criar e editar páginas, adicionar rotas e dependências e validar antes do Pull Request. O fluxo de branches, commits e PRs está no [Git Workflow](git.flow.md), e a instalação do ambiente em [Configuração do ambiente](../development/setup.md).

## 1. Visão geral

O Fibrosync é um site em HTML, CSS e JavaScript puro, servido por um servidor **Node.js + Express**. As dependências são gerenciadas com **pnpm** ([ADR 0002](../decisions/0002-pnpm-como-gerenciador-de-pacotes.md)).

```text
git checkout -b FIB-XXX-tipo/descricao   (Git Workflow)
  ↓
pnpm install                              (só se o package.json mudou)
  ↓
pnpm dev                                  (servidor em http://localhost:3000)
  ↓
editar public/views/... ou src/...
  ↓
validar no navegador
  ↓
commit + Pull Request                     (Git Workflow)
```

## 2. Rodando o projeto

```bash
pnpm install   # após clonar ou quando o package.json / pnpm-lock.yaml mudar
pnpm dev       # servidor com recarga automática ao salvar arquivos em src/
```

Alterações em `public/` (HTML, CSS, JS das páginas) não precisam reiniciar o servidor: basta recarregar a página no navegador. Alterações em `src/` reiniciam o servidor automaticamente com `pnpm dev`.

## 3. Estrutura

```text
public/                          # tudo que o navegador recebe
├── assets/                      # recursos compartilhados entre páginas
│   ├── css/tokens.css           # variáveis do design system
│   └── img/
└── views/                       # uma pasta por página
    ├── <pagina>/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js            # opcional
    └── 404/                     # página de erro (ver seção 6)

src/                             # servidor
├── server.js                    # inicia o servidor (porta)
├── app.js                       # configura o Express: assets, rotas, 404, erros
├── config/                      # variáveis de ambiente e caminhos
├── routes/
│   ├── index.js                 # junta todos os routers
│   └── pages.routes.js          # serve as páginas de public/views
└── middlewares/                 # 404 e tratamento de erros
```

### Como o servidor responde

| Requisição | Resposta |
|---|---|
| `/` | Redireciona para `/landing-page/` |
| `/<pagina>/` | `public/views/<pagina>/index.html` |
| `/<pagina>/style.css`, `/<pagina>/script.js` | Arquivos da pasta da página |
| `/assets/...` | `public/assets/...` |
| `/404/` acessada diretamente | Página de erro com status `404` |
| Qualquer outra URL | Página de erro com status `404` (ou JSON, para chamadas de API) |

## 4. Criando uma página

1. Crie a pasta em `public/views/` com nome em português, minúsculas e separado por `-`, como nas branches: `public/views/recuperar-senha/`.
2. Adicione `index.html` e `style.css` (e `script.js`, se precisar).
3. Pronto: a página já está disponível em `http://localhost:3000/recuperar-senha/`. Não é preciso registrar rota no servidor.
4. Adicione o responsável pela pasta no [`CODEOWNERS`](../../.github/CODEOWNERS).

Modelo mínimo:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar senha | Fibrosync</title>
    <link rel="stylesheet" href="../../assets/css/tokens.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <img src="../../assets/img/logo_texto.png" alt="Fibrosync">
    <a href="../login-paciente/index.html">Voltar para o login</a>
    <script src="script.js"></script>
</body>
</html>
```

## 5. Caminhos nas páginas

Todos os caminhos dentro das páginas (`href`, `src` e `window.location`) são **relativos à pasta da página**, como se o arquivo fosse aberto direto do disco.

| De `public/views/<pagina>/index.html` para | Use |
|---|---|
| CSS/JS da própria página | `style.css`, `script.js` |
| Outra página | `../cadastro/index.html` |
| Imagens e CSS compartilhados | `../../assets/img/logo_texto.png` |

Assim os caminhos funcionam tanto pelo servidor (`/cadastro/`) quanto abrindo o arquivo pelo Live Server ou direto no navegador.

Evite:

```html
<link rel="stylesheet" href="/public/views/cadastro/style.css">
<img src="/public/assets/img/logo_texto.png">
```

Prefira:

```html
<link rel="stylesheet" href="style.css">
<img src="../../assets/img/logo_texto.png">
```

Em `script.js`, o caminho de `window.location.href` é relativo à **página** que carregou o script, não ao arquivo `.js`. Como o script fica na mesma pasta da página, as regras da tabela acima valem igualmente:

```js
window.location.href = "../dados-complementares/index.html";
```

## 6. Página de erro (404)

A pasta `public/views/404/` contém a página mostrada quando uma URL não existe. Ela tem duas diferenças em relação às outras páginas:

- **Usa `<base href="/">`.** A página pode aparecer em qualquer URL (ex.: `/a/b/c`), então os caminhos relativos dela partem sempre da raiz do site: `assets/css/tokens.css`, `404/style.css`, `landing-page/`.
- **Não é uma página navegável.** Acessar `/404/` diretamente responde com status `404`, e não `200`. Isso é feito em [`pages.routes.js`](../../src/routes/pages.routes.js). Não crie links para ela.

## 7. Adicionando rotas de API

Quando houver back-end, as rotas seguem a estrutura em camadas abaixo. Crie as pastas conforme forem necessárias:

```text
src/
├── routes/        # pacientes.routes.js  → define URLs e chama o controller
├── controllers/   # pacientes.controller.js → lê a requisição e monta a resposta
├── services/      # pacientes.service.js → regras de negócio
└── repositories/  # pacientes.repository.js → acesso aos dados
```

Registre o novo router em [`src/routes/index.js`](../../src/routes/index.js), **antes** das páginas e sob o prefixo `/api`:

```js
router.use('/api/pacientes', require('./pacientes.routes'));
router.use(pagesRoutes);
```

Rotas de API inexistentes respondem `404` em JSON (`{ "error": "Recurso não encontrado" }`). Ver [API](../api/overview.md).

## 8. Variáveis de ambiente

Novas variáveis devem ser:

1. lidas somente em [`src/config/env.js`](../../src/config/env.js), com valor padrão quando fizer sentido;
2. adicionadas ao `.env.example` com um valor seguro (nunca um segredo real);
3. documentadas na tabela de [Configuração do ambiente](../development/setup.md#variáveis-de-ambiente).

O arquivo `.env` não é versionado.

## 9. Dependências

Use sempre o pnpm:

```bash
pnpm add <pacote>       # dependência da aplicação
pnpm add -D <pacote>    # dependência de desenvolvimento
pnpm remove <pacote>
```

Commite o `package.json` e o `pnpm-lock.yaml` juntos, no mesmo commit, com o tipo `chore`:

```text
FIB-XXX chore: adicionar <pacote>
```

Não commite `package-lock.json` nem `yarn.lock` (eles já estão no `.gitignore`).

## 10. Validação antes do Pull Request

Enquanto lint, testes e CI permanecem **A definir** ([Estratégia de testes](../testing/strategy.md)), a validação é manual:

- [ ] `pnpm dev` sobe sem erros no terminal;
- [ ] as páginas alteradas abrem pelo servidor (`http://localhost:3000/<pagina>/`);
- [ ] CSS, imagens e scripts carregam (aba **Network** do DevTools sem respostas `404`);
- [ ] links e redirecionamentos levam para as páginas certas;
- [ ] o console do navegador não mostra erros;
- [ ] nenhum caminho começa com `/public/`.

Registre essas verificações na seção **Como testar** do Pull Request.
