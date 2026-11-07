<!-- esqueleto de arquivo, ainda tem que definir com o a prof como será a entrega de dados -->
# Configuração do ambiente

Como preparar a máquina para rodar o Fibrosync localmente. O dia a dia do desenvolvimento (criar páginas, caminhos, rotas, validação) está em [Fluxo de desenvolvimento](../workflows/desenvolvimento.md).

## Pré-requisitos

| Ferramenta | Versão | Finalidade |
|---|---|---|
| Node.js | 22.9 ou superior | Executar o servidor Express |
| pnpm | 10 ou superior | Instalar dependências e rodar scripts |
| Git | Qualquer versão recente | Versionamento ([Git Workflow](../workflows/git.flow.md)) |

O gerenciador de pacotes do projeto é o **pnpm** ([ADR 0002](../decisions/0002-pnpm-como-gerenciador-de-pacotes.md)). Não use `npm install` nem `yarn`: eles geram outro lockfile e podem instalar versões diferentes das registradas no `pnpm-lock.yaml`.

Se ainda não tiver o pnpm:

```bash
npm install -g pnpm
# ou, com Corepack (vem com o Node.js):
corepack enable
```

Confira as versões:

```bash
node -v
pnpm -v
```

## Instalação

```bash
git clone https://github.com/voidgateway/Fibrosync.git
cd Fibrosync
pnpm install
```

## Variáveis de ambiente

As variáveis são opcionais: sem um `.env`, o servidor usa os valores padrão. Para alterá-las, copie o modelo:

```bash
cp .env.example .env
```

Os scripts carregam o `.env` automaticamente, se ele existir. O `.env` não é versionado.

| Variável | Obrigatória | Descrição | Exemplo seguro |
|---|---|---|---|
| `PORT` | Não | Porta do servidor (padrão `3000`) | `3000` |
| `NODE_ENV` | Não | Ambiente de execução (padrão `development`) | `development` |

## Execução local

```bash
pnpm dev     # reinicia ao salvar arquivos em src/
pnpm start   # execução normal
```

Páginas disponíveis em `http://localhost:3000`:

| URL | Página |
|---|---|
| `/` | Redireciona para `/landing-page/` |
| `/landing-page/` | Landing page |
| `/cadastro/` | Cadastro |
| `/login-paciente/` | Login do paciente |
| `/dados-complementares/` | Dados complementares |

Cada pasta em `public/views/` vira uma página automaticamente. URLs que não existem mostram a página de erro com status `404`.

## Verificações

| Verificação | Comando | Status |
|---|---|---|
| Lint | — | A definir |
| Smoke test | `pnpm test` | Implementado ([Estratégia de testes](../testing/strategy.md)) |
| CI | Automático em cada PR | GitHub Actions ([ADR 0003](../decisions/0003-ci-com-github-actions.md)) |
| Build | — | Não necessário: as páginas são servidas sem etapa de build |

Antes de abrir um Pull Request, rode `pnpm test` e, para mudanças de interface, siga a [validação manual](../workflows/desenvolvimento.md#10-validação-antes-do-pull-request).

## Problemas conhecidos

| Problema | Causa | Solução |
|---|---|---|
| `EADDRINUSE: address already in use :::3000` | Outro processo já usa a porta 3000 | Feche o outro processo ou defina outra `PORT` no `.env` |
| `.env not found. Continuing without it.` no terminal | Não existe `.env` | Apenas aviso; o servidor usa os valores padrão |
| `pnpm` não é reconhecido | pnpm não instalado | Veja [Pré-requisitos](#pré-requisitos) |
| `ERR_PNPM_OUTDATED_LOCKFILE` no CI | O `package.json` mudou e o `pnpm-lock.yaml` não foi commitado | Rode `pnpm install` e commite o `pnpm-lock.yaml` |
| Links levam à página 404 | `recuperar-senha.html`, `dashboard.html` (login) e `../home/index.html` (dados complementares) apontam para páginas ainda não criadas | Criar as páginas correspondentes |
