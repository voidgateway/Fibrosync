# ADR 0003 — CI com GitHub Actions

## Status

`Accepted`

## Contexto

Com o servidor Express e o pnpm, a validação de cada Pull Request passou a depender de passos manuais: instalar as dependências, subir o servidor e conferir se as páginas, os arquivos e a página 404 continuam funcionando. Esses passos estão no checklist do template do PR, mas nada garante que foram executados, e erros como esquecer o `pnpm-lock.yaml` ou usar um caminho `/public/` só aparecem na máquina de outra pessoa.

O projeto não tem etapa de build: o Express entrega os arquivos de `public/` como estão. Por isso, o que precisa ser automatizado é a **verificação** (CI), não a geração de artefatos.

## Decisão

Usar o **GitHub Actions** para rodar o CI em todo Pull Request para a `main` e em todo push na `main`.

- O workflow fica em `.github/workflows/ci.yml` e:
  1. instala o pnpm (versão do `packageManager`) e o Node.js 22 (versão mínima do `engines`);
  2. instala as dependências com `pnpm install --frozen-lockfile`, que falha se o lockfile não foi commitado;
  3. roda `pnpm test`.
- `pnpm test` executa o smoke test em `tests/smoke.test.js`, escrito com o executor de testes nativo do Node.js (`node:test`), sem dependências novas. Ele sobe o servidor e confere:
  - que `/` redireciona para a landing page;
  - que cada pasta de `public/views` responde `200` e carrega seus CSS, scripts e imagens;
  - que nenhuma página usa caminho `/public/`;
  - que URLs inexistentes, `/404/` e chamadas de API inexistentes respondem `404`.
- Página nova em `public/views` entra no teste automaticamente.
- O resultado aparece como check no Pull Request e, pela integração do GitHub com o Jira, na área **Desenvolvimento** do item.

Fontes:
[GitHub Actions — Node.js](https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs)
[pnpm — Continuous Integration](https://pnpm.io/continuous-integration)
[Node.js — Test runner](https://nodejs.org/api/test.html)

## Alternativas consideradas

**Continuar só com a validação manual.** Não exige nada novo, mas depende de cada integrante seguir o checklist, e o revisor não tem como saber se ele foi seguido.

**GitLab CI**, já que o repositório também é espelhado no GitLab. Foi descartado porque os Pull Requests, a revisão e a integração com o Jira acontecem no GitHub. Se o GitLab passar a ser usado para revisão, o mesmo smoke test pode ser chamado de um `.gitlab-ci.yml`.

**Jest ou Vitest para os testes.** São ferramentas mais completas, mas adicionam dependências e configuração para um teste que o `node:test` já resolve. A escolha da ferramenta para testes unitários e de integração continua em aberto na [estratégia de testes](../testing/strategy.md).

## Consequências

### Positivas

- Todo PR mostra se o projeto instala e se as páginas carregam, sem depender do checklist manual.
- Lockfile esquecido, arquivo faltando e caminho `/public/` são detectados antes do merge.
- Os builds aparecem no Jira junto com a branch, os commits e o PR.

### Negativas

- Cada PR leva cerca de um minuto a mais até o check terminar.
- O smoke test não verifica aparência, responsividade nem o comportamento dos formulários: a validação manual continua necessária para mudanças de interface.

### Riscos

- O check falhar e o PR ser integrado mesmo assim. Mitigação: configurar a proteção da `main` no GitHub para exigir o check `Instala e testa` antes do merge (configuração do repositório, feita por quem administra).
- As actions usadas (`actions/checkout`, `actions/setup-node`, `pnpm/action-setup`) mudarem de versão principal. Mitigação: o workflow fixa a versão principal de cada uma.

## Referências

- Jira: [FIB-74](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-74)
- Confluence: (não aplicável)
- Figma: (não aplicável)
- Pull Request: [#21](https://github.com/voidgateway/Fibrosync/pull/21)
