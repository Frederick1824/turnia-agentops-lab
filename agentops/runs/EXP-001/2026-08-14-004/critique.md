# Critique de cierre — EXP-001 / 2026-08-14-004

## ¿Planner → Executor → Critic fue suficiente?

Sí. Tres roles fueron suficientes para EXP-001.

## Complejidad

El problema técnico era pequeño: una guarda de membresía horaria. La topología permitió separar definición, ejecución y refutación sin requerir especializaciones adicionales. Un cuarto agente habría añadido coordinación sin una necesidad demostrada.

## Claridad de responsabilidades

- El Planner definió el contrato y las exclusiones.
- El Executor realizó extracción, tests y FIX sólo después de recibir autoridad.
- El Critic buscó el contraejemplo, exigió evidencia y revisó el PASS.

La separación fue clara y útil. El mayor solapamiento ocurrió cuando el Executor documentó evidencia y luego asumió una revisión Critic; para este tamaño de experimento fue aceptable, siempre que ambos momentos quedaran explícitos.

## Handoffs

Hubo aprobaciones humanas entre preparación, contrato, inspección, evidencia, corrección y cierre. Esto mejoró control y trazabilidad, pero produjo un costo operativo alto respecto de diez líneas funcionales de FIX.

Para cambios de riesgo menor, replicar todas las fases podría ser excesivo. El proceso debería graduarse según impacto y no convertirse en una ceremonia fija.

## Trazabilidad

Fue uno de los resultados más sólidos. Git conserva estados separados para baseline, hipótesis, FAIL y FIX. Los runs enlazan contrato, comandos, outputs y decisiones. La separación de commits evitó reescribir retrospectivamente el comportamiento anterior.

## Riesgo de sobreingeniería

Es real. La cantidad de documentos supera ampliamente el tamaño del cambio. La estructura se justifica aquí porque el objetivo era evaluar el proceso, no sólo corregir el bug. No debería asumirse que este volumen documental es apropiado para cada cambio futuro.

## Utilidad del Critic

Fue material. La auditoría había detectado una ausencia, pero el Critic la transformó en un caso concreto, exigió clasificación epistemológica y evitó declarar un bug antes del test. También verificó que el PASS posterior no surgiera de modificar el assert.

## Utilidad del contrato

El contrato evitó que la extracción derivara en arquitectura general, que la corrección incluyera findings vecinos o que se incorporara infraestructura E2E. También permite reconocer que algunos criterios siguen sin prueba específica.

## Intervención humana

Fue necesaria para:

- elegir topología y experimento;
- aprobar criterios y exclusiones;
- seleccionar el finding;
- autorizar Vitest;
- autorizar extracción y cambios de producción;
- aceptar FAIL y PASS;
- decidir el cierre.

## Autonomía de los agentes

Dentro de cada autorización, los agentes pudieron:

- inspeccionar código y Git;
- proponer contrato y plan;
- extraer lógica existente;
- instalar la dependencia aprobada;
- ejecutar tests y build;
- implementar el FIX autorizado;
- registrar y criticar evidencia.

## Autoridad conservada por humanos

Los humanos retuvieron autoridad sobre:

- requisitos y alcance;
- aceptación del contrato;
- elección del finding;
- dependencias nuevas;
- permiso para modificar producción;
- avance entre fases;
- commits y push en momentos de preservación histórica;
- decisión final de cierre.

Esta separación evitó que el agente corrigiera durante la inspección, instalara herramientas no aprobadas o ampliara el trabajo a otros riesgos.

## Evaluación final

La topología fue suficiente y produjo evidencia creíble. Su costo documental y de coordinación fue alto para el tamaño del FIX. La recomendación no es sumar agentes, sino conservar los tres roles y reducir o combinar ceremonias cuando el riesgo de futuras tareas sea menor.

EXP-001 puede cerrarse como experimento centrado en `EXP-001-F01`, sujeto a la validación final y aprobación humana. No debe presentarse como prueba exhaustiva de todos los criterios de reserva.
