# Input — EXP-001 / 2026-08-14-002

## Experimento

`EXP-001 — Reserva de turno`

## Rol principal

`Executor`

Revisión posterior autorizada: `Critic`.

## Commit base

`fc2c8493d1a677a3c99153d6544f8a789098d3de`

## Contrato y finding

- Contrato: `agentops/contracts/EXP-001-reserva-turno.md`.
- Finding: `EXP-001-F01 — Reserva acepta una hora fuera de las franjas válidas`.
- Estado inicial: `Hypothesis — Confirmed by static inspection — Requires executable evidence`.

## Objetivo exacto

Convertir `EXP-001-F01` en evidencia ejecutable sin corregir todavía el defecto, siguiendo:

`extracción mínima de comportamiento existente → test adversarial → FAIL esperado → evidencia → detenerse`.

## Caso adversarial

- Fecha: lunes `2026-08-17`.
- Días habilitados: lunes a sábado.
- Apertura: `10:00`.
- Cierre: `19:00`.
- Duración: `30` minutos.
- Capacidad: `3`.
- Sin turnos existentes.
- Nombre válido.
- Hora: `03:00`.
- Slot: `1`.
- Resultado contractual esperado: inválido.

## Restricciones

- No agregar validación de pertenencia de hora a las franjas.
- No corregir `EXP-001-F01`.
- No modificar reglas fuera del contrato.
- Instalar únicamente Vitest.
- No agregar jsdom, Testing Library, Playwright ni Cypress.
- No hacer refactor amplio, commit o push.
- No iniciar Fase 4.
