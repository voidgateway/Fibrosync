# Changelog

Todas as alterações relevantes do Fibrosync serão registradas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/en/2.0.0/) e o projeto adota o [Versionamento Semântico](https://semver.org/).

## [Não publicado]

### Adicionado

- Estrutura inicial de governança e documentação do projeto.
- Landing page, tela de cadastro (1 e 2) e tela de login.
- Base de roteamento e html da tela de cadastro de paciente.
- Servidor Node.js com Express servindo as páginas de `public/views` ([FIB-74](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-74)).
- Página de erro 404 para endereços inexistentes ([FIB-74](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-74)).
- CI com GitHub Actions: cada Pull Request instala as dependências e roda um smoke test das páginas ([FIB-74](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-74)).

### Alterado

- Dependências passam a ser gerenciadas com pnpm ([FIB-74](https://aluno-team-zylgcwkh.atlassian.net/browse/FIB-74)).
