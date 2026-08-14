# Execution — EXP-001 / 2026-08-14-002

## Rol

`Executor`

## Commit base

`fc2c8493d1a677a3c99153d6544f8a789098d3de`

## Acciones realizadas

1. Se verificó rama `main`, upstream `origin/main`, working tree limpio y HEAD correcto.
2. Se ejecutó el build inicial con resultado exitoso.
3. Se instaló únicamente `vitest` como dependencia de desarrollo.
4. Se agregó el script `"test": "vitest run"`.
5. Se creó `validateReservationRequest`, función pura que reproduce las guardas actuales de nombre, día y cupo.
6. Se extrajo `getOccupiedSlotPositions` para conservar el cálculo existente de disponibilidad.
7. Se integró `AppointmentFormPage` con ambas funciones sin añadir validación horaria.
8. Se ejecutó el build posterior a la extracción con resultado exitoso.
9. Se crearon cuatro tests de caracterización y un test adversarial.
10. Se ejecutó `npm test`; los cuatro tests de caracterización pasaron y el adversarial falló.
11. Se ejecutó el build final con resultado exitoso.
12. No se corrigió el defecto, no se hizo commit y no se hizo push.

## Extracción mecánica

`validateReservationRequest` devuelve:

- `{ valid: true }`, o
- `{ valid: false, reason }`.

Razones existentes extraídas:

- `customer-name-required`.
- `closed-day`.
- `slot-unavailable`.

La función no comprueba que `request.time` pertenezca a `generateTimeSlots`. Esta ausencia se conserva deliberadamente para caracterizar el comportamiento anterior a la corrección.

El formulario traduce esos motivos a los mismos textos visibles existentes:

- `Ingresá el nombre del cliente.`
- `El negocio no atiende en la fecha elegida.`
- `Ese cupo ya no está disponible. Elegí otro.`

## Comandos y resultados

### Build inicial

Comando: `npm run build`

- Exit code: `0`.
- Resultado: exitoso.
- Módulos transformados: `1805`.
- Duración informada por Vite: `9.34s`.
- Advertencia: Vite informó tiempos elevados dentro de hooks de plugins; no fue un error de build.

### Instalación

Comando: `npm install -D vitest`

- Exit code: `0`.
- Paquetes agregados: `29`.
- Auditoría informada por npm: `1 high severity vulnerability`.
- No se ejecutó `npm audit fix` porque no estaba autorizado y podría modificar dependencias fuera del alcance.

### Build posterior a la extracción

Comando: `npm run build`

- Exit code: `0`.
- Resultado: exitoso.
- Módulos transformados: `1806`.
- Duración informada por Vite: `915ms`.

### Tests

Comando: `npm test`

- Exit code: `1`.
- Test files: `1 failed (1)`.
- Tests: `1 failed | 4 passed (5)`.
- Test fallido: `EXP-001-F01 — validación adversarial > rechaza una hora que no pertenece a las franjas configuradas`.
- Mensaje real: `AssertionError: expected true to be false // Object.is equality`.
- Línea: `src/domain/reservations.test.ts:68:26`.

Resultado esperado por contrato: `result.valid === false`.

Resultado observado: `result.valid === true`.

### Build final

Comando: `npm run build`

- Exit code: `0`.
- Resultado: exitoso.
- Módulos transformados: `1806`.
- Duración informada por Vite: `611ms`.

## Resultado

La infraestructura funciona, los tests de caracterización pasan y el build permanece sano. El único fallo corresponde al assert contractual del caso `03:00`.

`EXP-001-F01` evoluciona de `Hypothesis` a `Demonstrated` en esta ejecución.
