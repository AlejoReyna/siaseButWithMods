# AGENTS.md

Instrucciones para agentes de IA (Claude Code, Codex, Cursor, Copilot, Gemini CLI, etc.) que trabajan en este repositorio. Las personas deben leer [CONTRIBUTING.md](./CONTRIBUTING.md).

## Qué es este proyecto

Oh My SIASE es una extensión de navegador (Manifest V3, Chromium) que rediseña el portal estudiantil SIASE de la UANL (`https://deimos.dgi.uanl.mx`). SIASE es una aplicación OpenEdge/WebSpeed renderizada en servidor con un `frameset` raíz (`top`, `left`, `center`). Todo es del mismo origen, así que los content scripts pueden coordinarse entre frames. La sesión viaja en los parámetros de la URL.

Stack: TypeScript, Vite + `@crxjs/vite-plugin`, React (popup, sidebar), Zustand, Tailwind/PostCSS, Vitest + jsdom.

## Comandos

```bash
npm install
npm run dev            # build de desarrollo (carga dist/ como extensión descomprimida)
npm run build          # tsc --noEmit + vite build
npm test               # vitest run
npm run lint
npm run format:check
```

Antes de dar una tarea por terminada corre `npm test`, `npm run lint` y `npm run build`.

## Mapa del código

| Ruta                                | Qué hay                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `manifest.json`                     | Qué script y CSS se inyecta en cada URL de SIASE. Es la fuente de verdad de qué está activo |
| `src/content/frameset-injector.ts`  | Se ejecuta en `default.htm` (frameset raíz)                                               |
| `src/content/top-frame.ts`          | Header; incluye el interruptor para activar/desactivar mejoras                            |
| `src/content/left-frame.ts`         | Menú lateral (`src/components/SmartSidebar.tsx`)                                          |
| `src/content/center-frame.ts`       | Frame central; `center-ui.ts` arma el dashboard                                           |
| `src/content/router.ts`             | Despacha páginas `wspd_cgi.sh` registradas en `SIASE_ENDPOINTS` (`src/utils/siase-url.ts`) |
| `src/content/service-page.ts`       | Despacha selector de carrera, créditos y carga de documentos (`SERVICE_ROUTES`)            |
| `src/content/receipt-page.ts`       | Recibos (entrada propia en el manifest)                                                   |
| `src/content/pages/*.ts`            | Una función `enhance…Page(frameDocument)` por página                                       |
| `src/content/styles/*.css`          | CSS inyectado; `*-v2.css` es el actual                                                    |
| `src/content/theme.ts`              | Tokens de tema aplicados al `body`                                                        |
| `src/utils/parser/`                 | Parsers puros del HTML de SIASE (kardex, calificaciones, horario, menú, estudiante)       |
| `src/background/`                   | Service worker, alarmas, monitor de calificaciones y notificaciones                       |
| `src/popup/`, `src/historia/`       | Popup y página de historia del proyecto                                                   |
| `src/tests/` + `src/tests/fixtures/`| Pruebas Vitest y HTML de ejemplo                                                          |
| `docs/siase-ui-rebuild/`            | Auditoría de cada página/endpoint del portal real: empieza por su `README.md`             |

## Convenciones

- Cada mejora de página agrega una clase al `body` (`siase-plus-…`) y estiliza bajo ese scope. Las clases nuevas usan prefijo `siase-plus-` o `siase-v2-`.
- No reemplaces formularios, `name`s de inputs ni `target`s de SIASE: el portal depende de ellos para navegar. Mejora el DOM, no lo sustituyas.
- Toda mejora debe respetar `enhancementsEnabled()` (`src/utils/enhancements.ts`).
- Los parsers son funciones puras que reciben un `Document`; la lógica de DOM y `chrome.*` va en `src/content/` o `src/background/`.
- Persistencia vía `getStorageValue` / `setStorageValue` (`src/utils/storage.ts`) con las llaves tipadas en `src/types/storage.ts`.
- Nombres en inglés; textos visibles para el estudiante en español.
- Para recetas paso a paso usa las skills de `.agents/skills/`.

## Datos personales (obligatorio)

- Nunca escribas en el repo matrículas, nombres, calificaciones, CURP, fotos, cookies, tokens de Nexus ni query strings de sesión reales.
- Los fixtures de `src/tests/fixtures/` deben contener datos ficticios. Si partes de HTML real, anonimízalo antes de guardarlo.
- No agregues peticiones a dominios fuera de la UANL ni nuevos `host_permissions` sin que la persona lo pida explícitamente.

## Cosas que confunden

- **`dist/` está en git** y es lo que se instala. No lo edites a mano ni lo incluyas en PRs salvo que te lo pidan.
- **`src/content/career-landing.ts` no se carga**: no está en el manifest ni lo importa ningún script activo desde el rebuild. Su widget de Nexus, la exportación `.ics` y el selector de temas no están activos. No lo tomes como referencia del comportamiento actual.
- **Firefox no está soportado**: el manifest solo declara `background.service_worker`.
- Las dependencias en `package.json` usan `latest`; si algo deja de compilar tras `npm install`, sospecha de una versión nueva.
- `.agents/context/` contiene prompts y notas de sesiones anteriores. Son históricos: verifica contra el código antes de confiar en ellos.

## Contexto adicional

| Archivo                                                     | Contenido                                                              |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)              | Diagramas de inyección, flujo de datos y capas del código              |
| [DEVELOPMENT.md](./DEVELOPMENT.md)                          | Referencia técnica y bitácora del proyecto                            |
| [docs/siase-ui-rebuild/](./docs/siase-ui-rebuild/README.md) | Mapa de páginas, endpoints y DOM del portal SIASE                      |
| `.agents/context/notes/eselcarrera-reference.md`            | Referencia de `eselcarrera.htm` y patrones de subpáginas               |
| `.agents/context/notes/nexus-widget-debug.md`               | Cómo funcionaba el widget de Nexus (código hoy inactivo)               |
| `.agents/context/notes/project-updates.md`                  | Bitácora antigua (abril 2026)                                          |
| `.agents/context/prompts/`                                  | Prompts usados para implementar features: kardex, avisos, carrera, etc. |
