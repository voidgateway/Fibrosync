<!-- Título obrigatório: FIB-XXX Descrição objetiva -->

## Jira

[FIB-XXX](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-XXX)

### Tipo de vínculo

- [ ] Item próprio do Jira
- [ ] Vínculo direto ao épico técnico

<!-- Ao usar diretamente o épico técnico, explique por que a alteração atende a todos os critérios de exceção do Git Workflow -->

Justificativa da exceção: Não aplicável.

## Confluence

<!-- Link para o requisito ou a documentação relacionada; use "Não aplicável" quando não houver -->

## Figma

<!-- Link para o arquivo, a página ou o frame relacionado; use "Não aplicável" quando não houver -->

## Objetivo

<!-- Descreva de forma breve o objetivo deste Pull Request -->

## Alterações

- 

## Como testar

1. 

## Evidências

<!-- Inclua screenshots, vídeos ou logs quando aplicável -->

## Checklist

- [ ] O título começa com a chave do Jira em maiúsculas (`FIB-XXX Descrição objetiva`)
- [ ] A branch começa com a mesma chave do Jira (`FIB-XXX-tipo/descricao-curta`)
- [ ] Todos os commits começam com a mesma chave do Jira (`FIB-XXX tipo: descrição`)
- [ ] O Pull Request usa um item próprio ou atende aos critérios de vínculo direto ao épico técnico
- [ ] Os critérios de aceite foram validados
- [ ] Os testes aplicáveis foram executados
- [ ] O servidor sobe com `pnpm dev` e as páginas alteradas carregam sem respostas 404 (lint e build: a definir)
- [ ] Os caminhos nas páginas são relativos (nenhum começa com `/public/`)
- [ ] Se as dependências mudaram, o `pnpm-lock.yaml` foi commitado junto com o `package.json`
- [ ] A documentação foi atualizada, quando necessário
- [ ] O `CHANGELOG.md` foi atualizado ou a alteração não é relevante para a release
- [ ] Não existem erros no console
