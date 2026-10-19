---
sidebar_position: 5
title: "Recursos"
description: "Esta página descreve cada recurso integrado conforme sua implementação real."
---

# Recursos

Esta página descreve cada recurso integrado conforme sua implementação real.

## Renderização incremental

A prévia usa renderização incremental por blocos para manter a resposta rápida em documentos grandes:

- **Divisão em blocos** (`splitIntoBlocks`): o texto é dividido nos títulos ATX (`#` a `######`). Conteúdo dentro de blocos de código delimitados por crases ou tils não é usado como ponto de divisão; títulos em contêineres `:::` também são preservados. Documentos sem títulos formam um único bloco.
- **Renderização por bloco:** apenas blocos cujo hash mudou passam novamente por markdown-it / KaTeX. Os demais reutilizam diretamente seus nós DOM, incluindo SVGs de mapas mentais já inicializados.
- **Cache por hash do conteúdo:** os resultados são armazenados por um hash rápido do tipo djb2 combinado com o comprimento. Desfazer, refazer e colar parágrafos idênticos também podem reutilizar o cache. Acima de 800 entradas, são removidos hashes que não aparecem mais no documento atual. Os blocos atuais são mantidos; portanto, documentos com mais de 800 blocos distintos podem ultrapassar esse limite de referência.
- **Reordenação:** nós existentes são adicionados a um `DocumentFragment` e movidos nativamente pelo navegador.
- **Debounce adaptativo** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`): a espera é `base + floor(docLength / 20000) * 60`, limitada a `max`. Use `renderDebounce` para substituí-la ou `renderDebounce: false` para renderizar de forma síncrona.
- **`content-visibility: auto`:** cada bloco é envolvido por um elemento `.md-editor-block`, permitindo pular o layout e a pintura de blocos fora da tela.

Uma falha em um bloco não apaga toda a prévia: o texto-fonte desse bloco é exibido com escape em um `<pre>`.

## Fórmulas KaTeX

O plugin matemático independente de markdown-it usa KaTeX, sem depender de `markdown-it-texmath`:

- **Fórmulas em linha:** `$E=mc^2$`. O conteúdo não pode estar vazio nem conter `$` ou quebras de linha. Valores monetários como `$5` e `$10.50` são excluídos por heurísticas.
- **Fórmulas em bloco:**
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  São aceitas formas de uma linha (`$$ ... $$`) ou várias linhas. O CSS do KaTeX está incluído no pacote. Desative com `math: false`.

## Mapas mentais Markmap

Escreva um bloco delimitado ```` ```mindmap ```` cujo conteúdo seja uma estrutura de tópicos Markdown:

````markdown
```mindmap
# Root topic
## Branch one
- Child A
- Child B
## Branch two
- Child C
```
````

A regra acompanha a profundidade dos delimitadores para preservar blocos de código aninhados no mapa mental. A etapa síncrona gera um `<div>` provisório; `Renderer.hydrate(container)` importa `markmap-lib` e `markmap-view` de forma assíncrona e transforma os espaços reservados em SVGs interativos. Falhas de inicialização não são fatais. Desative com `mindmap: false`.

## Realce de código com botão de cópia

Os blocos de código são realçados com highlight.js. A distribuição registra JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C e C++, com aliases como `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs` e `c++`. Linguagens desconhecidas são detectadas automaticamente; se a detecção falhar, é exibido texto simples com escape.

Cada bloco recebe um contêiner no estilo do macOS com três pontos coloridos, rótulo da linguagem e botão **Copiar**. A cópia usa delegação de eventos no painel de prévia e recorre a `document.execCommand('copy')` quando a API Clipboard não está disponível. Desative com `codeHighlight: false`.

## Ações da barra de ferramentas {#toolbar-actions}

No modo `complex`, a barra contém estas 22 ações na ordem indicada:

| # | Nome da ação | Função |
|---|-------------|---------------|
| 1 | `heading` | Título |
| 2 | `bold` | Negrito (Ctrl+B) |
| 3 | `italic` | Itálico (Ctrl+I) |
| 4 | `link` | Link (Ctrl+K) |
| 5 | `image` | Inserir imagem |
| 6 | `video` | Inserir vídeo |
| 7 | `youtube` | Inserir vídeo do YouTube |
| 8 | `quote` | Citação |
| 9 | `ul` | Lista não ordenada |
| 10 | `ol` | Lista numerada |
| 11 | `tasklist` | Lista de tarefas |
| 12 | `mention` | Menção (@) |
| 13 | `doclink` | Inserir link para documento |
| 14 | `code` | Bloco de código |
| 15 | `table` | Tabela |
| 16 | `math` | Fórmula matemática |
| 17 | `mindmap` | Inserir mapa mental |
| 18 | `hr` | Linha horizontal |
| 19 | `tips` | Inserir aviso |
| 20 | `preview` | Alternar prévia |
| 21 | `help` | Atalhos de teclado |
| 22 | `theme` | Alternar tema |

Os rótulos integrados estão em inglês. Substitua `label` em cada item para traduzir dicas e nomes acessíveis. Várias ações abrem diálogos ou seletores: imagem, vídeo, YouTube, tabela, modelos de fórmulas e mapas mentais, tipos de aviso e ajuda. Configure a barra com `toolbar`, como descrito em [Configuração](./configuration.md#toolbarconfig).

## Atalhos de teclado

Os atalhos integrados são definidos em `DEFAULT_SHORTCUTS`. `Mod` corresponde a Ctrl no Windows/Linux e a Cmd no macOS.

| Tecla | Ação | Descrição |
|-----|--------|-------------|
| `Mod-b` | `bold` | Negrito |
| `Mod-i` | `italic` | Itálico |
| `Mod-Alt-1` | `heading` | Título |
| `Mod-k` | `link` | Inserir link |
| `Mod-Alt-c` | `code` | Bloco de código |
| `Mod-Shift-.` | `quote` | Bloco de citação |
| `Mod-Shift-8` | `ul` | Lista não ordenada |
| `Mod-Shift-7` | `ol` | Lista numerada |
| `Mod-Shift-9` | `tasklist` | Lista de tarefas |
| `Mod-Alt-m` | `math` | Fórmula matemática |
| `Mod-Alt-p` | `preview` | Alternar prévia |
| `Mod-Shift-l` | `theme` | Alternar tema |

O botão **Ajuda** abre um diálogo com os atalhos apresentados como teclas e uma referência rápida de tarefas, menções, links, fórmulas, mapas mentais e avisos.

## Envio de imagens

Forneça `onImageUpload: (file: File) => Promise<string>`. O hook é chamado ao colar ou arrastar um arquivo de imagem para o editor. O diálogo de imagem aceita uma URL e não oferece seleção de arquivos. Retorne a URL pública da imagem; o editor insere `![alt](url)` no cursor e usa o nome do arquivo sem extensão como texto alternativo. Falhas são capturadas sem exibir erro; o usuário pode tentar novamente.

## @menções

Passe a opção `mention` para ativar uma lista pesquisável ao digitar `@`:

- `onMentionSearch(query)` retorna os `MentionItem` correspondentes.
- `onMentionSelect(item)` retorna o texto a inserir. O padrão é `[@label](mention:id)`, exibido como etiqueta na prévia.
- `minChars` (padrão `0`) e `maxItems` (padrão `8`) ajustam a lista.

A lista aceita setas para cima/baixo, Enter/Tab e Escape, e fecha quando o editor perde o foco. Na prévia, texto comum com `@`, como `@media`, não vira etiqueta; apenas links com o esquema `mention:` são convertidos. No editor, esse texto ainda pode acionar um hook de busca configurado.

## Links para documentos

Passe a opção `docLink` para ativar a busca de documentos após o caractere de acionamento, `/` por padrão:

- `onDocSearch(query)` retorna os `DocItem` correspondentes.
- `onFetchDocMeta(url)` busca título, miniatura e descrição. A implementação integrada usa `fetch` e `DOMParser` para ler tags Open Graph; pode falhar quando o servidor de outra origem não permite CORS. Use um proxy de backend personalizado quando necessário.
- `insertStyle` controla o formato: `'auto'` (cartão quando há metadados), `'card'` ou `'link'`.

O documento selecionado é inserido como link simples ou cartão clicável `:::doc-link` com título, miniatura, descrição e nome do host.

## Blocos de aviso

Escreva um contêiner `:::` com um dos seis tipos. Um título opcional pode aparecer após o tipo na linha de abertura:

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Tipos aceitos: `notice`, `info`, `tip`, `success`, `warning`, `danger`. Cada bloco tem ícone, borda esquerda colorida e cabeçalho. O botão de avisos abre um seletor visual dos seis tipos. Desative com `tips: false`.

## Listas de tarefas

Itens que correspondem a `- [ ]` ou `- [x]`, com espaços opcionais dentro dos colchetes, viram caixas de seleção desabilitadas. Observe a convenção do projeto: **`- [ ]` aparece marcado em verde e `- [x]` aparece desmarcado**, ao contrário de GitHub Flavored Markdown. O botão de tarefas alterna os marcadores da linha atual ou das linhas selecionadas.

## Próximos passos

- [Configuração](./configuration.md) — ajuste esses recursos pelas opções.
- [Referência da API](./api-reference.md) — controle o editor por código.
