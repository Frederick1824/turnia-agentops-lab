# ADR-001 — Testing inicial y extracción mínima de dominio

## Estado

`Accepted`

## Contexto

Las reglas de reserva de TurnIA Barber están parcialmente implementadas dentro de componentes React y parcialmente dentro del contexto global. El primer experimento necesita producir evidencia adversarial reproducible sin introducir infraestructura desproporcionada.

## Decisión

- Utilizar Vitest como framework de testing inicial a partir de la Fase 3.
- Priorizar tests unitarios sobre reglas de dominio.
- Evitar inicialmente tests end-to-end.
- Extraer en una fase posterior sólo la lógica mínima necesaria para probar una reserva sin renderizar React.
- Mantener la arquitectura actual salvo los cambios mínimos autorizados por `EXP-001`.
- No instalar Vitest ni realizar la extracción durante las Fases 0 y 1.

## Alternativas descartadas

### Mantener todas las reglas dentro de React

Obligaría a montar componentes para demostrar reglas que pueden expresarse como funciones puras y mezclaría evidencia de dominio con detalles de interfaz.

### Incorporar Playwright o Cypress desde el inicio

Añadiría costo y complejidad antes de demostrar que el riesgo exige pruebas end-to-end.

### Adoptar Redux u otro gestor global

No resuelve por sí mismo la testabilidad de las reglas y excede el alcance de `EXP-001`.

### Introducir arquitectura hexagonal completa

Sería una inversión anticipada sin evidencia de que el tamaño actual del producto la necesita.

### Crear un backend

Está fuera del experimento y cambiaría el modelo de autoridad y persistencia del producto.

## Consecuencias

### Positivas

- Tests rápidos y deterministas.
- Evidencia centrada en reglas de negocio.
- Menor acoplamiento entre validación y presentación.
- Infraestructura inicial pequeña.

### Costos y límites

- Será necesaria una extracción mínima posterior.
- Los tests unitarios no cubrirán por sí solos navegación, renderizado ni sincronización entre pestañas.
- La decisión deberá revisarse si futuros findings demuestran la necesidad de otro nivel de prueba.
