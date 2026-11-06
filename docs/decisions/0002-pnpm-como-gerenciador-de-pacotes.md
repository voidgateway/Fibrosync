# ADR 0002 — pnpm como gerenciador de pacotes

## Status

`Accepted`

## Contexto

Com a adoção do Node.js e do Express para servir as páginas, o projeto passou a ter dependências. A equipe precisa de um único gerenciador de pacotes para que todos instalem exatamente as mesmas versões e para que exista apenas um lockfile no repositório.

## Decisão

Usar o **pnpm** como gerenciador de pacotes do projeto.

- A versão fica registrada no campo `packageManager` do `package.json` (`pnpm@10.33.0`), o que permite ao Corepack instalar a versão certa automaticamente.
- O `pnpm-lock.yaml` é versionado e deve ser commitado junto com qualquer alteração no `package.json`.
- Comandos do dia a dia: `pnpm install`, `pnpm add <pacote>`, `pnpm dev`, `pnpm start`.
- `package-lock.json` e `yarn.lock` não devem ser commitados.

Fontes:
[pnpm — Motivação](https://pnpm.io/motivation)

## Alternativas consideradas

**npm**, que já vem com o Node.js e não exige instalação extra. Foi descartado porque o pnpm instala mais rápido, ocupa menos espaço em disco (reaproveita pacotes entre projetos) e é mais rígido com dependências: um pacote só pode importar o que está declarado no `package.json`, o que evita erros que só aparecem na máquina de outra pessoa.

**Yarn**, que tem vantagens parecidas com as do pnpm, mas não traz ganho em relação a ele para o tamanho deste projeto e tem diferenças grandes entre as versões 1 e 2+.

## Consequências

### Positivas

- Instalações mais rápidas e reproduzíveis.
- Um único lockfile no repositório.
- Dependências não declaradas falham cedo, em vez de funcionar por acaso.

### Negativas

- Cada integrante precisa instalar o pnpm (ou habilitar o Corepack) antes de rodar o projeto.

### Riscos

- Alguém rodar `npm install` por hábito e commitar um `package-lock.json`. Mitigação: revisão de PR e instruções em [setup.md](../development/setup.md).

## Referências

- Jira: [FIB-74](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-74)
- Confluence: (não aplicável)
- Figma: (não aplicável)
- Pull Request: (a definir)
