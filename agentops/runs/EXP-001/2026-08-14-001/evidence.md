# Evidence — EXP-001 / 2026-08-14-001

## Commit inspeccionado

`56a90ca7ca3d83c465c70a3d5d5ec0e8edb5e803`

Baseline de producción incluido:

`1dcdb162967a3c951a1f5b289266efe956e9bf0a`

## Contrato y criterio involucrado

Contrato: `agentops/contracts/EXP-001-reserva-turno.md`.

- Criterio 2: rechazar horas anteriores a apertura.
- Criterio 3: rechazar horas iguales o posteriores al cierre.
- Criterio 4: rechazar horas que no correspondan a una franja generada.
- Criterio 10: poder probar la regla sin renderizar React.

## Evidencia estática

| Archivo | Líneas | Hecho observable |
|---|---:|---|
| `src/pages/AppointmentFormPage.tsx` | 16–18 | `date`, `time` y `slotPosition` pueden inicializarse desde query parameters. |
| `src/pages/AppointmentFormPage.tsx` | 21 | Se generan las franjas válidas en `times`. |
| `src/pages/AppointmentFormPage.tsx` | 22–23 | Disponibilidad y posiciones libres se calculan para el valor de `time`, sin validar primero que sea una franja. |
| `src/pages/AppointmentFormPage.tsx` | 25–29 | Submit valida nombre, día habilitado y cupo libre; no valida membresía de `time` en `times`. |
| `src/pages/AppointmentFormPage.tsx` | 30–32 | El valor de `time` se copia al input y se entrega a `addAppointment`. |
| `src/pages/AppointmentFormPage.tsx` | 47 | `times` limita las opciones visibles del select, pero no constituye una guarda de dominio al enviar. |
| `src/utils/schedule.ts` | 12–19 | `generateTimeSlots` genera franjas cuyos inicios finalizan dentro del cierre. Para 10:00–19:00 y 30 minutos, `03:00` no puede generarse. |
| `src/context/AppContext.tsx` | 5–12 | `AppointmentInput.time` es un `string` sin restricción de dominio. |
| `src/context/AppContext.tsx` | 35–39 | `addAppointment` agrega estado, ID y timestamps y muta la colección sin validar hora o configuración. |
| `src/types/index.ts` | 3–13 | `Appointment` representa hora como `string` y posición como `number`; los tipos no garantizan membresía o rango. |
| `src/utils/date.ts` | 41–42 | `isOpenDay` sólo verifica el día de semana; no valida la hora. |

## Razonamiento reproducible

1. Elegir un lunes habilitado y `time = "03:00"`.
2. Con capacidad 3 y sin turnos a esa hora, `occupied` es vacío y `freePositions` contiene `1`.
3. El nombre no vacío supera la primera guarda.
4. El lunes supera `isOpenDay`.
5. El slot `1` supera la guarda de disponibilidad.
6. No existe una cuarta guarda que compare `time` con las franjas generadas.
7. El input se entrega a `addAppointment`, que no vuelve a validar.

Este razonamiento prueba la ausencia de la guarda en el código inspeccionado. No reemplaza la ejecución necesaria para demostrar el comportamiento completo.

## Estado del finding

- ID: `EXP-001-F01`.
- Estado: `Hypothesis — Confirmed by static inspection — Requires executable evidence`.
- No está `Demonstrated`.
- No existe resultado PASS o FAIL en esta fase.

## Evidencia disponible

- Historia Git y commit inspeccionado identificables.
- Contrato versionado.
- Recorrido estático con archivos y líneas.
- Caso adversarial concreto.
- Diseño Arrange / Act / Assert.
- Extracción mínima identificada.

## Evidencia pendiente

- Función pura de decisión extraída sin cambio de conducta.
- Framework Vitest instalado en una fase autorizada.
- Test adversarial ejecutable.
- Output real que muestre FAIL contra la caracterización original.
- Revisión que confirme que la extracción no corrigió el finding.
- Corrección posterior y evidencia PASS; ambas quedan fuera de Fase 2.

## Comandos de tests

Ninguno. No existe output de tests para este run y no se inventa evidencia.
