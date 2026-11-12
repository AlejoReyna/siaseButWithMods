---
name: siase-page
description: Add or modify the enhancement of a SIASE portal page (kardex, horario, calificaciones, recibos, etc.). Use when a task touches how a specific deimos.dgi.uanl.mx page looks or behaves inside the extension.
---

# Mejorar una página de SIASE

## 1. Identifica la página

- Busca el endpoint en `docs/siase-ui-rebuild/README.md`; el archivo enlazado describe su DOM real.
- Revisa `manifest.json` para saber si ya hay un content script que cubra esa URL.

## 2. Elige el punto de entrada

| Caso                                                              | Dónde registrarla                                                        |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Página `wspd_cgi.sh/*.htm` del frame `center` ya cubierta por `router.ts` | Agrega `{ page, broker, path }` a `SIASE_ENDPOINTS` en `src/utils/siase-url.ts`, el tipo en `src/types/siase.ts`, y la llamada en `routeSiasePage` (`src/content/router.ts`) |
| Selector de carrera, créditos, carga de documentos                | `SERVICE_ROUTES` en `src/content/service-page.ts`                         |
| URL nueva que ningún script cubre                                 | Agrega su patrón a un bloque `content_scripts` existente de `manifest.json`, o crea uno nuevo con su script en `src/content/` |

## 3. Implementa la mejora

Crea o edita `src/content/pages/<nombre>-page.ts`:

```ts
export async function enhanceXPage(frameDocument: Document): Promise<void> {
  frameDocument.body.classList.add('siase-plus-x-page');
  // Lee datos con un parser de src/utils/parser/ y mejora el DOM existente.
}
```

- Respeta `enhancementsEnabled()` (ya lo hacen `router.ts` y `service-page.ts`; si creas un script nuevo, llámalo tú).
- No cambies `action`, `name` ni `target` de formularios y links originales.
- Si guardas datos, usa `setStorageValue` con una llave declarada en `src/types/storage.ts`.

## 4. Estilos

- Agrega reglas en `src/content/styles/center-v2.css` (o el CSS que el manifest inyecte en esa URL), con scope `body.siase-plus-x-page`.
- Usa los tokens de `src/content/theme.ts` en vez de colores fijos.

## 5. Pruebas y verificación

- Agrega `src/tests/<nombre>-page.test.ts` con un fixture anonimizado en `src/tests/fixtures/` (ver skill `siase-parser-test`).
- Corre `npm test`, `npm run lint` y `npm run build`.
