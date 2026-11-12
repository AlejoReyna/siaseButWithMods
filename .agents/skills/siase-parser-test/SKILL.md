---
name: siase-parser-test
description: Write or fix a parser for SIASE HTML and its Vitest tests with anonymized fixtures. Use when extracting data (kardex, calificaciones, horario, menú, datos del estudiante) from portal pages or when a parser breaks.
---

# Parsers de SIASE y sus pruebas

## Reglas

- Los parsers viven en `src/utils/parser/` y se exportan desde `src/utils/parser/index.ts`.
- Son funciones puras: reciben un `Document` y regresan datos tipados (`src/types/`). Nada de `chrome.*`, `fetch` ni mutaciones del DOM.
- Usa los helpers de `src/utils/parser/dom.ts` (por ejemplo `textContent`) para normalizar texto.
- SIASE es HTML4 con tablas anidadas: ancla la búsqueda en textos de encabezado estables (como `Sem.` en el kardex) en lugar de índices fijos de tablas.
- Si un valor no se puede leer, regresa `undefined` en vez de inventar un default que parezca real.

## Fixtures

- Guarda el HTML en `src/tests/fixtures/<pagina>.html`.
- **Anonimiza siempre**: reemplaza nombre, matrícula, CURP, correo, foto, calificaciones reales y cualquier parámetro de sesión en URLs o inputs ocultos por valores ficticios.
- Conserva la estructura (tablas, clases, atributos) intacta: es lo que el parser necesita.
- Para casos pequeños puedes construir el documento inline, como en `src/tests/kardex-parser.test.ts`:

```ts
const doc = new DOMParser().parseFromString(`<html><body>…</body></html>`, 'text/html');
```

## Pruebas

- Archivo en `src/tests/<nombre>.test.ts` (Vitest con `globals` y entorno `jsdom`; ver `vite.config.ts`).
- Cubre el caso normal, el caso vacío y la página de sesión expirada (`src/tests/fixtures/session-expired.html`).
- Corre `npm test`.
