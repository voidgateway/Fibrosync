<!-- esqueleto de arquivo, ainda tem que definir com o a prof como será a entrega de dados -->
# Design

// A definir

## Fonte principal

[Figma](https://www.figma.com/files/team/1635721117049360128/all-folders?fuid=1635749553250315535)

Documentos e tarefas relacionados a uma interface devem apontar para o arquivo, a página ou o frame do Figma.

## Artefatos

| Área ou fluxo | Figma | Jira | Implementação |
|---|---|---|---|
| — | A definir | — | — |

## Design system

| Elemento | Fonte | Implementação |
|---|---|---|
| Cores e gradientes | Figma | [`tokens.css`](../../public/assets/css/tokens.css) (design antigo) · [`fibrosync-tokens.css`](../../public/assets/css/fibrosync-tokens.css) (design novo) |
| Tipografia | Figma | [`tokens.css`](../../public/assets/css/tokens.css): Outfit, Urbanist e Inter |
| Espaçamento | A definir | A definir |
| Componentes | A definir | A definir |

As páginas existentes ainda definem cores próprias em seus `style.css`; a substituição pelas variáveis de `tokens.css` está pendente.

## Design novo (em transição)

O projeto está trocando para um design novo, uma página por vez. Cada página fica **inteira** no design antigo ou no novo, nunca misturada. Por isso uma página nova não carrega o `tokens.css` antigo, porque os dois arquivos têm variáveis com o mesmo nome e valores diferentes.

| Arquivo | O que é |
|---|---|
| [`css/fibrosync-tokens.css`](../../public/assets/css/fibrosync-tokens.css) | Tokens de cor (claro e escuro), tipografia, espaço, raio, sombra e movimento. **É uma cópia gerada: não edite à mão.** |
| [`css/base.css`](../../public/assets/css/base.css) | Reset, fundo e texto do tema, foco visível, `.icone`, `.marca-simbolo` e `.marca-nome` |
| [`js/tema.js`](../../public/assets/js/tema.js) | Claro, escuro ou seguir o sistema. Salva a escolha (`tema.escolher('escuro')`) |
| [`js/movimento.js`](../../public/assets/js/movimento.js) | Animações em JS que seguem os tokens e o "reduzir movimento" do sistema |
| [`icones/`](../../public/assets/icones/) | Ícones do produto em SVG (traço de 1,75, grade de 24) |
| [`marca/`](../../public/assets/marca/) | Símbolo, nome e favicon |
| [`css/componentes/`](../../public/assets/css/componentes/) | Um arquivo por componente: `botoes`, `campo`, `toggle`, `aviso` e `barra-lateral`. A página importa só os que usa, depois do `base.css`. O HTML de cada um está no comentário do topo do arquivo. |
| [`js/componentes/`](../../public/assets/js/componentes/) | O comportamento que precisa de JS: `campo.js` (erro ao sair do campo, mostrar a senha) e `aviso.js` (`aviso.mostrar('Registro salvo.')`, com "Desfazer" opcional) |

O `<head>` de uma página no design novo fica assim:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="../../assets/js/tema.js"></script>
<link rel="icon" href="../../assets/marca/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&family=Urbanist:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/css/fibrosync-tokens.css">
<link rel="stylesheet" href="../../assets/css/base.css">
<link rel="stylesheet" href="style.css">
<script src="../../assets/js/movimento.js" defer></script>
```

O `tema.js` vem antes dos CSS e sem `defer`, para a página não piscar no tema errado. O `<html>` não leva `data-theme` escrito à mão.

Regras para o `style.css` da página:
- Use só tokens (`var(--…)`) para cor, tamanho, espaço, raio, sombra e duração.
- Use a fonte Outfit para títulos e números, e a Urbanist para texto.
- Teste nos temas claro e escuro, só com o teclado, com "reduzir movimento" ligado e em 390 px de largura.
- Ícone: `<span class="icone" style="--icone: url(../../assets/icones/inicio.svg)" aria-hidden="true"></span>`. O ícone pega a cor do texto.

## Responsividade

<!-- Registrar breakpoints e comportamentos que afetem a implementação. -->

## Estados de interface

<!-- Registrar padrões para loading, vazio, erro, sucesso e indisponibilidade. -->

## Acessibilidade

Os critérios e decisões de acessibilidade estão documentados em [Acessibilidade](../accessibility/overview.md). (_quando for escolhido)
