# Prompt: investigar 5 propuestas de interfaz para Oh My SIASE (Claude Fable 5.2)

Modelo sugerido: Claude Fable 5.2 con `effort: "high"`, porque es una tarea de investigación larga y sin supervisión. Ejecútalo desde la raíz del repositorio para que pueda leer el código y `docs/siase-ui-rebuild/`.

---

## Tu papel y el problema

Vas a trabajar como investigador de UX y diseñador de producto en Oh My SIASE. Es una extensión de Chrome que rediseña SIASE, el portal escolar de la UANL (`https://deimos.dgi.uanl.mx`). Lee primero `AGENTS.md`, que explica cómo funciona el proyecto.

La interfaz actual no funciona bien para las personas que la usan. En la práctica es un cambio de colores sobre el portal original. La estructura, la navegación y la forma de presentar la información siguen siendo casi las mismas. Muchas vistas son listas de "pills" o tarjetas con mucho texto, y la persona tiene que leer todo para entender qué puede hacer. El resultado no se siente moderno, no ayuda a encontrar tareas y no es cómodo para buena parte del público. En especial, no conecta con las estudiantes mujeres, que son cerca de la mitad de la comunidad.

Tu trabajo es investigar y proponer **cinco direcciones de interfaz distintas** que podríamos implementar. Cada una debe venir con argumentos que expliquen por qué funcionaría. Esta tarea es de investigación y diseño. No cambies código de `src/` ni `dist/`.

## Qué tiene que lograr cada propuesta

1. **Mostrar toda la funcionalidad de SIASE.** Cada elemento, módulo, página, formulario y acción del portal actual tiene que tener un lugar visible y accesible en la propuesta. Nada se puede quedar escondido o perdido. Esto incluye los módulos Escolar, Tesorería, DGPPE, AFI y English UANL, las páginas del header (EXCI, contraseña, clave de seguridad, aviso de privacidad), el selector de carrera, los avisos, los recibos, los servicios que abren en `_new` o `_top` y el cierre de sesión.
2. **Ser intuitiva al primer vistazo.** Una persona que nunca usó la extensión debe poder adivinar qué hace cada elemento sin leer instrucciones. Usa iconografía, jerarquía visual, agrupación por tarea, datos visualizados (progreso, fechas, montos) y estados claros. Evita que la solución sea otra cuadrícula de pills o tarjetas llenas de texto.
3. **Funcionar para todo el público.** Debe resultar atractiva y cómoda tanto para hombres como para mujeres. Apóyate en investigación real sobre diseño inclusivo y preferencias de uso, no en estereotipos. "Hacerlo rosa" no es una respuesta válida. Considera también accesibilidad (contraste, tamaño de texto, uso con teclado, lectores de pantalla) y uso en pantallas pequeñas.
4. **Poder usarla personal docente.** Revisa si SIASE tiene vistas o tareas para docentes (captura de calificaciones, listas de grupo, horarios). El repositorio hoy solo documenta el lado del estudiante. Si no encuentras evidencia, dilo y propón cómo la estructura de cada dirección se adaptaría a un rol docente sin rediseñarla desde cero.
5. **Verse moderna.** Busca referentes actuales de portales universitarios, apps escolares, banca móvil, productividad y otros productos de buena UX. Explica qué tomarías de cada uno.

Haz que las cinco propuestas sean de verdad diferentes entre sí. Puedes partir de patrones como un dashboard de widgets, una navegación centrada en tareas o preguntas ("¿Qué quieres hacer?"), una línea de tiempo del semestre, una barra de comandos con búsqueda o un modelo de app móvil con pestañas. No tienes que usar esos; elige los que mejor resuelvan el problema.

## Restricciones técnicas que las propuestas deben respetar

La extensión mejora el portal, no lo reemplaza. SIASE es una aplicación WebSpeed con un `frameset` (`top`, `left`, `center`) y la sesión viaja en los parámetros de la URL. Cada propuesta tiene que poder construirse respetando estas reglas de `AGENTS.md`:

- Los formularios, los `name` de los inputs y los `target` de SIASE se conservan, porque el portal depende de ellos para navegar. Una propuesta puede esconder el aspecto original y llamar a los elementos nativos, pero no puede enviar formularios clonados ni reconstruir URLs de sesión.
- Toda mejora debe poder apagarse con el interruptor existente (`enhancementsEnabled()`).
- No se agregan peticiones a dominios fuera de la UANL.

Si una idea choca con estas reglas, dilo dentro de la propuesta y explica qué tendría que cambiar para hacerla viable.

## Dónde está el contexto

- `docs/siase-ui-rebuild/README.md` y los archivos que enlaza son el inventario de todas las páginas, endpoints y elementos del portal. Úsalo como lista de verificación de "todo debe verse".
- `docs/siase-ui-rebuild/17-ui-inspiration.md` tiene una investigación previa de referentes (Workday, Ellucian, Blackboard Ultra y otros). Úsala como punto de partida, pero no te limites a ella.
- `manifest.json`, `src/content/` y `src/components/SmartSidebar.tsx` muestran la interfaz actual.
- Puedes buscar en la web para estudios de UX, guías de diseño inclusivo y ejemplos de productos.

## Qué entregar

Escribe el resultado en `docs/siase-ui-rebuild/18-ui-proposals.md`. El documento debe tener:

1. **Diagnóstico de la interfaz actual.** Qué problemas de usabilidad concretos tiene, con ejemplos de páginas reales del repositorio.
2. **Hallazgos de la investigación.** Lo más importante que aprendiste sobre diseño inclusivo, portales académicos y referentes modernos, con enlaces a las fuentes.
3. **Las cinco propuestas.** Para cada una incluye:
   - Nombre y la idea central en una o dos frases.
   - Un prototipo HTML navegable en `docs/siase-ui-rebuild/mockups/<nombre-de-la-propuesta>/`, con un enlace desde el documento. Las reglas del prototipo están en la sección "Prototipos navegables".
   - Cómo se organiza la navegación y dónde vive cada módulo y página de SIASE.
   - Por qué funciona para estudiantes hombres y mujeres, y para docentes, con argumentos apoyados en la investigación.
   - Riesgos, desventajas y el costo aproximado de implementarla en esta extensión.
4. **Matriz de cobertura.** Una tabla con cada página o elemento del portal actual (según el inventario de `docs/siase-ui-rebuild/`) y en qué lugar aparece dentro de cada propuesta. Ninguna fila debe quedar vacía.
5. **Comparación y recomendación.** Una tabla que compare las cinco propuestas en criterios claros (intuición, inclusión, cobertura, uso docente, esfuerzo técnico) y tu recomendación final con su justificación.

No escribas datos personales reales en los mockups ni en el documento. Usa nombres, matrículas y calificaciones ficticias.

## Prototipos navegables

Cada propuesta lleva su propio prototipo en HTML. El objetivo es que una persona pueda abrirlo en el navegador, hacer clic y entender cómo se usaría la interfaz. No buscamos un diseño final pixel por pixel.

- Usa HTML, CSS y JavaScript sin dependencias. Debe abrirse con doble clic (`file://`), sin servidor ni build. No cargues fuentes, librerías ni imágenes de dominios externos. Si necesitas íconos, usa SVG en línea.
- Haz que la navegación funcione. Los menús, pestañas, buscadores y enlaces de la propuesta deben llevar a sus pantallas, ya sea con varias páginas HTML enlazadas o con una sola página que cambie de vista.
- Incluye como mínimo estas pantallas: el inicio, el kardex, el horario, las calificaciones, los recibos o pagos de Tesorería y el selector de carrera. Agrega cualquier otra que ayude a explicar la propuesta.
- Haz que cada página de la matriz de cobertura sea alcanzable desde la navegación del prototipo. Las páginas que no diseñes a detalle pueden ser una pantalla sencilla con su título, su lugar en la navegación y una nota de qué contendría.
- Llena las pantallas con datos ficticios que parezcan reales: materias, horarios, calificaciones, adeudos y avisos.
- Haz que funcione en escritorio y en un ancho de celular (unos 375 px). Debe poder usarse con teclado y tener contraste suficiente.
- Si la propuesta tiene vista para docentes, agrega un selector visible para cambiar entre "Estudiante" y "Docente".
- Crea también `docs/siase-ui-rebuild/mockups/index.html`. Debe enlazar las cinco propuestas con su nombre y la idea central en una línea, para compararlas rápido.

## Cómo trabajar

Antes de empezar, di en una línea lo que vas a hacer. Mientras trabajas, da actualizaciones breves para que se pueda seguir el avance.

Termina la tarea completa. Evita detenerte mientras falte trabajo que se pidió. Si encuentras obstáculos comunes, como una página que no carga, una búsqueda sin resultados o un archivo que no existe, investiga la causa y busca otra fuente o camino antes de parar. Si hay una decisión que de verdad necesita mi respuesta, pregúntala y sigue con la parte del trabajo que no depende de ella.

Al terminar, escribe un resumen corto que se entienda por sí solo: qué encontraste, cuáles son las cinco propuestas, cuál recomiendas y qué sigue.

## Cómo comunicar

Escribe para un lector inteligente que no vio tus búsquedas ni los archivos que abriste. Pon lo más importante en las primeras frases. Usa palabras simples, frases cortas y completas, voz activa, y siempre la misma palabra para la misma cosa. No uses términos ni abreviaturas que inventaste durante el trabajo. Usa párrafos cuando las ideas se conectan y viñetas para listas de elementos separados. Todo el documento va en español.
