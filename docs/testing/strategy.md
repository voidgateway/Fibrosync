# Estratégia de testes

Este documento descreve a estratégia de testes adotadas no projeto

## Níveis de teste

| Nível | Objetivo | Ferramenta | Status |
|---|---|---|---|
| Smoke | Servidor sobe; páginas, arquivos e 404 respondem; caminhos relativos | `node:test` (nativo do Node.js) | Implementado em `tests/smoke.test.js` |
| Unitário | Validar unidades isoladas | A definir | Planejado |
| Integração | Validar a colaboração entre componentes | A definir | Planejado |
| Ponta a ponta | Validar fluxos principais do usuário | A definir | Planejado |

## Critérios por alteração

| Tipo de alteração | Validação esperada |
|---|---|
| Regra de negócio | Testes unitários e de integração aplicáveis |
| Integração externa | Cenários de sucesso, erro e indisponibilidade |
| Interface | Estados, responsividade e acessibilidade |
| Correção de bug | Teste que reproduza a falha corrigida |

## Execução

```bash
pnpm test   # smoke test (tests/smoke.test.js)
# Comandos a definir após a escolha das ferramentas de teste.
```

`pnpm test` roda `node --test`, que encontra sozinho os arquivos `*.test.js` do projeto. Testes novos com esse sufixo entram no mesmo comando e no CI sem configuração extra.

## Integração contínua

O smoke test já roda no CI com GitHub Actions em todo Pull Request para a `main` ([ADR 0003](../decisions/0003-ci-com-github-actions.md)). Os testes unitários e de integração entrarão no mesmo workflow quando _(se)_ as ferramentas forem escolhidas. O `src/app.js` exporta o app sem abrir porta, o que permite testá-lo diretamente, como o smoke test já faz.

O smoke test não verifica aparência, responsividade nem formulários. Para mudanças de interface, a validação continua manual: ver [Fluxo de desenvolvimento](../workflows/desenvolvimento.md#10-validação-antes-do-pull-request).
