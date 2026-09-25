---
sidebar_position: 7
title: Facturación
description: "La nube es una suscripción mensual y el escritorio una licencia perpetua de compra única. Entienda planes y autorizaciones, la elección del proveedor de pago y el ciclo de vida de la suscripción."
---

# Facturación

Powerduck tiene dos modelos de compra separados que no se mezclan.

| | Cliente de escritorio | Powerduck Cloud |
|---|---|---|
| Compra | Única | Suscripción mensual |
| Recibe | Clave de licencia perpetua | Membresía hospedada |
| Caducidad | Ninguna | Renovación al final del período |
| Mostrado tras comprar | Clave una vez | Sin clave |

## Licencia de escritorio

El cliente de escritorio se vende como licencia perpetua de compra única.

- Al comprar, la clave se genera y se muestra **una vez**.
- La clave se guarda como hash SHA-256, por lo que la base no puede reconstruir el original, y solo quedan los últimos cuatro caracteres.
- Estados: `ISSUED`, `ACTIVE`, `SUSPENDED`, `REVOKED`. Perpetuo no significa imposible de revocar.
- La clave se vincula a una organización y la activación tiene límite de tasa.

Esto permanece totalmente separado de la suscripción de Cloud: comprar una suscripción de Cloud no genera una clave de licencia.

## Suscripción de Cloud

La nube es un servicio de hospedaje con suscripción mensual.

- **Pro** — 19 $/mes.
- **Team** — 49 $/mes.
- **Free** — 0 $, con límites.

La suscripción tiene períodos y se renueva al final del período actual.

### Planes y autorizaciones

Las capacidades se deciden mediante **autorizaciones**, no comparando códigos de plan.

| Autorización | Free | Pro | Team |
|---|---|---|---|
| Hospedaje de documentos | Sí | Sí | Sí |
| Fuente Git | No | Sí | Sí |
| Dominio personalizado | No | Sí | Sí |
| Máx. documentos | 3 | 20 | 100 |
| Máx. versiones/documento | 3 | 100 | 500 |
| Máx. operaciones expuestas | 10 | 1.000 | 10.000 |
| Máx. tamaño de subida | 1 MB | 10 MB | 50 MB |

## Proveedor de pago

La ruta de pago se elige por región.

- China continental, Hongkong, Sudeste Asiático — **Antom**.
- Europa/América, Japón, Corea — **Paddle**.
- Si falla la detección, respaldo con **Antom**.

Ambos proveedores no aparecen a la vez al pagar; Paddle queda como respaldo para cambio rápido en emergencia.

### Flujo de pago

1. Elegir plan e iniciar el pago.
2. Redirigir al proveedor.
3. Volver tras el pago: la página de retorno comprueba el estado del pedido.
4. Un webhook confirma el pago y activa la suscripción.

Los pedidos se tratan de forma **idempotente**, para que el mismo pago no se aplique dos veces.

## Ciclo de vida de la suscripción

- **Upgrade** — efecto inmediato; la diferencia prorrateada se calcula según el valor restante del período.
- **Downgrade** — efecto al final del período actual (señalado antes).
- **Cancelar** — caduca al final del período; la cancelación pasa por confirmaciones repetidas con alternativas.
- **Caducidad** — vuelta a los límites Free tras el final del período.

Cancelar no quita el acceso de inmediato; conserva el servicio hasta el final del período.

## Pedidos y membresía

La página de facturación separa ambos.

- **Membresía/suscripción** — plan actual, estado, fin del período, renovación.
- **Pedidos** — compras pasadas e historial de pago.

## Comprobación de autorización

Como cualquier recurso hospedado, los pagos y suscripciones pertenecen a una **Organización** y se consultan con ámbito de organización, por lo que un usuario con otro ID de organización no puede leer los pedidos de otro equipo.

Vea también: [Introducción a Cloud](./introduction)、[Dominios personalizados](./custom-domains).
