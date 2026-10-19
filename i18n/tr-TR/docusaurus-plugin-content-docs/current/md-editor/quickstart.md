---
sidebar_position: 3
title: "Hızlı başlangıç"
description: "MarkdownEditor'ı yalın JavaScript ile bağlayın, React bileşenini kullanın veya renderMarkdown ile Markdown'ı bağımsız olarak işleyin."
---

# Hızlı başlangıç

`@powerduck/md-editor` üç şekilde kullanılabilir: yalın JavaScript düzenleyicisi, React bileşeni veya bağımsız Markdown işleyicisi olarak. Stil sayfasını uygulama başına bir kez içe aktarın.

## Yalın JavaScript

Kurucunun imzası `new MarkdownEditor(container, options?)` şeklindedir. İlk bağımsız değişken bir `HTMLElement` veya CSS seçicisi dizesidir.

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  value: '# Hello\n\nStart typing...',
  mode: 'complex', // 'simple' (default) | 'complex'
  theme: 'light',  // 'light' (default) | 'dark'
  math: true,
  mindmap: true,
  onChange: (value) => console.log(value),
});

// Read and write content
const markdown = editor.getValue();
editor.setValue('# Updated content');
```

Bağlanacak kapsayıcı bulunamazsa kurucu `MarkdownEditor: mount container not found` hatasını fırlatır.

## React

`MarkdownEditorReact` bileşenini `./react` alt yolundan içe aktarın. Bu `forwardRef` bileşeni hem kontrollü (`value`) hem de kontrolsüz (`defaultValue`) kullanımı destekler ve `ref` üzerinden komutla erişilebilen bir arayüz sunar.

```tsx
import { useRef, useState } from 'react';
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';

function App() {
  const [value, setValue] = useState('# Hello');
  const editorRef = useRef<MarkdownEditorHandle>(null);

  return (
    <MarkdownEditorReact
      ref={editorRef}
      value={value}
      onChange={setValue}
      mode="complex"
      theme="light"
    />
  );
}
```

Yapısal seçenekler (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) değiştiğinde iç örnek yeniden oluşturulur. `value`, `onChange` ve `theme` ise örneği yeniden oluşturmadan hafif bir eşitlemeyle güncellenir; böylece büyük belgelerde kontrollü kullanımın tepki süresi korunur.

## Bağımsız işleme

Düzenleyiciyi bağlamadan, önizlemedeki eklentiler ve stillerle Markdown'ı HTML'ye dönüştürmek için `renderMarkdown(source, options?)` kullanın.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` bir dize döndürür. Zihin haritası yer tutucuları kendiliğinden etkileşimli SVG diyagramlarına dönüşmez. Etkileşimli hâle getirme işlemi yalnızca çalışan düzenleyicinin önizlemesinde `Renderer.hydrate` aracılığıyla yapılır.

## Sonraki adımlar

- [Yapılandırma](/docs/tr-TR/md-editor/configuration/) — `MarkdownEditorOptions` içindeki tüm alanlar.
- [Özellikler](/docs/tr-TR/md-editor/features/) — Formüllerin, zihin haritalarının, araç çubuklarının ve kısayolların işleyişi.
- [API başvurusu](/docs/tr-TR/md-editor/api-reference/) — Herkese açık API'nin tamamı.
- [Örnekler](/docs/tr-TR/md-editor/examples/) — Kopyalanıp kullanılabilecek eksiksiz örnekler.
