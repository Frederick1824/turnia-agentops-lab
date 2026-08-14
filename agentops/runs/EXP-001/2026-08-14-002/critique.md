# Critique post-ejecución — EXP-001 / 2026-08-14-002

## Rol

`Critic`

## Finding revisado

`EXP-001-F01 — Reserva acepta una hora fuera de las franjas válidas`

## Estado

`Demonstrated`

Evolución registrada:

`Hypothesis — Confirmed by static inspection — Requires executable evidence → Demonstrated`

## ¿El test representa el contrato?

Sí.

El test utiliza exactamente el caso contractual aprobado:

- lunes `2026-08-17`;
- días habilitados de lunes a sábado;
- horario `10:00–19:00`;
- duración `30`;
- capacidad `3`;
- colección vacía;
- nombre válido;
- hora `03:00`;
- slot `1`.

El assert exige `valid === false`, en correspondencia con los criterios 2 y 4: una hora anterior a apertura y ajena a las franjas generadas debe rechazarse.

## ¿El fallo ocurre por ausencia de validación horaria?

Sí.

Los cuatro tests que ejercen las reglas extraídas pasan. En el caso adversarial:

- el nombre es válido;
- el lunes está habilitado;
- el slot `1` está dentro de capacidad y libre;
- no existe una guarda posterior sobre `request.time`.

La función devuelve `{ valid: true }` y el assert contractual recibe `true` cuando esperaba `false`.

## ¿Es un fallo de infraestructura?

No.

- Vitest inicia y descubre el archivo correctamente.
- Ejecuta los cinco tests.
- Cuatro tests pasan.
- El stack señala el assert adversarial concreto.
- TypeScript y Vite completan el build después del fallo.

## ¿La extracción introdujo el defecto?

La evidencia disponible sostiene que no:

- La extracción reproduce las tres guardas que existían dentro de `handleSubmit`: nombre, día y cupo.
- La implementación original tampoco comparaba `time` con las franjas generadas.
- `addAppointment` ya aceptaba el input sin validación horaria independiente.
- El formulario mantiene los mismos mensajes y continúa construyendo el mismo objeto después de un resultado válido.
- Los cuatro tests de caracterización confirman reglas básicas conservadas.

La extracción no puede probar equivalencia formal total del componente, pero no incorporó ninguna condición nueva que explique el resultado `true` para `03:00`; preservó explícitamente la ausencia observada en el commit base.

## Control de alcance

- No se agregó validación horaria.
- No se modificó `addAppointment`.
- No se modificó persistencia, navegación, estados o UI.
- No se agregaron dependencias aparte de Vitest.
- No se ejecutó una corrección después del FAIL.

## Conclusión del Critic

El FAIL es evidencia de negocio reproducible y no un error de infraestructura. `EXP-001-F01` queda `Demonstrated` para la función pura que representa las reglas efectivas de aceptación extraídas del flujo actual.

La corrección pertenece a Fase 4 y no está autorizada en este run.
