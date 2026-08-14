# Evidence — EXP-001 / 2026-08-14-002

## Trazabilidad

- Experimento: `EXP-001`.
- Run: `2026-08-14-002`.
- Commit base: `fc2c8493d1a677a3c99153d6544f8a789098d3de`.
- Contrato: `agentops/contracts/EXP-001-reserva-turno.md`.
- Finding: `EXP-001-F01`.
- Estado inicial: `Hypothesis — Confirmed by static inspection — Requires executable evidence`.
- Estado posterior: `Demonstrated`.

## Test adversarial

Archivo: `src/domain/reservations.test.ts`.

Caso: `EXP-001-F01 — validación adversarial > rechaza una hora que no pertenece a las franjas configuradas`.

Assert contractual:

```ts
expect(result.valid).toBe(false)
```

## Output real de `npm test`

```text
> turnia-barber@0.1.0 test
> vitest run

RUN  v4.1.10 C:/Users/PC/Documents/TurnIA Barber

❯ src/domain/reservations.test.ts (5 tests | 1 failed) 11ms
    × rechaza una hora que no pertenece a las franjas configuradas 6ms

Test Files  1 failed (1)
     Tests  1 failed | 4 passed (5)
  Duration  997ms (transform 45ms, setup 0ms, import 178ms, tests 11ms, environment 0ms)

FAIL  src/domain/reservations.test.ts > EXP-001-F01 — validación adversarial > rechaza una hora que no pertenece a las franjas configuradas
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

❯ src/domain/reservations.test.ts:68:26
    66|     const result = validate({ ...validRequest, time: '03:00' })
    67|
    68|     expect(result.valid).toBe(false)
      |                          ^
```

Exit code: `1`.

## Interpretación

- Resultado contractual esperado: inválido (`false`).
- Resultado observado: válido (`true`).
- El test falló exactamente por la discrepancia prevista en `EXP-001-F01`.
- Cuatro tests de caracterización pasaron en la misma ejecución.
- No se modificó el test ni producción después del fallo.

## Output real del build final

```text
> turnia-barber@0.1.0 build
> tsc --noEmit -p tsconfig.app.json && vite build

vite v8.2.0 building client environment for production...
transforming...✓ 1806 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.54 kB │ gzip:  0.33 kB
dist/assets/index-CRAnuFI2.css   10.32 kB │ gzip:  3.00 kB
dist/assets/index-Bt09D3O6.js   251.91 kB │ gzip: 80.39 kB
✓ built in 611ms
```

Exit code: `0`.

## Relación contractual

- Criterio 2 exige rechazar una hora anterior a apertura.
- Criterio 4 exige rechazar una hora que no corresponda a una franja generada.
- Criterio 10 exige testabilidad sin renderizar React.

El test demuestra que la función pura extraída permite `03:00`, en contradicción con los criterios 2 y 4, y lo hace sin montar React, cumpliendo el mecanismo requerido por el criterio 10.

## Evidencia de que no se aplicó el FIX

`src/domain/reservations.ts` no importa ni invoca `generateTimeSlots` y no contiene una comparación de pertenencia de `request.time` contra franjas válidas.

## Evidencia pendiente para el experimento completo

- Aprobación humana de esta evidencia.
- Commit de Fase 3, si se autoriza posteriormente.
- Corrección limitada al contrato en Fase 4.
- Evidencia PASS usando el mismo test.
- Tests de regresión posteriores a la corrección.
- Decisión humana de cierre.
