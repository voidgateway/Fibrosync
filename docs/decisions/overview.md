<!-- esqueleto de arquivo, ainda tem que definir com o a prof como será a entrega de dados -->
# Decisões de arquitetura

Este diretório centraliza as decisões técnicas relevantes para a arquitetura do frontend do Fibrosync e mantém sua relação com as tarefas do projeto no Jira, documentação no Confluence e prototipos no Figma.

## Fontes relacionadas

| Fonte | Responsabilidade | Link |
|---|---|---|
| Jira | Tarefas e contexto de execução | [FIB no jira](https://aluno-team-zylgcwkh.atlassian.net/jira/software/projects/FIB/summary) |
| Confluence | Requisitos e documentação funcional | [Fibrosync](https://aluno-team-zylgcwkh.atlassian.net/wiki/spaces/F/overview) |
| Figma | Protótipos e decisões de interface | [Fibrosync](https://www.figma.com/files/team/1635721117049360128/all-folders?fuid=1635749553250315535) |
| GitHub | Implementação e revisão do código | [Fibrosync](https://github.com/voidgateway/Fibrosync) |

## Mapa de decisões

| ADR | Decisão | Status | Jira | Confluence | Figma | Pull Request |
|---|---|---|---|---|---|---|
| [0001](0001-trunk-based-development.md) | Adoção de trunk-based development | `Accepted` | [FIB-74](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-74) | Não aplicável | Não aplicável | [#17](https://github.com/voidgateway/Fibrosync/pull/17) |

## Estrutura dos registros

```text
docs/decisions/
├── overview.md
└── NNNN-descricao-da-decisao.md
```

Cada ADR concentra o contexto, a decisão adotada, as alternativas consideradas e suas consequências. O mapa conecta a decisão à tarefa no **Jira**, à documentação no **Confluence**, ao protótipo específico no **Figma**, quando aplicável, e à implementação no **Pull Request**.

As referências de design apontam para o arquivo, a página ou o frame específico do Figma. O link do time funciona apenas como ponto central de acesso.

## Status

| Status | Significado |
|---|---|
| `Proposed` | Decisão em discussão |
| `Accepted` | Decisão aprovada e em uso |
| `Deprecated` | Decisão não recomendada para novas implementações |
| `Superseded` | Decisão substituída por outro ADR |

## Rastreabilidade

```text
Confluence / Figma
  ↓
Jira
  ↓
ADR
  ↓
Pull Request
  ↓
Main
```
