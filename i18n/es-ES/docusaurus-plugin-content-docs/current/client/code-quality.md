---
sidebar_position: 10
title: "Revisión de código"
description: "Powerduck ayuda a entender cambios generados por IA, leer su contexto y decidir qué atender. La aplicación de escritorio permite abrir por separado el espacio API y la revisión de código desde Inicio."
---

# Revisión de código

La revisión de código requiere la [aplicación de escritorio](https://www.powerduck.com/download.html). La página web ofrece un enlace de descarga; la selección de proyectos locales, la comparación de Git y la revisión no se ejecutan en el navegador.

Al elegir una carpeta se abre la estructura. Lee archivos completos y cambia entre solo fuente, comparación completa y solo cambios. Las líneas añadidas/eliminadas, diferencias de caracteres, navegación y búsqueda ayudan a localizar la edición.

## Comparación e historial de rondas

La ronda actual compara su punto inicial guardado con el disco. La primera apertura establece el inicio sin considerar todo nuevo. Los cambios sin confirmar se comparan con Git HEAD. Inicia nuevas rondas de forma explícita y consulta las anteriores en el historial local, que no sustituye Git. Guarda primero los archivos.

## Estructura y código relacionado

Git y los analizadores identifican bloques y definiciones, llamadas e importaciones resolubles. Pasa el cursor por símbolos compatibles para ver definiciones; abre código relacionado junto al cambio. La estructura señala muchas referencias, nombres temporales, contenido idéntico o referencias entrantes no resueltas. Cargas dinámicas y usos externos pueden faltar; no tener referencias no implica poder borrar.

## Revisión IA en línea

La revisión IA empieza al solicitarla y procesa diferencias con contexto limitado por lotes, no todos los archivos completos. Puede reutilizar caché coincidente. Muestra prioridad, evidencia y recomendación junto al código. Confirma, marca falso positivo o selecciona para Agent. La IA puede equivocarse y no demuestra corrección ni pruebas ejecutadas.

## Paquetes de tareas Agent

Selecciona dudas y previsualiza, copia o descarga Markdown con código y anclas de revisión. El Agent debe evaluar de forma independiente; el permiso para modificar es explícito. Su informe JSON requiere revisión humana. Afirmar una reparación no demuestra pruebas aprobadas. Exportar no inicia ni contacta automáticamente con otro Agent.

## Ejecutar comprobaciones

Ejecuta explícitamente comandos de proyectos fiables y revisa comando, salida y código de retorno. Sin script significa sin verificar. Leer, analizar o revisar con IA no es evidencia de ejecución; marcar leído solo registra progreso.

## IA integrada y uso

Inicia sesión con Google o GitHub. Solo hay modelo integrado, sin selector, claves propias ni endpoints personalizados. El trabajo IA solicitado envía el contexto elegido a proveedores gestionados. Se excluyen rutas comunes de dependencias, compilación y credenciales, pero el código todavía puede contener secretos.

- [Espacio API](introduction.md)
- [Revisión de código](code-quality.md)
- [IA integrada y uso](ai-models.md)
- [Planes y tareas](../cloud/billing.md)
- [Instalar y empezar](../overview/installation.md)
- [Entender cada cambio](../overview/quickstart.md)
