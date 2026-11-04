---
sidebar_position: 1
title: "Espacio API · Revisión de código"
description: "Powerduck ayuda a entender cambios generados por IA, leer su contexto y decidir qué atender. La aplicación de escritorio permite abrir por separado el espacio API y la revisión de código desde Inicio."
---

# Espacio API · Revisión de código

Powerduck ayuda a entender cambios generados por IA, leer su contexto y decidir qué atender. La aplicación de escritorio permite abrir por separado el espacio API y la revisión de código desde Inicio.

## Espacio API

Importa OpenAPI YAML o JSON para diseñar operaciones, enviar solicitudes, inspeccionar respuestas y usar escenarios, mocks locales, modelos de datos y documentación. MCP y publicación son procesos separados. Importar no despliega tu backend.

## Revisión de código

Al elegir una carpeta se abre la estructura. Lee archivos completos y cambia entre solo fuente, comparación completa y solo cambios. Las líneas añadidas/eliminadas, diferencias de caracteres, navegación y búsqueda ayudan a localizar la edición.

## Estructura y código relacionado

Git y los analizadores identifican bloques y definiciones, llamadas e importaciones resolubles. Pasa el cursor por símbolos compatibles para ver definiciones; abre código relacionado junto al cambio. La estructura señala muchas referencias, nombres temporales, contenido idéntico o referencias entrantes no resueltas. Cargas dinámicas y usos externos pueden faltar; no tener referencias no implica poder borrar.

## IA integrada y uso

Inicia sesión con Google o GitHub. Solo hay modelo integrado, sin selector, claves propias ni endpoints personalizados. El trabajo IA solicitado envía el contexto elegido a proveedores gestionados. Se excluyen rutas comunes de dependencias, compilación y credenciales, pero el código todavía puede contener secretos.

- [Espacio API](introduction.md)
- [Revisión de código](code-quality.md)
- [IA integrada y uso](ai-models.md)
- [Planes y tareas](../cloud/billing.md)
- [Instalar y empezar](../overview/installation.md)
- [Entender cada cambio](../overview/quickstart.md)
