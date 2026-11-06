<!-- esqueleto de arquivo, ainda tem que definir com o a prof como será a entrega de dados -->
# API

// A definir

## Contrato

| Recurso | Referência | Status |
|---|---|---|
| Especificação da API | A definir | Pendente |

## Ambientes

| Ambiente | Finalidade | URL |
|---|---|---|
| Desenvolvimento | Execução local (`pnpm dev`) | `http://localhost:3000` |
| Homologação | A definir | A definir |
| Produção | A definir | A definir |

## Autenticação

<!-- Referenciar a documentação funcional ou técnica correspondente. -->

## Tratamento de erros

O servidor já diferencia navegador e chamadas de API pelo cabeçalho `Accept`:

| Situação | Navegador (`Accept: text/html`) | API (`Accept: application/json`) |
|---|---|---|
| Rota inexistente | Página 404 (`public/views/404`), status `404` | `{ "error": "Recurso não encontrado" }`, status `404` |
| Erro inesperado | Texto do erro, status `500` | Texto do erro, status `500` |

Em `NODE_ENV=production`, erros `5xx` respondem apenas `Erro interno do servidor`, sem expor detalhes. As rotas de API devem ficar sob o prefixo `/api` ([Fluxo de desenvolvimento](../workflows/desenvolvimento.md#7-adicionando-rotas-de-api)).

<!-- Quando a API existir: padronizar o corpo de erro 500 em JSON e registrar códigos de erro de negócio. -->

## Compatibilidade

<!-- Registrar a estratégia de versionamento e compatibilidade da API. -->
