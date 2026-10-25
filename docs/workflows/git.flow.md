# Git Workflow

Este documento define o padrão de branches, commits e Pull Requests do Fibrosync. A chave do item no Jira conecta essas atividades ao painel de desenvolvimento e permite rastrear o trabalho até builds e deployments.

## CHAVE EPICO
**TECNICO**
```text
FIB-74
```

## 1. Regra principal do Jira

Todo trabalho deve estar associado a um item do Jira. A chave deve ser escrita em letras maiúsculas e acompanhar todo o fluxo.

```text
FIB-123
```

Use a mesma chave:

- no início do nome da branch;
- no início de cada mensagem de commit;
- no início do título do Pull Request.

Não use `fib-123` ou outra variação de maiúsculas e minúsculas. Se ainda não existir um item correspondente, crie-o no Jira antes de iniciar o desenvolvimento; não invente uma referência.

O Jira só exibe os dados de desenvolvimento depois que a branch ou os commits são enviados ao repositório conectado. A sincronização pode levar alguns minutos.

### Épico de manutenção técnica

O épico **TECNICO** agrupa melhorias relacionadas à qualidade interna, à manutenção e às ferramentas do projeto.

```text
FIB-74 TECNICO
```

Por padrão, cada Pull Request deve continuar vinculado a uma tarefa, história ou bug próprio. O item deve ser filho do épico técnico quando fizer parte desse objetivo maior.

Excepcionalmente, um Pull Request pode usar diretamente a chave do épico técnico, sem item próprio, quando **todos** os critérios abaixo forem atendidos:

- a alteração é pequena, interna e de baixo risco;
- o trabalho cabe em um único Pull Request;
- não existe requisito funcional ou critério de aceite independente;
- a alteração trata somente de documentação técnica, automação, configuração, ferramentas ou manutenção simples;
- o uso direto do épico é identificado e justificado no template do Pull Request.

Criar um item próprio quando a alteração:

- adiciona ou modifica comportamento visível ao usuário;
- corrige um bug identificável;
- envolve segurança, dados, migração ou dependências de alto impacto;
- precisa de estimativa, responsável, prioridade ou acompanhamento individual;
- pode ser entregue, revertida ou validada separadamente;
- reúne mais de um objetivo técnico.

Em caso de dúvida, crie uma tarefa ou um bug próprio e associe-o ao épico.

Referências oficiais:

- [Referenciar itens do Jira no trabalho de desenvolvimento](https://support.atlassian.com/jira-software-cloud/docs/reference-issues-in-your-development-work/)
- [O que é um épico](https://support.atlassian.com/jira-software-cloud/docs/what-is-an-epic/)
- [Tipos e hierarquia de itens](https://support.atlassian.com/jira-cloud-administration/docs/what-are-issue-types/)

## 2. Fluxo de desenvolvimento

O Fibrosync adota **trunk-based development com branches curtas e Pull Requests**. A `main` é a linha principal de integração e deve permanecer funcional. Toda alteração parte dela e retorna por um PR revisado, preservando os padrões de rastreabilidade do Jira.

### Práticas adotadas

- Divida o trabalho em incrementos pequenos, que possam ser revisados e integrados com segurança.
- Busque integrar diariamente quando houver trabalho em andamento, com branches de até um ou dois dias como referência. Esse prazo não dispensa revisão nem justifica integrar código quebrado.
- Abra o PR cedo e priorize sua revisão para evitar que as branches acumulem divergências.
- Divida funcionalidades maiores em vários PRs. Cada PR deve manter um único objetivo e a referência ao item do Jira correspondente; um item pode ter mais de um PR.
- Integre partes incompletas somente quando preservarem o funcionamento existente. Quando necessário, mantenha o novo comportamento desativado por uma feature flag, com remoção prevista após a liberação.
- Após o merge, remova a branch de trabalho e crie a próxima a partir da `main` atualizada.
- Se uma alteração quebrar a `main`, priorize a correção ou a reversão por PR.

Integrar código não significa publicar em produção. A adoção deste fluxo mantém a revisão por PR; ferramentas de testes, CI, regras automatizadas de proteção e deploy permanecem **A definir**.

### Por que adotar o trunk-based development?

O objetivo é reduzir conflitos acumulados, facilitar revisões e descobrir incompatibilidades mais cedo. Isso exige mudanças pequenas e disponibilidade para revisar com frequência.

Referências:

- [Trunk-based development — Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development)
- [Gitflow — Atlassian](https://www.atlassian.com/en/git/tutorials/comparing-workflows/gitflow-workflow)

### Passo a passo

Atualize a branch principal:

```bash
git checkout main
git pull
```

Crie uma branch para o item:

```bash
git checkout -b FIB-123-feat/tela-login
```

Após cada alteração lógica:

```bash
git add .
git commit -m "FIB-123 feat: implementar tela de login"
git push -u origin FIB-123-feat/tela-login
```

Abra um Pull Request para `main` com o título:

```text
FIB-123 Implementar tela de login
```

## 3. Branches

As branches seguem o formato:

```text
FIB-XXX-tipo/descricao-curta
```

Exemplo:

```text
FIB-123-feat/tela-login
```

A chave vem primeiro para ficar imediatamente identificável pelo Jira. O tipo informa a natureza da alteração e a descrição diferencia trabalhos do mesmo tipo.

### Tipos

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `style` | Alterações visuais ou de estilo |
| `test` | Adição ou alteração de testes |
| `docs` | Alteração de documentação |
| `chore` | Configurações, dependências ou manutenção |

### Exemplos

```text
FIB-123-feat/tela-login
FIB-210-fix/barra-navegacao-celular
FIB-321-refactor/autenticacao
FIB-410-style/layout-painel
FIB-500-docs/atualizar-readme
FIB-530-chore/atualizar-eslint
```

### Regras

- escreva a chave do Jira em letras maiúsculas;
- use um dos tipos definidos pela equipe em letras minúsculas;
- escreva a descrição em português do Brasil, com letras minúsculas;
- separe as palavras da descrição com `-`;
- não use espaços, acentos ou outros caracteres especiais;
- mantenha a descrição curta e específica.

Evite:

```text
feat/FIB-123-tela-login
fib-123-feat/tela-login
FIB-123/novaTela
feature-login
branch-final
```

Prefira:

```text
FIB-123-feat/tela-login
```

## 4. Commits

As mensagens de commit seguem o formato:

```text
FIB-XXX tipo: descrição
```

Exemplo:

```text
FIB-123 feat: implementar formulário de login
```

A chave deve ser o primeiro elemento e deve aparecer em todos os commits da branch. Isso permite ao Jira associar cada commit ao item e manter a ligação de builds e deployments que contenham esse commit.

Use os mesmos tipos definidos para as branches:

```text
FIB-123 feat: implementar formulário de login
FIB-210 fix: corrigir transbordamento da barra de navegação
FIB-321 refactor: extrair autenticação para módulo próprio
FIB-410 style: ajustar espaçamento do painel
FIB-500 docs: documentar variáveis de ambiente
FIB-520 test: cobrir validação de credenciais
FIB-530 chore: atualizar dependências do eslint
```

### Boas práticas

Cada commit deve representar uma alteração lógica. A descrição deve informar claramente o resultado da mudança, usando verbo no infinitivo e sem ponto final.

Evite:

```text
FIB-123 ajustes
FIB-123 fix: correções
FIB-123 versão final
```

Prefira:

```text
FIB-123 fix: tratar credenciais de login inválidas
```

Evite colocar alterações não relacionadas no mesmo commit.

## 5. Pull Requests

O título do Pull Request segue o formato:

```text
FIB-XXX Descrição objetiva
```

Exemplo:

```text
FIB-123 Implementar tela de login
```

A chave deve aparecer no início do título, sem ser substituída por links ou texto em letras minúsculas. O Jira também pode reconhecer o Pull Request pela chave na branch de origem, mas o título continua obrigatório para manter o padrão do repositório e uma associação explícita.

O Pull Request deve ter `main` como destino, permanecer focado em um único item do Jira e explicar o que mudou e como validar a implementação.

Quando for aplicada a exceção de vínculo direto ao épico técnico, o Pull Request deve permanecer focado em uma única alteração e registrar por que ela não justifica um item próprio.

A usar o epico `TECNICO` é possivel modificar/remover os itens presentes no checklist do template do pr

### Template do Pull Request

O modelo oficial está em [`.github/pull_request_template.md`](../../.github/pull_request_template.md) e é carregado automaticamente pelo GitHub.

Preencha:

- a referência ao Jira;
- o requisito ou a documentação relacionada no Confluence;
- o arquivo, a página ou o frame relacionado no Figma, quando aplicável;
- o objetivo e o resumo das alterações;
- as instruções de teste;
- as evidências visuais ou técnicas;
- o checklist de validação;
- a atualização do changelog, quando aplicável.

Não remova os campos de Confluence e Figma. Quando um deles não se aplicar, registre `Não aplicável`, salvo uso do epico `TECNICO`.

## 6. Evidências

Pull Requests que alteram a interface devem incluir screenshots. Sempre que relevante, inclua as visualizações de computador e celular; mudanças responsivas importantes também podem incluir tablet.

Screenshots normalmente não são necessárias para alterações exclusivamente internas, como `refactor`, `chore` ou `test`, mas outras evidências técnicas podem ser solicitadas.

## 7. CI, testes, builds e deploy

As etapas de automação e entrega ainda não estão implementadas por este fluxo:

| Etapa | Status | Definições pendentes |
|---|---|---|
| Integração contínua (CI) | A definir | Ferramentas, gatilhos e verificações obrigatórias |
| Testes | A definir | Ferramentas, comandos e critérios de execução |
| Build | A definir | Necessidade, comandos e artefatos |
| Deploy | A definir | Ambientes, gatilhos, aprovações e rollback |

Consulte a [estratégia de testes](../testing/strategy.md) e o [processo de deploy](../operations/deployment.md) para acompanhar essas definições. O merge em `main` não estabelece um deploy automático.

Quando builds e deployments forem configurados, a associação ao Jira deverá preservar a chave do item nos commits incluídos na entrega. Por isso, todos os commits devem seguir o padrão definido neste documento.

Depois do `push`, consulte a área **Desenvolvimento** do item no Jira para confirmar a associação da branch, dos commits e do Pull Request.

## 8. Antes de abrir um Pull Request

Atualize sua branch em relação à `main` quando necessário:

```bash
git checkout main
git pull

git checkout FIB-123-feat/tela-login
git merge main
```

Resolva eventuais conflitos, revise o diff e registre no PR como a alteração foi validada, incluindo evidências quando aplicável. Execute somente verificações que estiverem configuradas no projeto e informe as limitações da validação.

Os comandos de CI, testes e build permanecem **A definir**, conforme a seção anterior.

## 9. Revisão

Um Pull Request deve ser pequeno o suficiente para que outra pessoa compreenda claramente a alteração.

Durante a revisão:

- responda aos comentários;
- realize as correções na mesma branch;
- use a mesma chave do Jira nos novos commits;
- evite criar outro Pull Request para corrigir o atual.

Após aprovação e validação, o Pull Request pode ser integrado à `main`. Remova a branch integrada e mantenha a revisão dos próximos incrementos frequente.

## Resumo

```text
Jira:         FIB-123 - Criar tela de login
Branch:       FIB-123-feat/tela-login
Commit:       FIB-123 feat: implementar formulário de login
Pull Request: FIB-123 Implementar tela de login
```

```text
Jira
  ↓
Branch
  ↓
Commits
  ↓
Pull Request e revisão
  ↓
main
```