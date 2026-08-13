# EXP-001 — Reserva de turno

## Estado de aprobación

`Approved for planning — implementation and adversarial testing not yet authorized`

## Objetivo

Garantizar que una reserva sólo pueda crearse cuando la fecha, hora y posición solicitadas correspondan a una franja válida y disponible según la configuración vigente del negocio.

## Contexto

TurnIA Barber es una aplicación React local. La configuración define días de atención, apertura, hora límite de finalización, duración de franja y capacidad. Los turnos cancelados se conservan, pero no deben ocupar un cupo.

La auditoría inicial identificó por inspección que una hora ajena a las franjas configuradas podría superar la validación actual. Esto es una hipótesis de defecto hasta que exista un test reproducible.

Caso adversarial inicial previsto:

- Días habilitados: lunes a sábado.
- Horario: 10:00–19:00.
- Duración: 30 minutos.
- Capacidad: 3.
- Solicitud: lunes, 03:00, cupo 1.
- Resultado esperado: rechazo.

## Alcance

- Validación de día habilitado.
- Validación de hora contra las franjas generadas.
- Validación de `slotPosition`.
- Aplicación de la capacidad configurada.
- Determinación de turnos activos que ocupan un cupo.
- Estado inicial de una nueva reserva.
- Testabilidad de estas reglas sin renderizar React.

## Exclusiones

- Backend.
- Autenticación y usuarios.
- WhatsApp.
- Pagos.
- Sincronización entre dispositivos.
- Sincronización entre pestañas.
- Seguridad de servidor.
- Cambio general del modelo de persistencia.
- Rediseño visual.

Los problemas excluidos pueden registrarse como findings futuros, pero no amplían `EXP-001`.

## Restricciones

- No introducir Redux ni arquitectura hexagonal.
- No agregar Playwright, Cypress u otra infraestructura no necesaria.
- Extraer posteriormente sólo la lógica mínima requerida.
- No modificar producción hasta que una fase y un contrato lo autoricen.
- No considerar demostrado un defecto sin evidencia ejecutable.

## Archivos autorizados

En esta fase, solamente `agentops/**`.

Los archivos de producción y tests que una fase posterior pueda modificar deberán autorizarse antes de iniciar esa ejecución; no quedan autorizados por este documento de preparación.

## Criterios de aceptación

1. Una hora válida dentro del horario puede reservarse si el cupo está disponible.
2. Una hora anterior a la apertura debe rechazarse.
3. Una hora igual o posterior al cierre debe rechazarse.
4. Una hora que no corresponda a una franja generada debe rechazarse.
5. Un cupo menor a `1` debe rechazarse.
6. Un cupo superior a `capacity` debe rechazarse.
7. Un cupo activo ya ocupado debe rechazarse.
8. Un turno cancelado no debe bloquear ese cupo.
9. La creación válida genera un turno con estado `pending`.
10. El comportamiento puede probarse sin depender de renderizar React.

Estos criterios quedan documentados, no implementados ni demostrados en esta fase.

## Definition of Done del experimento completo

- Contrato aprobado.
- Baseline identificable.
- Test adversarial reproducible.
- Al menos un defecto demostrado contra la implementación original.
- Evidencia de FAIL anterior a la corrección.
- Corrección limitada al contrato.
- Evidencia de PASS posterior a la corrección.
- Tests de regresión.
- `npm run build` exitoso.
- Findings documentados.
- Commits identificables.
- Decisión humana de cierre.

La afirmación de un agente no sustituye la evidencia ejecutable.

## Riesgos conocidos

- Las validaciones están actualmente repartidas entre React y el contexto.
- La mutación efectiva confía en validaciones realizadas por la interfaz.
- Datos manipulados desde URL o almacenamiento pueden no respetar tipos de TypeScript en runtime.
- Una extracción demasiado amplia podría sobrediseñar el proyecto.
- Los problemas de sincronización entre pestañas están expresamente fuera de alcance.

## Decisiones humanas registradas

- Topología aprobada: `Planner → Executor → Critic`.
- Experimento aprobado: `EXP-001 — Reserva de turno`.
- Comportamiento adversarial inicial aprobado: rechazo de horas fuera de las franjas válidas.
- Vitest aprobado para Fase 3, pero no autorizado para instalar en esta fase.
- No se autoriza avanzar a Fase 2 sin nueva aprobación humana.

## Preguntas abiertas

- Ninguna necesaria para completar Fase 1.
- Antes de Fase 3 deberán aprobarse los archivos de producción autorizados para la extracción mínima.
