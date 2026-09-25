---
sidebar_position: 2
title: Inicio rápido de Cloud
description: "Inicie sesión, añada una spec por archivo, Git o URL, elija las operaciones expuestas y abra los enlaces de documentación y MCP."
---

# Inicio rápido de Cloud

Este flujo lleva una spec desde su máquina a una página de documentación compartible y un endpoint MCP.

## 1. Iniciar sesión

En la página de inicio, continúe con **Google** o **GitHub**. Tras el handshake OAuth, Powerduck crea su sesión y le dirige a la consola. Se crea automáticamente una organización personal.

## 2. Añadir la spec

Desde el dashboard, añada una spec mediante una fuente soportada.

- **Archivo** — subir un archivo OpenAPI directamente.
- **Repositorio Git** — apuntar a un repositorio y elegir rama/ruta de archivo.
- **URL** — importar una spec desde una URL.

Los documentos OpenAPI 3.0/3.1 y Swagger existentes se actualizan, y las entradas cURL o Postman se convierten antes de guardar, con vista previa.

### Cómo funciona la subida directa

Los archivos grandes se suben directamente al almacenamiento de objetos, no a través de la API.

1. Crear el documento.
2. La app solicita una **URL de subida** con tipo de contenido y tamaño.
3. El archivo se sube directamente al almacenamiento mediante la URL prefirmada.
4. **Completar** la subida y registrar versión y SHA-256.

Así el servidor API queda fuera del camino de cargas grandes.

## 3. Elegir las operaciones expuestas

Una vez lista la spec, elija las operaciones a hacer públicas, activables individualmente; el documento original no cambia. Puede empezar con todas activas y restringir interfaces internas/admin.

## 4. Abrir los enlaces

Con el documento activo, el espacio del documento muestra las direcciones públicas.

- **Documentation** — documentación API renderizada en el visor público.
- **MCP** — endpoint MCP Streamable HTTP gestionado.
- Los datos originales de la spec también se sirven en una URL estable.

Por defecto la documentación está activa y solo protegida por contraseña. La disponibilidad de MCP y la clave de acceso se configuran por separado.

## 5. Proteger el acceso si hace falta

- Añadir **contraseña de visualización** y fecha de expiración opcional a la documentación.
- Generar una **clave de acceso MCP** para el endpoint.
- Pausar el documento para sacar ambos temporalmente de la red.

## 6. Repetir mediante versiones

Cuando cambie la API, suba el nuevo contenido como una nueva versión en vez de reemplazar la antigua. Los enlaces compartidos pueden seguir al documento actual o fijarse a una versión, para que no cambien bajo los lectores.

## Siguientes pasos

- [Documentos y versiones](/docs/cloud/documents-versions)
- [Operaciones expuestas](/docs/cloud/exposure)
- [Control de acceso](/docs/cloud/access-control)
- [Dominios personalizados](/docs/cloud/custom-domains)
