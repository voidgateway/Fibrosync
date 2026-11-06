<h1 align="center">Fibrosync</h1>

<p align="center">
  <em>Plataforma <strong>inteligente</strong> para acompanhar pacientes com fibromialgia, com o objetivo de auxiliar nas consultas médicas e no conhecimento da própria doença.</em>
</p>

<p align="center">
  <img src="docs/design/assets/fibrosync.png" alt="Logo do fibrosync" width="20%">
</p>




## Tecnologias

- HTML, CSS e JavaScript puro
- Node.js 22.9+ com Express
- pnpm ([por quê](docs/decisions/0002-pnpm-como-gerenciador-de-pacotes.md))

## Como rodar

```bash
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`. Detalhes em [Configuração do ambiente](docs/development/setup.md).

## Documentação

- [Índice da documentação](docs/README.md)
- [Arquitetura](docs/architecture/overview.md)
- [Design](docs/design/overview.md)
- [Decisões de arquitetura](docs/decisions/overview.md)
- [Configuração do ambiente](docs/development/setup.md)
- [Fluxo de desenvolvimento](docs/workflows/desenvolvimento.md)
- [Git workflow](docs/workflows/git.flow.md)
- [Estratégia de testes](docs/testing/strategy.md)

## Estrutura do projeto

```text
D Fibrosync/
├── D .github/                             # configurações do GitHub
│   ├── F CODEOWNERS                       # responsáveis pela revisão de cada área
│   └── F pull_request_template.md         # modelo de descrição dos Pull Requests
├── D .gitlab/                             # espelho das configurações para o GitLab
│   ├── F CODEOWNERS
│   └── D merge_request_templates/
│       └── F Default.md
├── D docs/                                # documentação técnica do projeto
│   ├── D accessibility/
│   │   └── F overview.md                  # diretrizes de acessibilidade
│   ├── D api/
│   │   └── F overview.md                  # relação com a API e seu contrato
│   ├── D architecture/
│   │   └── F overview.md                  # visão geral da arquitetura e componentes
│   ├── D decisions/
│   │   ├── F 0001-trunk-based-development.md
│   │   ├── F 0002-pnpm-como-gerenciador-de-pacotes.md
│   │   ├── F overview.md                  # mapa das decisões de arquitetura (ADRs)
│   │   └── F template.md                  # modelo para novos ADRs
│   ├── D design/
│   │   ├── D assets/
│   │   │   └── P fibrosync.png            # logo usada na documentação
│   │   └── F overview.md                  # referências de design e identidade visual
│   ├── D development/
│   │   └── F setup.md                     # configuração do ambiente de desenvolvimento
│   ├── D operations/
│   │   └── F deployment.md                # processo de deploy
│   ├── D releases/
│   │   ├── F changelog.md                 # política de uso do CHANGELOG.md
│   │   └── F overview.md                  # ligação entre versões do Jira e releases do GitHub
│   ├── D testing/
│   │   └── F strategy.md                  # estratégia de testes
│   ├── D workflows/
│   │   ├── F desenvolvimento.md           # dia a dia: páginas, caminhos, rotas e validação
│   │   └── F git.flow.md                  # fluxo de branches, commits e PRs
│   └── F README.md                        # índice da documentação
├── D public/                              # arquivos estáticos servidos ao navegador
│   ├── D assets/                          # recursos estáticos compartilhados
│   │   ├── D css/
│   │   │   └── F tokens.css              # variáveis de estilo compartilhadas
│   │   └── D img/                         # imagens usadas nas páginas
│   │       ├── P ap.png
│   │       ├── P face.png
│   │       ├── P g.png
│   │       ├── P ilustracao-dor.png
│   │       ├── P logo_icone.png
│   │       ├── P logo_texto.png
│   │       └── P logo-removebg-preview.png
│   └── D views/                           # uma pasta por tela (cada pasta vira uma URL)
│       ├── D 404/                         # página de erro para URLs inexistentes
│       │   ├── F index.html
│       │   └── F style.css
│       ├── D cadastro/
│       │   ├── F index.html
│       │   ├── F script.js
│       │   └── F style.css
│       ├── D dados-complementares/
│       │   ├── F index.html
│       │   ├── F script.js
│       │   └── F style.css
│       ├── D landing-page/
│       │   ├── F index.html
│       │   └── F style.css
│       └── D login-paciente/
│           ├── F index.html
│           ├── F script.js
│           └── F style.css
├── D src/                                 # servidor Node.js + Express
│   ├── D config/
│   │   ├── F env.js                       # variáveis de ambiente
│   │   └── F paths.js                     # caminhos das pastas public/
│   ├── D middlewares/
│   │   ├── F error.middleware.js          # tratamento de erros (500)
│   │   └── F not-found.middleware.js      # resposta 404 (página ou JSON)
│   ├── D routes/
│   │   ├── F index.js                     # junta os routers (API e páginas)
│   │   └── F pages.routes.js              # serve public/views como páginas
│   ├── F app.js                           # configuração do Express
│   └── F server.js                        # inicia o servidor
├── F .env.example                         # modelo das variáveis de ambiente
├── F .gitignore                           # arquivos ignorados pelo Git
├── F CHANGELOG.md                         # histórico de mudanças do projeto
├── F CONTRIBUTING.md                      # guia de contribuição
├── F LICENSE                              # licença proprietária
├── F package.json                         # scripts e dependências
├── F pnpm-lock.yaml                       # versões exatas das dependências
├── F README.md                            # apresentação do projeto
└── F todo.md                              # tarefas pendentes (não versionado)
```
_gerado por [erdtree](https://github.com/solidiquis/erdtree) e atualizado à mão_


## Gestão do projeto

O acompanhamento das tarefas, a documentação funcional e os protótipos estão distribuídos entre as seguintes fontes:

- [Jira](https://aluno-team-zylgcwkh.atlassian.net/jira/software/projects/FIB/summary): backlog, tarefas, bugs e acompanhamento da implementação;
- [Confluence](https://aluno-team-zylgcwkh.atlassian.net/wiki/spaces/F/overview): requisitos e documentação funcional;
- [Figma](https://www.figma.com/files/team/1635721117049360128/all-folders?fuid=1635749553250315535): protótipos e referências de interface. 
