# Critique post-corrección — EXP-001 / 2026-08-14-003

## Rol

`Critic`

## Superficie revisada

- Diff de Fase 4 en `src/domain/reservations.ts`.
- Integración del reason en `src/pages/AppointmentFormPage.tsx`.
- Test adversarial original en `src/domain/reservations.test.ts`.
- Resultados de `npm test` y `npm run build`.

## Verificaciones

### 1. Uso de franjas configuradas

**Confirmado.** La validación invoca `generateTimeSlots` con `openingTime`, `closingTime` y `slotDurationMinutes` de `BusinessSettings`. La decisión se toma dentro de la función pura de dominio.

### 2. Ausencia de horarios hardcodeados

**Confirmado.** Producción no contiene una lista nueva de horas ni comparaciones fijas con `10:00`, `19:00` o `30`. Esos valores sólo existen en el fixture del test aprobado.

### 3. Integridad del test adversarial

**Confirmado.** El assert original permanece:

```ts
expect(result.valid).toBe(false)
```

No se cambió la hora `03:00`, la configuración ni el resultado esperado para obtener un PASS.

### 4. Tests de caracterización

**Confirmado.** Los cuatro tests previos continúan pasando junto con el adversarial: `5 passed (5)`.

### 5. Ausencia de correcciones incidentales

**Confirmado dentro del diff revisado.** El único cambio funcional es la nueva causa `invalid-time` y su consumo por la UI. No se tocaron persistencia, concurrencia, autenticación, backend, estados de turno, configuración general ni otros findings.

### 6. Cumplimiento de EXP-001

**Confirmado para EXP-001-F01.** La hora debe pertenecer exactamente a las franjas producidas por la configuración vigente. Esto cubre el caso demostrado de hora anterior a apertura y, por la misma regla de membresía, horas iguales al cierre o entre franjas.

No se agregaron tests independientes para esos dos límites porque no fueron necesarios para demostrar la corrección del finding seleccionado y el contrato de esta fase pidió evitar ampliaciones.

### 7. Consumo desde la UI

**Confirmado.** `AppointmentFormPage.handleSubmit` continúa invocando `validateReservationRequest`. El nuevo reason recibe un mensaje acotado sin modificar navegación ni flujo de guardado.

## Riesgos residuales dentro del alcance

- Los tests prueban directamente la función de dominio, no una interacción renderizada del `<select>`. Esto es intencional y cumple el criterio de independencia de React.
- La suite actual cubre explícitamente una hora válida y la hora adversarial `03:00`; la regla implementada es general por pertenencia a las franjas generadas.

## Conclusión

El fallo anterior fue corregido mediante la fuente de verdad existente, el test original pasó sin ser debilitado, los tests de caracterización permanecieron verdes y el build pasó.

`EXP-001-F01: Verified fixed`.

Historia de estado:

`Hypothesis → Confirmed by static inspection → Demonstrated → Fixed → Verified`.
