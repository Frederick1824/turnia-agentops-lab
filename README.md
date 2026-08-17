# TurnIA AgentOps Lab

> Un experimento AgentOps pequeño y trazable, construido sobre una aplicación real de gestión de turnos.

[🇬🇧 Read in English](./README.en.md)

---

## Descripción general

**TurnIA AgentOps Lab** es un repositorio experimental creado para explorar cómo pueden utilizarse agentes de programación con inteligencia artificial mediante contratos explícitos, autoridad limitada, revisión adversarial, evidencia ejecutable y decisiones controladas por personas.

El experimento se realizó sobre **TurnIA**, una aplicación existente de gestión de turnos construida con React, Vite, TypeScript y persistencia local.

El objetivo no era reconstruir TurnIA ni maximizar la automatización.

El objetivo era responder una pregunta más acotada:

> ¿Puede un flujo de desarrollo asistido por IA identificar, demostrar, corregir y verificar un defecto real, preservando al mismo tiempo la trazabilidad y la autoridad humana?

El primer experimento, `EXP-001`, completó exitosamente ese ciclo.

---

## Inspiración y agradecimiento

Este experimento nació a partir de ideas presentadas por **Axel Labruna** sobre AgentOps, desarrollo asistido por IA y testing adversarial.

En particular, su trabajo inspiró la exploración de conceptos como:

- separar la autonomía de los agentes de su autoridad;
- utilizar contratos y criterios de aceptación explícitos;
- trabajar con roles Planner / Executor / Critic;
- aplicar revisión adversarial antes de declarar éxito;
- exigir evidencia ejecutable en lugar de asumir resultados;
- utilizar Git como registro trazable de decisiones y resultados.

Un agradecimiento especial a Axel por compartir estas ideas y poner su trabajo a disposición de la comunidad.

Repositorio de referencia:

https://github.com/axellab/adversarial-testing-toolkit

TurnIA AgentOps Lab es un experimento independiente desarrollado sobre TurnIA. No es un fork, una adaptación oficial ni una redistribución del toolkit de Axel Labruna.

---

## Idea central

El flujo sigue un principio simple de AgentOps:

```text
Autonomía ≠ Autoridad
```

Los agentes pueden inspeccionar, proponer, implementar y probar.

Las personas conservan la autoridad sobre:

* alcance;
* contratos;
* dependencias;
* cambios en producción;
* avance entre fases;
* aceptación de evidencia;
* commits y publicación;
* cierre del experimento.

Esta separación se aplicó deliberadamente durante todo el experimento.

---

# EXP-001

## Validación de reservas

El primer experimento se concentró en una regla de negocio:

> Un turno no debe aceptarse si la hora solicitada no pertenece a una de las franjas válidas generadas por la configuración del negocio.

Configuración de ejemplo:

```text
Apertura:          10:00
Cierre:            19:00
Duración de franja: 30 minutos
Capacidad:          3
```

Entrada adversarial:

```text
Fecha: 2026-08-17
Hora: 03:00
Cupo: 1
```

Resultado esperado:

```text
Rechazado
```

Comportamiento inicial de la implementación:

```text
Aceptado
```

---

## Topología de agentes

El experimento utilizó tres roles:

```text
Planner
   ↓
Executor
   ↓
Critic
```

### Planner

Responsable de definir:

* alcance;
* contratos;
* criterios de aceptación;
* exclusiones;
* límites de implementación.

El Planner no puede modificar código de producción ni aprobar su propio trabajo.

### Executor

Responsable de:

* implementar cambios autorizados explícitamente;
* realizar refactors mínimos;
* ejecutar builds y tests;
* preservar el alcance aprobado.

El Executor no puede ampliar los requisitos por iniciativa propia.

### Critic

Responsable de intentar refutar que la implementación satisface el contrato.

El Critic analiza el sistema mediante dimensiones adversariales como:

* supuestos;
* límites;
* confianza;
* dependencias;
* tiempo y orden;
* amenazas.

Un finding no se considera demostrado hasta que existe evidencia ejecutable.

---

# Ciclo de vida del experimento

`EXP-001` siguió esta secuencia:

```text
BASELINE
    ↓
ESTRUCTURA AGENTOPS
    ↓
CRITIC / HIPÓTESIS
    ↓
DEMOSTRADO 🔴
    ↓
CORRECCIÓN
    ↓
VERIFICADO 🟢
    ↓
CIERRE
```

---

## 1. Baseline

Commit:

```text
1dcdb16
chore: baseline TurnIA before AgentOps experiment
```

La aplicación funcional original se preservó antes de introducir artefactos AgentOps.

---

## 2. Estructura AgentOps

Commit:

```text
56a90ca
docs: establish FTK AgentOps experiment structure
```

El repositorio incorporó:

```text
agentops/
├── agents/
│   ├── planner.md
│   ├── executor.md
│   └── critic.md
├── contracts/
├── decisions/
├── runs/
└── templates/
```

Esto estableció contratos explícitos, responsabilidades de agentes y reglas de trazabilidad antes de modificar el comportamiento de producción.

---

## 3. Hipótesis del Critic

Commit:

```text
fc2c849
docs: record EXP-001 adversarial critique run
```

El Critic descubrió que las franjas horarias válidas se generaban correctamente para la interfaz, pero la operación de reserva no verificaba de forma independiente que la hora enviada perteneciera a esas franjas.

El finding se registró como:

```text
EXP-001-F01
La reserva acepta una hora fuera de las franjas válidas configuradas
```

Estado inicial:

```text
Hipótesis
→ Confirmada por inspección estática
→ Requiere evidencia ejecutable
```

El análisis estático, por sí solo, no se consideró evidencia suficiente.

---

## 4. Evidencia ejecutable

Commit:

```text
6a7b8d8
test: demonstrate EXP-001-F01 with adversarial evidence
```

Las guardas existentes de la reserva se extrajeron mecánicamente a una función pura de dominio, sin corregir el defecto sospechado.

Luego se incorporó Vitest.

Cuatro tests de caracterización pasaron.

El test adversarial falló:

```text
Test Files  1 failed (1)
Tests       1 failed | 4 passed (5)
```

Fallo:

```text
AssertionError: expected true to be false
```

La implementación consideraba válida una reserva a las `03:00`.

En ese momento:

```text
EXP-001-F01 → Demostrado
```

El test rojo no se consideró un experimento fallido.

Fue la primera evidencia ejecutable de que la hipótesis del Critic era correcta.

---

## 5. Corrección controlada

Commit:

```text
760b211
fix: reject reservations outside valid time slots
```

La validación de dominio se modificó para reutilizar la lógica existente de `generateTimeSlots`.

La hora solicitada ahora debe pertenecer al conjunto de franjas configuradas.

No se introdujo un horario hardcodeado.

El assert adversarial original no fue modificado.

---

## 6. Verificación

Después de la corrección:

```text
Test Files  1 passed (1)
Tests       5 passed (5)
```

Build:

```text
✓ 1806 modules transformed
✓ build successful
```

El mismo test que antes exponía el defecto ahora pasa.

Ciclo de vida del finding:

```text
Hipótesis
→ Confirmada por inspección estática
→ Demostrado
→ Corregido
→ Verificado
```

---

## 7. Cierre

Commit:

```text
5858b5b
docs: close EXP-001 AgentOps case study
```

El experimento se cerró formalmente con:

* evidencia ejecutable;
* commits trazables;
* limitaciones explícitas;
* evaluación final;
* tests aprobados;
* build de producción exitoso.

Informe detallado:

[`agentops/EXP-001-REPORT.md`](./agentops/EXP-001-REPORT.md)

---

# Git como memoria compartida

Git se utilizó deliberadamente como parte del modelo de evidencia del experimento.

La historia preserva estados significativos, no solamente la solución final:

```text
5858b5b  CIERRE
760b211  CORRECCIÓN / VERIFICADO
6a7b8d8  DEMOSTRADO
fc2c849  CRITIC / HIPÓTESIS
56a90ca  ESTRUCTURA AGENTOPS
1dcdb16  BASELINE
```

Esto permite auditar cronológicamente el proceso de razonamiento.

---

# Autoridad humana y asistencia de IA

Este proyecto fue desarrollado intencionalmente con asistencia de inteligencia artificial.

### Dirección y autoridad humana

**Federico Montoro**

Responsable de:

* dirección del experimento;
* contexto de negocio;
* aprobación del alcance;
* aprobación de criterios de aceptación;
* autorización de dependencias;
* autorización de cambios en producción;
* revisión de findings;
* autorización de cada fase;
* aceptación de evidencia FAIL/PASS;
* decisiones de publicación en Git;
* cierre final del experimento.

### Implementación asistida por IA

**Codex**

Utilizado como agente de implementación para:

* inspección del repositorio;
* extracción de código;
* implementación de tests;
* correcciones controladas;
* builds;
* operaciones Git;
* generación de evidencia técnica.

### Asistencia metodológica y de revisión

**ChatGPT**

Utilizado para:

* diseño del flujo AgentOps;
* diseño del contrato y las fases;
* estrategia adversarial;
* revisión de salidas de agentes;
* asistencia en la orquestación del experimento.

La asistencia de IA es parte del experimento, no algo que este repositorio intente ocultar.

La distinción relevante es:

```text
Ejecución de IA
≠
Autoridad de IA
```

---

# Tecnología

Aplicación:

```text
React
TypeScript
Vite
localStorage
```

Experimento/testing:

```text
Vitest
Git
GitHub
Artefactos AgentOps basados en Markdown
```

Para EXP-001 no se introdujeron backend, sistema de autenticación, infraestructura distribuida de agentes ni plataforma externa de orquestación.

---

# Ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Iniciar desarrollo:

```bash
npm run dev
```

Ejecutar tests:

```bash
npm test
```

Generar el build:

```bash
npm run build
```

---

# Estado actual de los tests

Al cierre de EXP-001:

```text
Test Files  1 passed (1)
Tests       5 passed (5)
Failures    0
```

Build de producción:

```text
Exitoso
```

---

# Lo que EXP-001 NO demuestra

EXP-001 demuestra y corrige un finding específico.

**No** afirma que TurnIA esté probado exhaustivamente.

Las áreas fuera del experimento incluyen:

* concurrencia multi-tab;
* datos persistidos malformados;
* autenticación;
* seguridad del servidor;
* persistencia de backend;
* validación completa del ciclo de vida de turnos;
* todos los límites definidos en el contrato de reserva;
* vulnerabilidades de dependencias npm.

Esas áreas pueden convertirse en experimentos futuros, pero no se consideran resueltas de manera implícita.

---

# Lecciones principales

### La inspección estática no es evidencia

Un bug plausible siguió siendo una hipótesis hasta que la evidencia ejecutable lo reprodujo.

### El FAIL antes del FIX importa

Corregir el problema antes de demostrarlo habría destruido evidencia útil.

### El mismo test antes y después ofrece evidencia más sólida

El assert adversarial no se debilitó para obtener un resultado verde.

En cambio, se modificó el comportamiento de producción.

### Los contratos reducen el desvío de los agentes

El alcance explícito evitó que entraran al experimento refactors y correcciones no relacionados.

### Los Critics necesitan evidencia

El Critic fue útil porque produjo una afirmación refutable en lugar de una opinión vaga de revisión de código.

### Más agentes no son automáticamente mejores

Para este experimento:

```text
Planner → Executor → Critic
```

fue suficiente.

Agregar más roles habría aumentado el costo de coordinación sin un beneficio claro.

### La gobernanza tiene un costo

Para una corrección funcional pequeña, la documentación y los handoffs fueron intencionalmente más pesados que en un desarrollo convencional.

Ese costo adicional sólo tiene sentido cuando la trazabilidad, la experimentación o el riesgo lo justifican.

---

# Estado

```text
EXP-001: CERRADO
EXP-001-F01: CORRECCIÓN VERIFICADA
Tests: PASS
Build: PASS
```

Este estado no implica la existencia de un experimento posterior.

---

## Autor

**Federico Montoro**

Portfolio: https://fedemontoro.vercel.app/

GitHub: https://github.com/Frederick1824

Proyecto de ingeniería de software y AgentOps desarrollado con asistencia de inteligencia artificial.
