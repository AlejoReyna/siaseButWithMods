# Cómo contribuir a Oh My SIASE

¡Gracias por tu interés en contribuir!

<!-- Mensaje de bienvenida: por qué existe el proyecto y qué tipo de ayuda buscas. -->

_Por definir._

## Antes de empezar

<!-- ¿Hay que abrir un issue antes de mandar un PR? ¿Cómo se asignan los issues? ¿Dónde se discuten ideas? -->

_Por definir._

## Preparar el entorno

Requisitos: Node.js y npm.

<!-- Versión mínima de Node.js, si quieres fijar una. -->

```bash
git clone https://github.com/AlejoReyna/siaseButWithMods.git
cd siaseButWithMods
npm install
npm run dev
```

Carga la extensión desde `brave://extensions` o `chrome://extensions` con **Cargar descomprimida**.

## Scripts disponibles

| Comando                | Qué hace                                         |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Servidor de desarrollo de Vite + CRXJS           |
| `npm run build`        | Revisión de tipos (`tsc`) y build de producción  |
| `npm test`             | Corre las pruebas con Vitest                     |
| `npm run lint`         | ESLint sobre archivos `.ts` y `.tsx`             |
| `npm run format`       | Formatea el código con Prettier                  |
| `npm run format:check` | Verifica el formato sin modificar archivos       |

## Estructura del proyecto

| Ruta                     | Contenido                                                     |
| ------------------------ | ------------------------------------------------------------- |
| `manifest.json`          | Manifest V3: content scripts, permisos y páginas             |
| `src/background/`        | Service worker, alarmas y notificaciones                      |
| `src/content/`           | Scripts inyectados en cada frame y página de SIASE            |
| `src/content/pages/`     | Mejoras por página (kardex, horario, calificaciones, etc.)    |
| `src/content/styles/`    | CSS inyectado en el portal                                    |
| `src/components/`        | Componentes React compartidos                                 |
| `src/popup/`             | Popup de la extensión                                         |
| `src/utils/parser/`      | Parsers del HTML de SIASE                                     |
| `src/tests/`             | Pruebas de Vitest                                             |
| `docs/siase-ui-rebuild/` | Mapa de las páginas y endpoints del portal SIASE              |

Para más detalle técnico consulta [DEVELOPMENT.md](./DEVELOPMENT.md).

## Ramas y commits

<!-- Nombre de ramas (p. ej. feat/..., fix/...), formato de commits, idioma de commits. -->

_Por definir._

## Pull requests

<!-- Qué debe incluir un PR: descripción, capturas o video, checks que deben pasar, quién revisa, si se debe incluir o no la carpeta dist/. -->

_Por definir._

## Estilo de código

El proyecto ya incluye configuración de ESLint (`.eslintrc.cjs`) y Prettier (`.prettierrc`).

<!-- Convenciones adicionales: idioma de nombres y comentarios, uso de TypeScript, etc. -->

_Por definir._

## Datos personales y sesiones de SIASE

<!-- Reglas sobre no subir matrículas, nombres, cookies, tokens, capturas o HTML con datos reales de estudiantes. -->

_Por definir._

## Reportar bugs y proponer features

<!-- Dónde y cómo: issues, plantillas, qué información incluir (navegador, versión, página de SIASE). -->

_Por definir._

## Reportar vulnerabilidades

<!-- Canal privado para reportes de seguridad, o enlace a SECURITY.md. -->

_Por definir._

## Licencia

<!-- Licencia bajo la que se aceptan las contribuciones. -->

_Por definir._
