# EXP-001 — Reserva de turno

## Resumen ejecutivo

EXP-001 aplicó un proceso mínimo `Planner → Executor → Critic` sobre una regla real de TurnIA Barber. El experimento identificó por inspección que una reserva podía aceptar una hora fuera de las franjas configuradas, convirtió esa hipótesis en un test que falló, aplicó una corrección acotada y verificó que el mismo test pasara después.

El finding `EXP-001-F01` quedó resuelto con evidencia reproducible. Esto no significa que todos los criterios del contrato hayan sido probados exhaustivamente; el estado de cada uno se detalla más adelante.

## Problema

La regla buscada era:

> Una reserva sólo puede crearse cuando la fecha, hora y posición solicitadas corresponden a una franja válida y disponible según la configuración vigente del negocio.

El caso adversarial elegido fue una solicitud para un lunes habilitado, a las `03:00`, con horario comercial `10:00–19:00`, franjas de 30 minutos, capacidad 3 y cupo 1 libre. El resultado contractual era rechazo.

## Contexto

Antes del experimento, TurnIA Barber era una aplicación React + Vite + TypeScript funcional, con persistencia local, agenda diaria y operaciones de turnos. Las validaciones de reserva estaban dentro de un componente React y la mutación efectiva confiaba en ellas. No existía framework de testing ni una función pura que representara la decisión de reserva.

El baseline quedó identificado en `1dcdb162967a3c951a1f5b289266efe956e9bf0a`.

## Arquitectura AgentOps utilizada

La topología fue deliberadamente pequeña:

`Planner → Executor → Critic`

- **Planner:** inspeccionó el producto, delimitó alcance, criterios, riesgos y Definition of Done. No modificó producción ni aprobó su propio contrato.
- **Executor:** realizó únicamente las extracciones, pruebas y correcciones autorizadas en cada fase.
- **Critic:** intentó refutar el cumplimiento, distinguió hipótesis de defectos demostrados y revisó que el FIX resolviera el contrato sin debilitar el test.

No fue necesario agregar agentes adicionales.

## Contrato

El contrato se definió antes de modificar producción. Incluyó validación de día, hora, posición, capacidad, ocupación, cancelados, estado inicial y testabilidad sin React. Excluyó backend, autenticación, pagos, WhatsApp, sincronización multi-tab, seguridad de servidor, cambio general de persistencia y rediseño visual.

Esta definición previa evitó que el finding habilitara un refactor general o la corrección oportunista de problemas vecinos.

## Hipótesis

El Critic trazó el dato desde los parámetros de URL y el estado del formulario hasta `addAppointment`:

1. `time` podía inicializarse con un valor externo a las opciones del `<select>`.
2. `generateTimeSlots` se usaba para mostrar opciones, pero no como guarda de dominio.
3. `handleSubmit` validaba nombre, día y cupo, no membresía horaria.
4. `addAppointment` aceptaba el input sin una validación independiente.

El finding se registró inicialmente como:

`Hypothesis — Confirmed by static inspection — Requires executable evidence`.

La inspección identificó un recorrido posible, pero no se trató como prueba suficiente.

## Evidencia FAIL

Se instaló Vitest y se extrajo mecánicamente una función pura que conservó las guardas existentes sin añadir la regla faltante. Se crearon cuatro tests de caracterización y un test adversarial:

```text
EXP-001-F01 — validación adversarial
rechaza una hora que no pertenece a las franjas configuradas
```

El assert contractual fue:

```ts
expect(result.valid).toBe(false)
```

Resultado anterior al FIX:

```text
Test Files  1 failed (1)
Tests       1 failed | 4 passed (5)
AssertionError: expected true to be false
```

Exit code: `1`.

El resultado observado `true` mostró que la lógica extraída consideraba válida la solicitud a las `03:00`. Como los otros cuatro tests pasaron y Vitest ejecutó correctamente, el resultado fue un fallo de negocio y no de infraestructura. `EXP-001-F01` pasó a `Demonstrated`.

## Corrección

El Executor agregó una única regla en la función pura:

- Generar las franjas mediante `generateTimeSlots` usando `openingTime`, `closingTime` y `slotDurationMinutes` vigentes.
- Rechazar `request.time` cuando no pertenece al resultado.
- Devolver el reason explícito `invalid-time`.
- Traducir ese reason en la UI sin cambiar navegación, persistencia o diseño.

No se hardcodearon horarios y no se modificó el test adversarial.

## Evidencia PASS

Después del FIX se ejecutó exactamente la misma suite:

```text
Test Files  1 passed (1)
Tests       5 passed (5)
```

Exit code: `0`.

El build posterior también fue exitoso con exit code `0`. El Critic confirmó que el test no fue debilitado y que el diff funcional estaba limitado al finding.

## Trazabilidad Git

| Commit | Fase | Rol principal | Resultado |
|---|---|---|---|
| `1dcdb16` | 0 — Baseline | Preparación | TurnIA funcional antes de AgentOps |
| `56a90ca` | 1 — Estructura | Planner | Roles, contrato, ADR y templates versionados |
| `fc2c849` | 2 — Primer Critic | Critic | `EXP-001-F01` formulado como hipótesis estática |
| `6a7b8d8` | 3 — Evidencia | Executor + Critic | FAIL reproducible: 1 fallido, 4 aprobados |
| `760b211` | 4 — Corrección | Executor + Critic | FIX verificado: 5 aprobados, build exitoso |

El run de cierre de Fase 5 queda inicialmente sin commit para revisión humana.

## Autoridad humana

Las siguientes decisiones requirieron autorización explícita:

- Elección de `Planner → Executor → Critic`.
- Selección de `EXP-001 — Reserva de turno`.
- Aprobación del contrato y sus exclusiones.
- Elección de `EXP-001-F01` como finding inicial.
- Autorización de Vitest como única dependencia nueva directa.
- Autorización de la extracción mecánica previa al test.
- Aprobación de la evidencia FAIL.
- Autorización de modificar producción para aplicar el FIX.
- Aprobación técnica de la evidencia PASS.
- Decisión de iniciar y revisar el cierre.

Los agentes conservaron autonomía operativa dentro de cada contrato, mientras los humanos mantuvieron la autoridad para ampliar alcance, instalar herramientas, modificar producción y avanzar de fase.

## Métricas

| Métrica | Resultado respaldado |
|---|---:|
| Fases ejecutadas, incluyendo cierre | 6 (`0` a `5`) |
| Runs concretos | 4 (`001` a `004`) |
| Commits relevantes antes del commit de cierre | 5 |
| Tests antes del FIX | 5 |
| Tests fallidos antes del FIX | 1 |
| Tests aprobados antes del FIX | 4 |
| Tests después del FIX | 5 |
| Tests fallidos después del FIX | 0 |
| Tests aprobados después del FIX | 5 |
| Findings demostrados | 1 |
| Findings corregidos y verificados | 1 |
| Build antes del FIX | Exitoso, exit code `0` |
| Build después del FIX | Exitoso, exit code `0` |
| Dependencias directas nuevas | 1 (`vitest`) |
| Paquetes agregados informados por npm | 29 |

No se registran tiempos de trabajo ni costos porque no existe evidencia normalizada para calcularlos.

## Estado contractual real

La evidencia distingue implementación de cobertura de tests:

| # | Criterio | Implementación actual | Evidencia de test |
|---:|---|---|---|
| 1 | Hora válida y cupo libre puede reservarse | La validación devuelve válido; el flujo existente crea el turno | Test unitario de validación válida; no hay test de integración de creación |
| 2 | Hora anterior a apertura se rechaza | Sí, por membresía en franjas | Sí: caso `03:00` |
| 3 | Hora igual o posterior al cierre se rechaza | Sí, por membresía en franjas | No existe test específico |
| 4 | Hora ajena a una franja se rechaza | Sí, por membresía en franjas | Sí para `03:00`; no existe caso aislado entre franjas, como `10:15` |
| 5 | Slot menor a 1 se rechaza | Sí, por posiciones generadas desde 1 | No existe test específico |
| 6 | Slot superior a capacidad se rechaza | Sí, por límite de posiciones generadas | No existe test específico |
| 7 | Cupo activo ocupado se rechaza | Sí | Sí, con turno confirmado |
| 8 | Turno cancelado no bloquea cupo | Sí, cancelados se excluyen | No existe test específico |
| 9 | Creación válida genera estado `pending` | Sí, en `addAppointment` | No existe test específico de creación |
| 10 | Reglas probables sin renderizar React | Sí, mediante función pura | Sí, suite unitaria sin React |

Por lo tanto, `EXP-001-F01` está demostrado, corregido y verificado. El objetivo puntual del experimento se cumplió. El contrato más amplio no cuenta todavía con evidencia ejecutable específica para todos sus criterios.

## Lecciones aprendidas

- **Inspección no equivale a evidencia:** permitió formular un recorrido probable, pero el estado `Demonstrated` requirió un test ejecutado y un resultado observable.
- **El FAIL era necesario:** estableció que el test podía detectar el problema antes de aceptar el FIX.
- **La extracción no debía corregir:** preservar la ausencia de validación horaria evitó perder la evidencia del comportamiento original.
- **Mismo test antes y después:** reduce el riesgo de declarar éxito cambiando la pregunta, los datos o el assert.
- **Git como memoria compartida:** los commits separados conservan baseline, hipótesis, FAIL y FIX como estados auditables.
- **Contrato:** fijó criterios y exclusiones antes de modificar código, reduciendo expansión accidental.
- **Critic:** obligó a buscar un contraejemplo y a distinguir ausencia de guarda, hipótesis y defecto reproducido.
- **Costo operativo:** cuatro runs, aprobaciones entre fases y documentación detallada representan trabajo adicional significativo para un cambio pequeño.
- **Riesgo del proceso:** si se aplica indiscriminadamente, puede producir burocracia, documentación duplicada o una falsa sensación de seguridad basada en pocos tests.
- **Límite de la evidencia:** un finding verificado no implica cobertura completa del contrato ni del producto.

## Evaluación de la topología

`Planner → Executor → Critic` fue suficiente para EXP-001.

La complejidad del problema no justificó más agentes. Las responsabilidades fueron distinguibles y la cantidad de handoffs fue manejable, aunque alta en relación con el tamaño del FIX. El Planner evitó cambios sin contrato, el Executor mantuvo el alcance y el Critic produjo el valor diferencial al convertir una sospecha en un test refutable y revisar que el PASS no proviniera de debilitarlo.

Agregar más roles habría aumentado coordinación sin evidencia de beneficio.

## Resultado

`EXP-001-F01: Verified fixed`.

Recomendación: cerrar EXP-001 como experimento exitoso y acotado sobre el finding seleccionado. No declarar que todos los criterios del contrato están exhaustivamente probados. La cobertura pendiente puede abordarse en trabajos futuros autorizados, sin impedir el cierre de la cadena `Hypothesis → Demonstrated → Fixed → Verified`.

## Limitaciones y fuera de alcance

- Sincronización y concurrencia entre pestañas.
- Integridad estructural de `localStorage`.
- Autenticación.
- Backend.
- Seguridad de servidor.
- Otros findings detectados durante la auditoría.
- Vulnerabilidad npm informada durante la instalación de Vitest.

La vulnerabilidad npm no fue investigada ni corregida dentro de EXP-001.

## Próximos experimentos posibles

Sin implementación ni prioridad aprobada:

- `slotPosition` fuera de capacidad.
- Configuración inválida.
- `localStorage` estructuralmente corrupto.
- Concurrencia entre pestañas.
- Transiciones inválidas de estado.
