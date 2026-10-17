<h1 align="center">Fibrosync</h1>

<p align="center">
  <em>Plataforma <strong>inteligente</strong> para acompanhar pacientes com fibromialgia, com o objetivo de auxiliar nas consultas médicas e no conhecimento da própria doença.</em>
</p>

<p align="center">
  <img src="docs/design/assets/fibrosync.png" alt="Logo do fibrosync" width="20%">
</p>

<p align="center">
  <a href="https://fibrosync.com"><b>Fibrosync</b></a>
</p>



## Tecnologias

- html, css e js puro
- node 

## Documentação

- [Índice da documentação](docs/README.md)
- [Arquitetura](docs/architecture/overview.md)
- [Design](docs/design/overview.md)
- [Decisões de arquitetura](docs/decisions/overview.md)
- [Configuração do ambiente](docs/development/setup.md)
- [Git workflow](docs/workflows/git.flow.md)
- [Estratégia de testes](docs/testing/strategy.md)

## Estrutura do projeto

```
Fibrosync/
├───.github/                                # configurações do GitHub
│       CODEOWNERS                          # responsáveis pela revisão de cada área
│       pull_request_template.md            # modelo de descrição dos Pull Requests
│
├───docs/                                   # documentação técnica do projeto
│   │   README.md                           # índice da documentação
│   │
│   ├───accessibility/
│   │       overview.md                     # diretrizes de acessibilidade
│   │
│   ├───api/
│   │       overview.md                     # relação com a API e seu contrato
│   │
│   ├───architecture/
│   │       overview.md                     # visão geral da arquitetura e componentes
│   │
│   ├───decisions/
│   │       overview.md                     # mapa das decisões de arquitetura (ADRs)
│   │       template.md                     # modelo para novos ADRs
│   │
│   ├───design/
│   │   │   overview.md                     # referências de design e identidade visual
│   │   │
│   │   └───assets/
│   │           fibrosync.png               # logo usada na documentação
│   │
│   ├───development/
│   │       setup.md                        # configuração do ambiente de desenvolvimento
│   │
│   ├───operations/
│   │       deployment.md                   # processo de deploy
│   │
│   ├───releases/
│   │       changelog.md                    # política de uso do CHANGELOG.md
│   │       overview.md                     # ligação entre versões do Jira e releases do GitHub
│   │
│   ├───testing/
│   │       strategy.md                     # estratégia de testes
│   │
│   └───workflows/
│           git.flow.md                     # fluxo de branches, commits e PRs
│
├───public/                                 # arquivos estáticos servidos ao navegador
│   ├───assets/
│   │   ├───css/                            # estilos compartilhados entre páginas
│   │   └───js/                             # scripts compartilhados entre páginas
│   ├───img/
│   │       ilustracao-dor.png              # ilustração da landing page
│   │       logo_icone.png                  # logo apenas com o ícone
│   │       logo_texto.png                  # logo com o nome Fibrosync
│   │
│   └───pages/                              # uma pasta por tela
│       ├───cadastro-paciente/
│       │       index.html                  # estrutura da tela de cadastro
│       │       script.js                   # interações (ex.: mostrar/esconder senha)
│       │       style.css                   # estilos da tela de cadastro
│       │
│       └───landing/
│               index.html                  # estrutura da landing page
│               style.css                   # estilos da landing page
│
├───src/                                    # código do servidor (Node)
│       route.js                            # definição das rotas
│       server.js                           # inicialização do servidor
│
│   .gitignore                              # arquivos ignorados pelo Git
│   CHANGELOG.md                            # histórico de mudanças do projeto
│   CONTRIBUTING.md                         # guia de contribuição
│   README.md                               # apresentação do projeto
│   todo.md                                 # lista de tarefas pendentes
```


## Gestão do projeto

O acompanhamento das tarefas, a documentação funcional e os protótipos estão distribuídos entre as seguintes fontes:

- [Projeto FIB no Jira](https://aluno-team-zylgcwkh.atlassian.net/jira/software/projects/FIB/summary): backlog, tarefas, bugs e acompanhamento da implementação;
- [Espaço do Fibrosync no Confluence](https://aluno-team-zylgcwkh.atlassian.net/wiki/spaces/F/overview): requisitos e documentação funcional;
- [Time do Fibrosync no Figma](https://www.figma.com/files/team/1635721117049360128/all-folders?fuid=1635749553250315535): protótipos e referências de interface.
