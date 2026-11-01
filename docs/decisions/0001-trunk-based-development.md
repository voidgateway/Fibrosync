# ADR 0001 — Adoção de trunk-based development

## Status

`Accepted`

## Contexto

Aplicação de um workflow (fluxo de trabalho) que é adequado para as caracteristicas do projeto

## Decisão

Uso do trunk-based-development, prática de desenvolvimento em que a equipe integra alterações pequenas e frequentes em uma branch principal compartilhada, chamada _trunk_, normalmente representada pela ``main``. Os desenvolvedores podem utilizar branches de curta duração, evitando manter funcionalidades isoladas por longos períodos.

O objetivo é reduzir a divergência entre o trabalho dos integrantes, simplificar revisões e identificar problemas de integração mais cedo. A branch principal deve permanecer estável e pronta para publicação. Para sustentar esse estado, Adotamos trunk-based development com branches curtas e Pull Requests para ``main``, buscando integração diária e usando um ou dois dias como referência para a duração das branches.. Funcionalidades ainda incompletas podem permanecer desativadas por meio de feature flags (quando ci/cd estiver definido), permitindo separar a integração do código da sua disponibilização aos usuários, essa pratica se encaixa nos padrões ja andotados em que as branches são criadas a partir da ``main`` e retornam a ela por Pull Requests.

Fontes:
[Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development)

## Alternativas consideradas

Gitflow, um modelo de organização de branches que separa o desenvolvimento, a preparação de versões e o código publicado. Ele utiliza duas branches permanentes: ``main``, que registra as versões de produção, e ``develop``, que reúne as alterações previstas para a próxima versão. 

Manter duas branchs permanetes em um time pequeno e com apenas um revisor poderia aumentar a carga de trabalho por que exige manter diferentes linhas sincronizadas e administrar mais merges. no contexto da equipe PRs poderiam ficar estacados por tempos superiores a duração de uma sprint.


## Consequências

### Positivas

- revisões mais simples
- menos conflitos acumulados 
- maior visibilidade do trabalho integrado

### Negativas

- revisar frequentemente
- tarefas bem definidas

### Riscos

- nenhum observado

## Referências

- Jira: [FIB-74](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-74)
- Confluence: (não aplicavel)
- Figma: (não aplicavel)
- Pull Request: (não aplicavel)
