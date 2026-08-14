# Plan — EXP-001 / 2026-08-14-002

1. Verificar commit base, upstream, working tree limpio y build inicial.
2. Instalar únicamente Vitest y agregar el script `test`.
3. Extraer mecánicamente las guardas actuales a `validateReservationRequest`.
4. Integrar el formulario conservando mensajes, navegación y comportamiento.
5. Ejecutar build posterior a la extracción.
6. Crear cuatro tests de caracterización.
7. Crear el test adversarial de `EXP-001-F01` sin añadir la regla faltante.
8. Ejecutar `npm test` y conservar su resultado real.
9. Ejecutar `npm run build` y conservar su resultado real.
10. Revisar como Critic que el fallo sea contractual y no de infraestructura.
11. Registrar evidencia y detenerse sin corregir, hacer commit o push.

## Archivos autorizados

- `package.json`
- `package-lock.json`
- `src/domain/reservations.ts`
- `src/domain/reservations.test.ts`
- `src/pages/AppointmentFormPage.tsx`
- `agentops/runs/EXP-001/2026-08-14-002/**`
