# Evidence de cierre — EXP-001 / 2026-08-14-004

## Estado de la cadena

`Hypothesis → Confirmed by static inspection → Demonstrated → Fixed → Verified`.

## Commits

- `1dcdb162967a3c951a1f5b289266efe956e9bf0a` — baseline.
- `56a90ca7ca3d83c465c70a3d5d5ec0e8edb5e803` — estructura AgentOps.
- `fc2c8493d1a677a3c99153d6544f8a789098d3de` — hipótesis Critic.
- `6a7b8d8de693129b6209e401c37981182a1a901c` — FAIL demostrado.
- `760b211f7f8db24f3a75c1aa763a8950b4423446` — FIX verificado.

## Evidencia anterior al FIX

```text
Test Files  1 failed (1)
Tests       1 failed | 4 passed (5)
AssertionError: expected true to be false
```

Exit code: `1`.

## Evidencia posterior al FIX ya versionada

```text
Test Files  1 passed (1)
Tests       5 passed (5)
```

Exit code: `0`.

Build: exitoso, exit code `0`.

## Métricas respaldadas

- Fases: 6, contando Fase 0 y el cierre actual.
- Runs: 4.
- Commits relevantes antes del cierre: 5.
- Tests antes/después: 5/5.
- Fallidos antes/después: 1/0.
- Findings demostrados: 1.
- Findings verificados como corregidos: 1.
- Dependencias directas nuevas: 1 (`vitest`).
- Paquetes agregados informados al instalar: 29.

## Cobertura contractual

Con test específico o directo:

- Criterio 1 a nivel de validación pura, no integración de creación.
- Criterio 2 mediante `03:00`.
- Criterio 4 mediante una hora no generada (`03:00`), sin caso aislado entre franjas.
- Criterio 7 mediante cupo confirmado ocupado.
- Criterio 10 mediante suite sin React.

Implementados o inspeccionados, pero sin test específico actual:

- Criterio 3: igual o posterior al cierre.
- Criterio 5: slot menor a 1.
- Criterio 6: slot superior a capacidad.
- Criterio 8: cancelado no bloquea.
- Criterio 9: creación con estado `pending`.

No corresponde declarar cobertura exhaustiva del contrato.

## Validación final de Fase 5

### `npm test`

```text
> turnia-barber@0.1.0 test
> vitest run

RUN  v4.1.10 C:/Users/PC/Documents/TurnIA Barber

Test Files  1 passed (1)
     Tests  5 passed (5)
  Duration  714ms (transform 127ms, setup 0ms, import 319ms, tests 15ms, environment 0ms)
```

- Total: `5`.
- Aprobados: `5`.
- Fallidos: `0`.
- Exit code: `0`.

### `npm run build`

```text
> turnia-barber@0.1.0 build
> tsc --noEmit -p tsconfig.app.json && vite build

vite v8.2.0 building client environment for production...
transforming...✓ 1806 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.54 kB │ gzip:  0.32 kB
dist/assets/index-CRAnuFI2.css   10.32 kB │ gzip:  3.00 kB
dist/assets/index-DUz2FPmI.js   252.09 kB │ gzip: 80.42 kB
✓ built in 1.41s
```

- Exit code: `0`.

## Decisión recomendada

Cerrar EXP-001 como experimento exitoso sobre `EXP-001-F01`, manteniendo la cobertura contractual pendiente como trabajo futuro no iniciado.
