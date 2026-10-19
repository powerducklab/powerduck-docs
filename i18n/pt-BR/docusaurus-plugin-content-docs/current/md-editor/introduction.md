---
sidebar_position: 1
title: "Introdução"
description: "@powerduck/md-editor é um editor Markdown de alto desempenho, incorporável ao navegador. Ele combina a edição com CodeMirror 6 e uma prévia em tempo real renderizada por markdown-it, com fórmulas KaTeX, mapas mentais Markmap, realce de código, avisos, barra de ferramentas configurável, atalhos de teclado, hooks de envio de imagens, @menções e inserção de links para documentos."
---

# Introdução

`@powerduck/md-editor` é um editor Markdown de alto desempenho, incorporável ao navegador. Ele combina a edição com [CodeMirror 6](https://codemirror.net) e uma prévia em tempo real renderizada por [markdown-it](https://github.com/markdown-it/markdown-it), com fórmulas KaTeX, mapas mentais Markmap, realce de código, avisos, barra de ferramentas configurável, atalhos de teclado, hooks de envio de imagens, @menções e inserção de links para documentos.

- **Nome do pacote:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **Licença:** MIT
- **Formato do módulo:** módulo ECMAScript (`type: "module"`), com builds ESM (`dist/index.mjs`) e CJS (`dist/index.cjs`) e declarações de tipos incluídas (`dist/index.d.ts`).

## Recursos principais

Os recursos abaixo correspondem aos módulos implementados no código-fonte:

- **Edição Markdown** com CodeMirror 6, realce de sintaxe Markdown e temas de realce claro e escuro.
- **Fórmulas KaTeX** por um plugin independente de markdown-it: em linha com `$...$` e em bloco com `$$...$$`. Heurísticas evitam interpretar valores monetários como `$5` como fórmulas.
- **Mapas mentais Markmap** renderizados a partir de blocos delimitados ```` ```mindmap ````. markmap-lib e markmap-view são importados dinamicamente, sem aumentar o bundle inicial quando não há mapas mentais.
- **Realce de código** com highlight.js, cabeçalho com três indicadores coloridos no estilo do macOS, rótulo do idioma e botão para copiar com um clique.
- **Blocos de aviso** (`:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`) com ícones e cores correspondentes.
- **Prévia no estilo do GitHub** com `github-markdown-css`.
- **Barra de ferramentas completa** com 22 ações, diálogos para inserir imagens, vídeos, vídeos do YouTube e tabelas, seletores de modelos de fórmulas e mapas mentais, além de uma ajuda com todos os atalhos.
- **Atalhos de teclado** com `Mod`, equivalente a Ctrl no Windows/Linux e a Cmd no macOS.
- **Barra de ferramentas configurável** por um array de itens a incluir ou configurações individuais (`show`, `label`, `icon`).
- **Hook de envio de imagens** (`onImageUpload`) acionado ao colar ou arrastar uma imagem para o editor.
- **Lista suspensa de @menções** configurada pelas opções `mention`; as menções selecionadas aparecem como etiquetas estilizadas na prévia.
- **Inserção de links para documentos** configurada por `docLink`: links simples ou cartões de prévia `:::doc-link`. Os metadados são obtidos pelo carregador integrado ou por um hook personalizado; requisições entre origens seguem as regras CORS do navegador.
- **Renderização de vídeo:** a sintaxe de imagem com URL terminada em `.mp4`, `.webm`, `.ogg` ou outra extensão reconhecida gera um elemento `<video controls>`.
- **Renderizador independente** (`renderMarkdown(source, options)`) que gera HTML com os mesmos plugins e estilos da prévia, sem montar um editor.
- **Renderização incremental por blocos:** o texto-fonte é dividido nos títulos ATX e apenas os blocos alterados são renderizados novamente. Os demais reutilizam seus nós DOM, incluindo SVGs de mapas mentais já inicializados. Os resultados são armazenados em cache pelo hash do conteúdo.
- **Debounce adaptativo:** o atraso de renderização da prévia varia com o tamanho do documento, de 120 ms até 600 ms.
- **Dois modos de edição:** `simple` (edição e prévia sem barra de ferramentas) e `complex` (barra de ferramentas e barra de status), alternáveis durante a execução.
- **Dois temas:** `light` e `dark`, aplicados com o atributo `data-theme` e propriedades CSS personalizadas.

## Visão geral da arquitetura

A biblioteca oferece duas interfaces:

1. **Classe JavaScript nativa** — a API principal gira em torno de `MarkdownEditor`, instanciada com um elemento contêiner. Ela combina `CodeEditor` (encapsulamento de CodeMirror), `Renderer` (encapsulamento de markdown-it), `IncrementalRenderer` para a prévia e, no modo `complex`, `Toolbar` e `StatusBar`. Diálogos, o controlador de @menções e o de links para documentos são módulos montados sob demanda.

2. **Exportação React por subcaminho** — `MarkdownEditorReact` é um componente `forwardRef` exportado de `./react`. Ele encapsula uma instância nativa de `MarkdownEditor`, aceita uso controlado e não controlado de `value` e expõe um `MarkdownEditorHandle` imperativo via ref. A entrada React é separada para que projetos sem React não precisem instalar `react` e `react-dom`.

A renderização tem uma etapa síncrona de markdown-it, que gera espaços reservados em HTML para mapas mentais, seguida de inicialização assíncrona com `Renderer.hydrate`, que os transforma em diagramas SVG interativos. `renderMarkdown` retorna o HTML síncrono; para gerar os SVGs, use `Renderer.render`, insira o HTML no DOM e depois chame `Renderer.hydrate`. O renderizador incremental atua diretamente no contêiner da prévia.

## Compatibilidade com navegadores

A biblioteca é voltada a navegadores modernos com DOM. CodeMirror 6, KaTeX e markmap-view são dependências do pacote, não recursos do navegador; mapas mentais interativos usam `ResizeObserver`. A API Clipboard é usada quando disponível. Se `navigator.clipboard` não estiver disponível, por exemplo fora de HTTPS, a cópia de blocos de código recorre a `document.execCommand('copy')`. O módulo de mapas mentais instala uma implementação vazia de `ResizeObserver` apenas quando o objeto global não existe, evitando um erro na importação; ela não fornece notificações reais de redimensionamento.

## Licença

`@powerduck/md-editor` é distribuído sob a licença **MIT**.

## Próximos passos

- [Instalação](./installation.md) — instale o pacote e conheça os caminhos de importação.
- [Início rápido](./quickstart.md) — monte seu primeiro editor em JavaScript nativo ou React.
- [Configuração](./configuration.md) — todas as opções de `MarkdownEditorOptions`.
- [Recursos](./features.md) — conheça cada recurso integrado em detalhes.
- [Referência da API](./api-reference.md) — todas as classes, funções e tipos exportados.
- [Exemplos](./examples.md) — trechos completos e executáveis.
