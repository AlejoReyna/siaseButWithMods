# Cómo contribuir a Oh My SIASE

¡Gracias por tu interés en contribuir!

Oh My SIASE es un proyecto hecho por y para estudiantes de la UANL. Cualquier ayuda suma: reportar un bug, mejorar el diseño de una página, corregir un parser o mejorar la documentación.

## Antes de empezar

- **Cambios pequeños** (typos, estilos, bugs evidentes): manda el PR directamente.
- **Cambios grandes** (páginas nuevas, cambios de arquitectura, permisos nuevos en el manifest): abre primero un issue para platicarlo antes de invertir tiempo.
- Si quieres tomar un issue, comenta en él para que no se dupliquen esfuerzos.

## Preparar el entorno

Requisitos: Node.js 20 o superior y npm.

```bash
git clone https://github.com/AlejoReyna/siaseButWithMods.git
cd siaseButWithMods
npm install
npm run dev
```

Carga la extensión desde `brave://extensions` o `chrome://extensions` con **Cargar descomprimida**.

## Scripts disponibles

| Comando                | Qué hace                                        |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo de Vite + CRXJS          |
| `npm run build`        | Revisión de tipos (`tsc`) y build de producción |
| `npm test`             | Corre las pruebas con Vitest                    |
| `npm run lint`         | ESLint sobre archivos `.ts` y `.tsx`            |
| `npm run format`       | Formatea el código con Prettier                 |
| `npm run format:check` | Verifica el formato sin modificar archivos      |

## Estructura del proyecto

| Ruta                     | Contenido                                                  |
| ------------------------ | ---------------------------------------------------------- |
| `manifest.json`          | Manifest V3: content scripts, permisos y páginas           |
| `src/background/`        | Service worker, alarmas y notificaciones                   |
| `src/content/`           | Scripts inyectados en cada frame y página de SIASE         |
| `src/content/pages/`     | Mejoras por página (kardex, horario, calificaciones, etc.) |
| `src/content/styles/`    | CSS inyectado en el portal                                 |
| `src/components/`        | Componentes React compartidos                              |
| `src/popup/`             | Popup de la extensión                                      |
| `src/utils/parser/`      | Parsers del HTML de SIASE                                  |
| `src/tests/`             | Pruebas de Vitest y fixtures HTML                          |
| `docs/siase-ui-rebuild/` | Mapa de las páginas y endpoints del portal SIASE           |

Para más detalle técnico consulta [DEVELOPMENT.md](./DEVELOPMENT.md).

## Ramas y commits

- Crea tu rama desde `main` con un prefijo según el tipo de cambio:
  - `feat/…` para funcionalidades nuevas
  - `fix/…` para correcciones
  - `docs/…` para documentación
  - `style/…` para cambios visuales o de CSS
  - `refactor/…` para reorganizar código sin cambiar comportamiento
- Usa [Conventional Commits](https://www.conventionalcommits.org/es/): `feat: agrega vista de kardex`, `fix: corrige promedio con materias de laboratorio`.
- Commits cortos, en imperativo y en español o inglés (pero no mezcles idiomas dentro del mismo PR).

## Pull requests

Antes de abrir tu PR, asegúrate de que pase todo esto:

```bash
npm test
npm run lint
npm run format:check
npm run build
```

Tu PR debe incluir:

- Una descripción breve de qué cambia y por qué.
- El issue relacionado, si existe (`Closes #12`).
- **Capturas o un video corto** si cambias algo visual, con los datos personales tapados.
- Pruebas nuevas o actualizadas si tocas un parser o la lógica de una página.

Además:

- **No incluyas cambios en `dist/`.** El mantenedor regenera el build antes de cada versión.
- Un PR por tema. Si arreglas dos cosas sin relación, abre dos PRs.
- Todo PR necesita la aprobación de un mantenedor antes del merge.

## Estilo de código

El proyecto ya incluye configuración de ESLint (`.eslintrc.cjs`) y Prettier (`.prettierrc`); corre `npm run format` antes de hacer commit.

- TypeScript en todo el código nuevo; evita `any`.
- Nombres de variables y funciones en inglés; los textos que ve el estudiante, en español.
- Los estilos inyectados deben ir con prefijo (`siase-…`) para no chocar con el CSS original de SIASE.
- No rompas los formularios ni la navegación original del portal: la extensión mejora SIASE, no lo reemplaza.

## Datos personales y sesiones de SIASE

Esta extensión trabaja con información sensible de estudiantes. Por eso:

- **Nunca subas datos reales**: matrículas, nombres, calificaciones, CURP, fotos, cookies, tokens de Nexus ni URLs con parámetros de sesión.
- Los fixtures HTML de `src/tests/fixtures/` deben usar datos ficticios. Si copias el HTML de una página real, reemplaza cualquier dato personal antes de hacer commit.
- Tapa los datos personales en capturas y videos.
- La extensión no debe enviar información del estudiante a servidores externos. Cualquier petición nueva fuera de los dominios de la UANL debe discutirse antes en un issue.

## Reportar bugs y proponer features

Abre un [issue](https://github.com/AlejoReyna/siaseButWithMods/issues) e incluye:

- **Bugs:** navegador y versión, versión de la extensión, página de SIASE donde ocurre, pasos para reproducirlo, qué esperabas y qué pasó. Si puedes, agrega una captura con tus datos tapados.
- **Features:** qué problema resuelve, en qué página de SIASE, y una idea de cómo se vería.

## Reportar vulnerabilidades

Si encuentras un problema de seguridad (por ejemplo, algo que exponga la sesión o los datos de un estudiante), **no abras un issue público**. Repórtalo de forma privada desde la pestaña **Security → Report a vulnerability** del repositorio.

## Licencia

Al contribuir, aceptas que tu código se publique bajo la misma licencia del repositorio.
