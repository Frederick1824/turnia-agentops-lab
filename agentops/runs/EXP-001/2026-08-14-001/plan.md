# Plan del Critic — EXP-001 / 2026-08-14-001

## Propósito

Intentar refutar, por inspección estática acotada, que la creación de reservas cumple los criterios 2, 3 y 4 de `EXP-001`, y diseñar la evidencia ejecutable necesaria para la fase siguiente.

## Pasos

1. Fijar el commit inspeccionado y confirmar que el working tree parte limpio.
2. Trazar `date`, `time` y `slotPosition` desde URL/estado hasta `handleSubmit`.
3. Comparar las condiciones de `handleSubmit` con las franjas producidas por `generateTimeSlots`.
4. Trazar la entrada aceptada desde `handleSubmit` hasta `addAppointment`.
5. Aplicar las seis dimensiones adversariales dentro del alcance de `EXP-001`.
6. Formular `EXP-001-F01` sin elevarlo a defecto demostrado.
7. Definir Arrange, Act y Assert del test adversarial futuro.
8. Determinar la extracción mecánica mínima que permita obtener `FAIL antes de FIX` sin corregir accidentalmente el comportamiento.
9. Registrar evidencia disponible y pendiente.

## Archivos inspeccionados

- `agentops/contracts/EXP-001-reserva-turno.md`
- `agentops/agents/critic.md`
- `src/pages/AppointmentFormPage.tsx`
- `src/utils/schedule.ts`
- `src/context/AppContext.tsx`
- `src/types/index.ts`
- `src/utils/date.ts`

## Archivos autorizados para escritura

- `agentops/runs/EXP-001/2026-08-14-001/input.md`
- `agentops/runs/EXP-001/2026-08-14-001/plan.md`
- `agentops/runs/EXP-001/2026-08-14-001/critique.md`
- `agentops/runs/EXP-001/2026-08-14-001/evidence.md`

## Criterio de salida

El run termina si quedan respondidas las seis preguntas de cierre de Fase 2. No se ejecutan tests, no se implementa la extracción y no se inicia una corrección.
