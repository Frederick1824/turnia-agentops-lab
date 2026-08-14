# Input — EXP-001 / 2026-08-14-001

## Experimento

`EXP-001 — Reserva de turno`

## Rol ejecutado

`Critic`

## Commit inspeccionado

`56a90ca7ca3d83c465c70a3d5d5ec0e8edb5e803`

Baseline de producto contenido en su historia:

`1dcdb162967a3c951a1f5b289266efe956e9bf0a`

## Contrato utilizado

`agentops/contracts/EXP-001-reserva-turno.md`

## Objetivo exacto

> Determinar si la implementación actual permite crear o aceptar una reserva cuya hora no pertenece a ninguna franja válida generada por la configuración del negocio.

## Caso inicial exacto

- Día habilitado.
- Apertura: `10:00`.
- Cierre: `19:00`.
- Duración: `30`.
- Capacidad: `3`.
- Hora solicitada: `03:00`.
- Slot solicitado: `1`.
- Resultado esperado según contrato: rechazo.

## Alcance autorizado

- Formulario de creación/reprogramación.
- Generación de franjas.
- Cálculo de disponibilidad necesario para crear una reserva.
- Operación `addAppointment`.
- Tipos y utilitarios directamente relacionados.
- Aplicación de `ASSUMPTIONS`, `BOUNDARIES`, `TRUST`, `DEPENDENCIES`, `TIME / ORDER` y `THREATS` exclusivamente a `EXP-001`.
- Formulación de `EXP-001-F01` y diseño, sin implementación, del test adversarial mínimo.

## Restricciones exactas de esta ejecución

- No modificar `src/**`.
- No modificar `package.json` ni el contrato aprobado.
- No instalar Vitest ni otras dependencias.
- No crear tests ejecutables.
- No corregir validaciones o defectos.
- No cambiar componentes.
- No crear agentes.
- No analizar otros findings.
- No iniciar Fase 3.
- Modificar únicamente `agentops/runs/EXP-001/2026-08-14-001/**`.

## Fuera de alcance

- Configuración general ajena al caso.
- Concurrencia y sincronización entre pestañas.
- Corrupción general de `localStorage`.
- Autenticación.
- Seguridad de backend.
- Otros findings identificados previamente.

## Condición epistemológica

La inspección puede justificar una hipótesis concreta y un recorrido estático del dato. En esta fase no se permite declarar un defecto como `Demonstrated`, ni registrar PASS o FAIL, porque no se ejecutará evidencia adversarial.
