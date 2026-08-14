# Plan — EXP-001 / 2026-08-14-003

1. Reproducir el FAIL de Fase 3 sin modificar código ni test.
2. Importar la fuente existente `generateTimeSlots` dentro de la validación pura.
3. Rechazar una solicitud cuyo `time` no pertenezca a las franjas configuradas.
4. Agregar un reason pequeño y explícito para hora inválida.
5. Mantener intacto el test adversarial original.
6. Ejecutar `npm test` y registrar el resultado real.
7. Ejecutar `npm run build` y registrar el resultado real.
8. Revisar el diff como Critic exclusivamente respecto de `EXP-001-F01`.
9. Documentar la evidencia y detenerse sin commit ni push.

## Archivos autorizados para la corrección

- `src/domain/reservations.ts`
- `src/pages/AppointmentFormPage.tsx`
- `agentops/runs/EXP-001/2026-08-14-003/**`

El resto de los cambios de Fase 3 se conserva sin alteración funcional adicional.
