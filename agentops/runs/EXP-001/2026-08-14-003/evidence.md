# Evidence — EXP-001 / 2026-08-14-003

## Identificación

- Experimento: `EXP-001`.
- Run: `2026-08-14-003`.
- Commit base versionado: `fc2c8493d1a677a3c99153d6544f8a789098d3de`.
- Finding: `EXP-001-F01`.
- Contrato: `agentops/contracts/EXP-001-reserva-turno.md`.

## Antes

Comando: `npm test`

```text
Test Files  1 failed (1)
     Tests  1 failed | 4 passed (5)

AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true
```

Exit code: `1`.

El FAIL previo fue reproducido al inicio de esta ejecución antes de aplicar la corrección.

## Regla agregada

La hora solicitada debe estar incluida en:

```text
generateTimeSlots(
  settings.openingTime,
  settings.closingTime,
  settings.slotDurationMinutes
)
```

Cuando no pertenece, la función devuelve un resultado inválido con reason `invalid-time`.

## Archivos de la corrección

- `src/domain/reservations.ts` — regla de membresía horaria.
- `src/pages/AppointmentFormPage.tsx` — mensaje para el reason `invalid-time`.

El archivo `src/domain/reservations.test.ts` conserva sin cambios el test adversarial que produjo el FAIL de Fase 3.

## Después

Comando: `npm test`

```text
Test Files  1 passed (1)
     Tests  5 passed (5)
  Duration  378ms (transform 60ms, setup 0ms, import 174ms, tests 6ms, environment 0ms)
```

- Total: `5`.
- Pasan: `5`.
- Fallan: `0`.
- Exit code: `0`.

El mismo test `EXP-001-F01 — validación adversarial` ahora pasa.

## Build

Comando: `npm run build`

```text
vite v8.2.0 building client environment for production...
transforming...✓ 1806 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.54 kB │ gzip:  0.32 kB
dist/assets/index-CRAnuFI2.css   10.32 kB │ gzip:  3.00 kB
dist/assets/index-DUz2FPmI.js   252.09 kB │ gzip: 80.42 kB
✓ built in 934ms
```

Exit code: `0`.

## Relación con el contrato

- Criterio 2: `03:00`, anterior a apertura, ahora se rechaza.
- Criterio 4: la hora debe pertenecer a una franja generada.
- Criterio 10: la regla continúa siendo verificable sin renderizar React.

## Conclusión del Critic

- Se utiliza la configuración vigente.
- No existen horarios hardcodeados en la corrección.
- El test adversarial no fue modificado.
- Los tests de caracterización continúan pasando.
- El build es exitoso.
- El diff funcional está limitado a `EXP-001-F01`.

Estado final de esta ejecución:

`EXP-001-F01: Verified fixed`.

Historia completa:

`Hypothesis → Confirmed by static inspection → Demonstrated → Fixed → Verified`.
