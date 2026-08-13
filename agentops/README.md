# FTK AgentOps sobre TurnIA Barber

Esta carpeta documenta un experimento incremental para aplicar prácticas de AgentOps a un producto real. No es una plataforma terminada ni una funcionalidad de TurnIA Barber.

## Problema que intenta resolver

El objetivo es que cada cambio relevante tenga un alcance explícito, autoridad delimitada y evidencia reproducible. La estructura permite reconstruir qué se pidió, quién intervino, qué se modificó, qué se verificó y qué decisiones quedaron bajo responsabilidad humana.

## Topología inicial

Se utiliza la secuencia mínima:

`Planner → Executor → Critic`

- El **Planner** transforma una necesidad en un contrato verificable, pero no modifica código ni aprueba su propio plan.
- El **Executor** implementa exclusivamente un contrato previamente aprobado.
- El **Critic** intenta refutar que la implementación cumple el contrato y registra evidencia adversarial; no corrige producción.

No se agregarán más agentes sin una necesidad demostrada.

## Autonomía y autoridad

La autonomía describe cuánto puede avanzar un agente dentro de una tarea. La autoridad define qué decisiones y modificaciones tiene permitido realizar. Un agente puede ser autónomo para inspeccionar, analizar o ejecutar verificaciones y, al mismo tiempo, carecer de autoridad para cambiar requisitos, ampliar alcance o modificar producción.

Cuando una decisión excede la autoridad documentada, el agente debe detenerse y solicitar aprobación humana.

## Trazabilidad

Cada tarea parte de un contrato aprobado. Las ejecuciones posteriores registran el commit inicial, el input exacto, los archivos autorizados, las acciones, los comandos, sus resultados, los findings, la evidencia y la decisión humana.

Git funciona inicialmente como memoria y evidencia compartida: conserva contratos, decisiones, ejecuciones y cambios del producto. Los resultados deben vincularse a commits identificables. Una afirmación de éxito sin evidencia ejecutable no completa un experimento.

## Identificadores

- Experimento: `EXP-NNN`, por ejemplo `EXP-001`.
- Contrato: `EXP-NNN-descripcion`.
- Finding: `EXP-NNN-FNN`, por ejemplo `EXP-001-F01`.
- Decisión arquitectónica: `ADR-NNN`.
- Run: `YYYY-MM-DD-NNN` dentro de `runs/EXP-NNN/`.

## Flujo de un experimento

1. El Planner redacta un contrato.
2. Una persona aprueba o rechaza el contrato.
3. El Executor trabaja únicamente dentro del alcance autorizado.
4. El Critic intenta encontrar contraejemplos y registra findings.
5. La evidencia de FAIL y PASS se conserva en el run correspondiente.
6. Una persona decide si la Definition of Done se cumplió y cierra el experimento.

Los tests viven junto al código o en la estructura de tests del proyecto. `agentops/` registra sus comandos, resultados y relación con findings, sin duplicar el código de test.

## Estado actual

La estructura cubre solamente la preparación y contratación de `EXP-001 — Reserva de turno`. No existe todavía un run, un test adversarial ejecutado ni un defecto demostrado.
