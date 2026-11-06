<!-- esqueleto de arquivo, ainda tem que definir com o a prof como será a entrega de dados -->
# Estratégia de testes

// A definir

## Níveis de teste

| Nível | Objetivo | Ferramenta | Status |
|---|---|---|---|
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
# Comandos a definir após a escolha das ferramentas de teste.
```

## Integração contínua

A stack já está definida (Node.js + Express, pnpm). Os testes automatizados farão parte do workflow de CI quando _(se)_ as ferramentas e os comandos de teste forem escolhidos. O `src/app.js` exporta o app sem abrir porta, o que permite testá-lo diretamente quando houver uma ferramenta de testes.

Até lá, a validação é manual: ver [Fluxo de desenvolvimento](../workflows/desenvolvimento.md#10-validação-antes-do-pull-request).
