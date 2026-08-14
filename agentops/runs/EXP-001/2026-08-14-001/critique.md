# Critique — EXP-001 / 2026-08-14-001

## Finding principal

### EXP-001-F01 — Reserva acepta una hora fuera de las franjas válidas

- **Estado exacto:** `Hypothesis — Confirmed by static inspection — Requires executable evidence`
- **No clasificado como:** `Demonstrated`
- **Categoría principal:** `TRUST`
- **Categorías secundarias:** `ASSUMPTIONS`, `BOUNDARIES`, `TIME / ORDER`, `THREATS`
- **Severidad propuesta:** `Medium`

La severidad es media porque el comportamiento parece permitir introducir una reserva inválida que afecta la integridad de la agenda, aunque la aplicación es local, no existe autoridad de servidor y la entrada requiere manipular o conservar un valor ajeno a las opciones normales de la interfaz.

## Contrato afectado

Objetivo de `EXP-001`: una reserva sólo puede crearse cuando fecha, hora y posición corresponden a una franja válida y disponible.

Criterios potencialmente violados:

- Criterio 2: una hora anterior a la apertura debe rechazarse.
- Criterio 3: una hora igual o posterior al cierre debe rechazarse.
- Criterio 4: una hora que no corresponda a una franja generada debe rechazarse.
- Criterio 10: el comportamiento debe poder probarse sin renderizar React; actualmente la decisión está acoplada al componente.

## Precondiciones e input concreto

- Fecha: un lunes válido, por ejemplo `2026-08-17`.
- `openingDays`: `[1, 2, 3, 4, 5, 6]`.
- `openingTime`: `10:00`.
- `closingTime`: `19:00`.
- `slotDurationMinutes`: `30`.
- `maxAppointmentsPerSlot`: `3`.
- Turnos existentes: ninguno para `2026-08-17 03:00`, cupo `1`.
- Cliente: `Caso adversarial`.
- Hora solicitada: `03:00`.
- `slotPosition`: `1`.

## Recorrido estático del dato

1. `AppointmentFormPage` inicializa `date`, `time` y `slotPosition` desde un turno existente o desde los query parameters `date`, `time` y `slot` (`AppointmentFormPage.tsx`, líneas 16–18).
2. `generateTimeSlots` produce las franjas válidas y el componente las usa para renderizar las opciones del `<select>` (`AppointmentFormPage.tsx`, líneas 21 y 47).
3. La disponibilidad se calcula comparando turnos existentes con la misma `date` y el mismo `time`, cualquiera sea el valor de `time`, y excluyendo cancelados (`AppointmentFormPage.tsx`, línea 22).
4. Las posiciones libres se generan sólo desde `1` hasta la capacidad configurada (`AppointmentFormPage.tsx`, línea 23).
5. Al enviar, `handleSubmit` valida nombre, día habilitado y que `slotPosition` esté entre las posiciones libres (`AppointmentFormPage.tsx`, líneas 25–29).
6. `handleSubmit` no comprueba que `time` esté incluido en `times` ni vuelve a invocar una política equivalente (`AppointmentFormPage.tsx`, líneas 25–32).
7. El input conserva `time` sin normalización ni validación adicional (`AppointmentFormPage.tsx`, línea 30).
8. Para una creación, el input se entrega a `addAppointment` (`AppointmentFormPage.tsx`, línea 32).
9. `addAppointment` agrega identificador, estado `pending` y timestamps, y lo incorpora al estado sin validar fecha, hora, posición o capacidad (`AppContext.tsx`, líneas 35–39).

## Comportamiento esperado

La operación debe rechazar `2026-08-17 03:00`, cupo `1`, porque `03:00` no pertenece a las franjas generadas para `10:00–19:00` con duración de 30 minutos.

## Comportamiento que el código parece permitir

Si el estado del formulario conserva `time = "03:00"`, la fecha está habilitada y el cupo `1` no aparece ocupado para esa combinación exacta, las tres guardas presentes parecen superarse y `addAppointment` parece incorporar un turno `pending` a las `03:00`.

Esto está `Confirmed by static inspection` como recorrido posible del código. Sigue siendo `Hypothesis` respecto del comportamiento ejecutado y `Requires executable evidence`. No está `Demonstrated`.

## Seis dimensiones adversariales

### ASSUMPTIONS

- La implementación supone que `date` proveniente de estado representa una fecha válida; sólo comprueba que su día de semana pertenezca a `openingDays`.
- Supone que `time` pertenece a las opciones generadas porque el control visual es un `<select>`, aunque el estado puede inicializarse desde URL o desde un turno existente.
- Supone que `slotPosition` proviene de los botones visibles. Esta suposición sí recibe una defensa parcial: debe pertenecer a `freePositions` antes de crear.
- `addAppointment` supone que quien lo invoca ya validó toda la entrada.

### BOUNDARIES

- **Hora anterior a apertura:** no existe una comparación de la hora solicitada con la apertura; parece aceptable si el día y el cupo son válidos.
- **Hora igual al cierre:** no pertenece a las franjas generadas, pero no existe una validación de membresía; parece seguir el mismo recorrido.
- **Hora entre franjas:** por ejemplo `10:15` con duración 30; no pertenece a `times`, pero no se valida esa condición.
- **Slot `0`:** es rechazado indirectamente porque `freePositions` comienza en `1`.
- **Slot negativo:** es rechazado indirectamente por la misma razón.
- **Slot superior a capacidad:** es rechazado indirectamente porque no pertenece a `freePositions`.

Los límites de slot tienen una guarda observable. Los límites de hora dependen únicamente de que la UI entregue un valor previsto.

### TRUST

- `date`, `time` y `slot` se leen de la URL y se convierten directamente en estado inicial.
- `slot` se transforma con `Number`; luego se controla por membresía en `freePositions`.
- `time` se mantiene como string y no se controla por membresía en `times`.
- El objeto `input` se forma desde el estado y `addAppointment` lo acepta como confiable.
- Los tipos TypeScript describen `time` como `string` y `slotPosition` como `number`, pero no expresan ni verifican las restricciones del dominio.

### DEPENDENCIES

- La decisión depende de `generateTimeSlots`, pero su resultado sólo alimenta las opciones visibles; no participa en la guarda de `handleSubmit`.
- La decisión de día depende de `isOpenDay` y sí se evalúa antes de crear.
- La creación depende de `addAppointment`, que construye el registro pero no recibe `settings` ni la colección como argumentos de validación explícitos.
- No se analiza en este run corrupción general de `localStorage`; queda fuera de alcance.

### TIME / ORDER

- Primero se inicializa `time` desde URL/turno existente; después se generan las opciones válidas. No hay reconciliación explícita entre ambos valores.
- En submit se evalúan nombre, día y cupo; luego se construye y agrega el turno. No existe una guarda de hora inmediatamente antes de la mutación.
- No se investiga concurrencia multi-tab ni acciones paralelas; están fuera de alcance.

### THREATS

- Un usuario puede construir una URL como `/turnos/nuevo?date=2026-08-17&time=03:00&slot=1`.
- Si el navegador conserva ese valor controlado en el estado del formulario, el flujo estático no presenta una validación de dominio que lo rechace.
- Manipular el estado por herramientas de desarrollo conduciría al mismo punto de confianza, aunque la reproducción concreta debe demostrarse en Fase 3.
- Este análisis no afirma una vulnerabilidad de servidor ni amplía el modelo de amenazas.

## Test adversarial propuesto para Fase 3

### Arrange

- Configuración con `openingDays = [1, 2, 3, 4, 5, 6]`, `openingTime = "10:00"`, `closingTime = "19:00"`, `slotDurationMinutes = 30` y `maxAppointmentsPerSlot = 3`.
- Fecha habilitada: lunes `2026-08-17`.
- Colección de turnos vacía.
- Solicitud con cliente no vacío, `date = "2026-08-17"`, `time = "03:00"`, `slotPosition = 1` y nota vacía.
- Reloj e ID deterministas si la operación construye el turno.

### Act

Invocar una función pura de decisión de reserva extraída mecánicamente del flujo existente, por ejemplo `evaluateReservationRequest(settings, appointments, input)`, que reproduzca exactamente las guardas actuales sin agregar todavía la validación faltante.

### Assert

Según el contrato, el resultado debe ser un rechazo identificable porque `03:00` no pertenece a `generateTimeSlots("10:00", "19:00", 30)` y no debe producirse un nuevo turno.

Contra la extracción fiel de la implementación actual, se espera que este assert falle porque las guardas existentes no rechazan la hora. Ese resultado futuro sería la evidencia `FAIL antes de FIX`. En este run no se ejecutó ni se marcó FAIL.

## ¿Podemos demostrar EXP-001-F01 con un test unitario sin modificar antes la estructura actual?

**No.**

La decisión completa no existe como función importable:

- Las guardas viven dentro de `handleSubmit`, una función local del componente.
- `handleSubmit` depende de hooks de React, estado local, router y contexto.
- `addAppointment` está creado dentro del valor memoizado de `AppProvider` y sólo construye/muta; no representa por sí solo la política de aceptación.
- `generateTimeSlots` es pura, pero probar que `03:00` no aparece en sus resultados no demuestra que la operación de reserva lo rechace.

Podría montarse React y simularse el formulario, pero eso no cumpliría el criterio de demostrar la regla con un test unitario independiente de React.

## Extracción mínima necesaria

El Executor debería extraer mecánicamente las guardas actuales a una función pura, sin añadir todavía la comprobación faltante. Una forma mínima:

- Crear `src/domain/reservations.ts`.
- Definir allí un tipo de input compartido y una función pura como `evaluateReservationRequest(settings, appointments, input)`.
- Reproducir exactamente las validaciones actuales: nombre, día habilitado y membresía del slot en las posiciones libres.
- Mantener deliberadamente ausente la validación `times.includes(input.time)` durante la caracterización.
- Hacer que `AppointmentFormPage.handleSubmit` consuma el resultado de esa función sin cambiar mensajes ni flujo observable.

Después de confirmar equivalencia mecánica, el Critic puede ejecutar el test adversarial contra esa función y conservar el `FAIL antes de FIX`.

### Extracción mecánica frente a cambio de comportamiento

- **Extracción mecánica:** mover el cálculo de ocupados, posiciones libres y las tres guardas existentes a una función pura; cablear el formulario a su resultado; mantener las mismas entradas, mensajes y decisiones.
- **Cambio de comportamiento posterior:** añadir la validación de pertenencia de `time` a las franjas generadas y devolver el rechazo correspondiente. Esto pertenece a la fase de corrección, no a la extracción de caracterización.

## Riesgo de alterar accidentalmente el comportamiento

`Medium`.

El riesgo principal es que el Executor implemente desde el inicio la función ideal conforme al contrato e incluya `generateTimeSlots(...).includes(time)`. Eso corregiría `EXP-001-F01` antes de capturar la evidencia FAIL. También podría cambiar la semántica de turnos cancelados o la exclusión del turno actual durante reprogramación.

La mitigación es separar en commits o pasos verificables:

1. Extracción mecánica que conserva las guardas actuales.
2. Test adversarial ejecutado y evidencia FAIL.
3. Corrección autorizada posterior.

## Archivos que necesitaría tocar el Executor en Fase 3

Mínimo previsto, sujeto a autorización humana futura:

- `src/domain/reservations.ts` — nueva función pura de decisión.
- `src/pages/AppointmentFormPage.tsx` — consumir la función extraída sin cambiar conducta.
- `src/types/index.ts` — sólo si se decide compartir formalmente `AppointmentInput`; puede evitarse definiendo el tipo en el módulo de dominio.
- Archivo de test todavía no creado, por ejemplo `src/domain/reservations.test.ts`.
- `package.json` y `package-lock.json` — instalación y script de Vitest en Fase 3.

`src/context/AppContext.tsx` no necesita modificarse para la extracción mínima si la creación efectiva permanece igual. Mover o endurecer `addAppointment` sería una decisión adicional y podría mezclar caracterización con corrección.

## Qué no debería refactorizarse todavía

- Persistencia en `localStorage`.
- `AppProvider` completo.
- Rutas o interfaz visual.
- Modelo general de estados.
- Configuración general.
- Reprogramación más allá de preservar su exclusión del turno actual.
- Sincronización entre pestañas.
- Generador de franjas, salvo consumirlo posteriormente para la corrección.

## Cierre de Fase 2

1. **¿Existe una hipótesis concreta y acotada?** Sí: `EXP-001-F01`.
2. **¿Está vinculada a un criterio contractual?** Sí: criterios 2, 3, 4 y testabilidad 10.
3. **¿Sabemos por qué el código podría violarlo?** Sí: `time` no se valida contra `times` y `addAppointment` confía en el input.
4. **¿Sabemos qué test demostraría o refutaría la hipótesis?** Sí: configuración 10:00–19:00, lunes, `03:00`, slot 1, esperando rechazo.
5. **¿Sabemos qué extracción mínima necesitamos?** Sí: función pura que replique las guardas actuales.
6. **¿Podemos extraer sin corregir accidentalmente el defecto?** Sí, si la extracción conserva de manera deliberada las condiciones actuales y la validación horaria se reserva para una corrección posterior.

No existen bloqueos documentales para solicitar aprobación humana de Fase 3. Fase 3 no fue iniciada.
