---
sidebar_position: 15
title: "IA integrada y uso"
description: "Powerduck ayuda a entender cambios generados por IA, leer su contexto y decidir qué atender. La aplicación de escritorio permite abrir por separado el espacio API y la revisión de código desde Inicio."
---

# IA integrada y uso

Inicia sesión con Google o GitHub. Solo hay modelo integrado, sin selector, claves propias ni endpoints personalizados. El trabajo IA solicitado envía el contexto elegido a proveedores gestionados. Se excluyen rutas comunes de dependencias, compilación y credenciales, pero el código todavía puede contener secretos.

## Revisión IA en línea

La revisión IA empieza al solicitarla y procesa diferencias con contexto limitado por lotes, no todos los archivos completos. Puede reutilizar caché coincidente. Muestra prioridad, evidencia y recomendación junto al código. Confirma, marca falso positivo o selecciona para Agent. La IA puede equivocarse y no demuestra corrección ni pruebas ejecutadas.

## Planes y tareas

Un turno de conversación o revisión cuenta como tarea, sin cobrar cada llamada interna. Se reserva durante la ejecución: un resultado entregado consume una incluso si cancelas después; sin resultado válido se libera. Divide revisiones grandes. Lectura local, Git/AST y resultados guardados no consumen tareas. Suscripciones antiguas pueden mantener créditos; consulta tu cuenta.

- [Espacio API](introduction.md)
- [Revisión de código](code-quality.md)
- [IA integrada y uso](ai-models.md)
- [Planes y tareas](../cloud/billing.md)
- [Instalar y empezar](../overview/installation.md)
- [Entender cada cambio](../overview/quickstart.md)
