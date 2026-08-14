# Input — EXP-001 / 2026-08-14-003

## Experimento

`EXP-001 — Reserva de turno`

## Rol principal

`Executor`

Revisión posterior autorizada: `Critic`.

## Base de esta ejecución

- HEAD versionado: `fc2c8493d1a677a3c99153d6544f8a789098d3de`.
- Working tree aprobado: cambios no commiteados correspondientes exclusivamente a Fase 3.
- Finding: `EXP-001-F01 — Reserva acepta una hora fuera de las franjas válidas`.
- Estado inicial del finding en esta fase: `Demonstrated`.

## Objetivo

Corregir únicamente `EXP-001-F01` y demostrar que el mismo test adversarial que produjo el FAIL pasa después de la corrección.

## Corrección autorizada

Una reserva debe ser inválida cuando `request.time` no pertenece a las franjas generadas por `openingTime`, `closingTime` y `slotDurationMinutes` de la configuración vigente.

## Restricciones

- Reutilizar `generateTimeSlots`.
- No cambiar el assert adversarial.
- Conservar los cuatro tests de caracterización.
- No modificar runs históricos.
- No corregir otros findings.
- No añadir dependencias, refactors generales o infraestructura.
- No ejecutar `npm audit fix`.
- No hacer commit ni push.
- No iniciar Fase 5.
