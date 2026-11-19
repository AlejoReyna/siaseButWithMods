# Cinco propuestas de interfaz para Oh My SIASE

Fecha de la investigación: 15 de noviembre de 2026. Este documento es de investigación y diseño. No cambia código de `src/`, `dist/` ni `manifest.json`.

Los prototipos navegables están en [mockups/index.html](mockups/index.html). Se abren con doble clic.

## Resumen

La interfaz actual cambia el aspecto de SIASE, pero conserva su organización. El menú agrupa las páginas con una expresión regular sobre el nombre oficial, y por eso 19 de las 39 páginas de Escolar terminan en "Otros servicios". Solo 15 de las 68 páginas del portal reciben algún tratamiento. El inicio pide abrir otras páginas antes de mostrar datos.

La investigación apunta a tres causas que una nueva interfaz debe atacar: nombres escritos para la institución y no para quien los lee, navegación que esconde opciones, y una sola forma de usar el portal. La evidencia sobre diseño inclusivo dice que las diferencias entre personas están en cómo procesan información, cuánto riesgo aceptan y cómo aprenden una herramienta, y que un diseño que cubre esos estilos mejora el resultado de mujeres y de hombres.

Las cinco propuestas son:

| Propuesta | Idea central | Prototipo |
|---|---|---|
| 1. Mi Semestre | Todo se ordena por fecha: hoy, esta semana y el semestre | [mockups/mi-semestre/](mockups/mi-semestre/index.html) |
| 2. Paso a Paso | El inicio pregunta qué quieres hacer y una guía te lleva | [mockups/paso-a-paso/](mockups/paso-a-paso/index.html) |
| 3. Tablero Vivo | Cada área es un widget con su dato más importante | [mockups/tablero-vivo/](mockups/tablero-vivo/index.html) |
| 4. Busca y Listo | Un buscador que responde, más el directorio completo | [mockups/busca-y-listo/](mockups/busca-y-listo/index.html) |
| 5. SIASE de Bolsillo | Cinco pestañas fijas, como una app de banco | [mockups/siase-de-bolsillo/](mockups/siase-de-bolsillo/index.html) |

Recomiendo implementar primero **Paso a Paso**. Es la que mejor responde a la evidencia de diseño inclusivo, la que menos depende de datos que la extensión todavía no sabe leer y la de menor riesgo técnico dentro del `frameset`. Después conviene sumarle el buscador de la propuesta 4 y el bloque "Hoy" de la propuesta 1. La justificación completa está en la sección 6.

Esta recomendación es una hipótesis razonada. Nadie ha probado los prototipos con estudiantes ni con docentes. La sección 7 propone una prueba corta antes de escribir código.

## 1. Diagnóstico de la interfaz actual

Revisé `manifest.json`, `src/content/`, `src/components/SmartSidebar.tsx` y `src/utils/parser/menu.ts`. Estos son los problemas concretos.

### 1.1 El menú agrupa por coincidencia de texto, no por tarea

`inferCategory()` en `src/utils/parser/menu.ts:4` asigna cada enlace a una categoría con expresiones regulares sobre el nombre oficial. Apliqué esa función a los 39 nombres de Escolar que lista el inventario (archivos 05 a 11) y el resultado fue este:

| Categoría que ve la persona | Páginas | Problema |
|---|---|---|
| Otros servicios | 19 | Aquí caen Inscripción, Pre-Inscripción, Consulta fecha de inscripción, Créditos, Carga de documentos, Registro IMSS, todas las encuestas y Prácticas Profesionales |
| Finanzas | 6 | Incluye las tres páginas de becas |
| Académico | 5 | Incluye tres recibos, porque "Servicios Académicos" coincide con `acad` |
| Trámites | 4 | No incluye "Trámites DEyA": la expresión busca `tramite` sin acento |
| Perfil | 4 | |
| Horario | 1 | Una categoría con un solo elemento |

La mitad del menú queda en una categoría que no dice nada. Los recibos de la cuota aparecen bajo "Académico" y no bajo "Finanzas".

### 1.2 Todo está cerrado al llegar

`SmartSidebar.tsx:61` inicia los seis grupos cerrados. La persona ve seis nombres con un contador y debe abrir cada uno para saber qué contiene. Nielsen Norman Group midió que la navegación oculta se usa casi la mitad de veces que la visible en escritorio (sección 2.3).

### 1.3 Los nombres son los de la institución

Los enlaces conservan el texto original de SIASE. "Recibo Interno de Servicios Académicos y Escolares" y "Recibo de Servicios Académicos y Escolares" se distinguen por una palabra. "Inscripción 1er. Ingreso Super", "Trámites DEyA", "DGPPE", "AFI" y "EXCI" no explican qué hacen. El menú mide 264 px, así que los nombres largos se cortan.

### 1.4 El menú solo muestra un módulo a la vez

El menú lateral se arma con los enlaces del módulo activo, que al entrar es Escolar. Tesorería, DGPPE, AFI y English UANL siguen como enlaces del encabezado que recargan el marco izquierdo (`src/content/top-frame.ts`). Una estudiante que busca "factura" en el buscador del menú no la encuentra, porque esa página vive en otro módulo.

### 1.5 El inicio pide trabajo antes de dar información

`src/content/center-ui.ts` arma el inicio con datos guardados en visitas anteriores. Si la persona no ha abierto Horario o Calificaciones, ve "Abre Horario para sincronizar tus clases" (línea 470), "Abre Calificaciones para sincronizar resultados" (línea 498) y "Por sincronizar" (líneas 272 y 755). El bloque "Requiere tu atención" muestra tres filas fijas con las etiquetas "Revisar", "Consultar" y "Abrir" (líneas 430 a 432). Esas etiquetas no reflejan si de verdad hay un documento pendiente o un recibo por pagar.

Cada sección del inicio trae un control para arrastrarla y dos botones para subirla o bajarla (línea 781 en adelante). La investigación previa del propio repositorio (`17-ui-inspiration.md`) recomendaba no ofrecer widgets configurables en la primera versión.

### 1.6 Los símbolos no comunican

Los enlaces que abren otra ventana o reemplazan la pantalla se marcan con "＋" y "↗" sin texto (`SmartSidebar.tsx:144`). El interruptor para ver SIASE original es un botón con el símbolo "◐" (`top-frame.ts:14`). Las métricas del inicio usan "◇", "☆", "▣" y "◉" como íconos. Ninguno se puede adivinar al primer vistazo.

### 1.7 La mayoría de las páginas no cambia

El inventario tiene 68 páginas y elementos. El manifiesto inyecta código en 15. De esas, `enrollment-dates-page.ts` y `student-status-page.ts` tienen una línea y `personal-data-page.ts` tiene tres. Al entrar a casi cualquier trámite, la persona pasa de un menú nuevo a una tabla de SIASE sin tratamiento. El cambio de aspecto rompe la sensación de estar en un mismo producto.

### 1.8 El ancho de la pantalla no se aprovecha ni se adapta

`single-view-layout.ts:11` fija el encabezado en 70 px y el menú en 264 px, o 72 px contraído. El CSS del marco central sí tiene puntos de quiebre, pero el `frameset` no cambia de forma. En una ventana de 375 px, el menú abierto deja 111 px para el contenido.

### 1.9 El lenguaje supone un solo tipo de persona

SIASE dice "Subir Foto del Alumno" y la extensión lo repite. La comunidad tiene 52 % de mujeres (sección 2.2) y además hay docentes.

## 2. Hallazgos de la investigación

### 2.1 Diseño inclusivo: lo que importa es el estilo de uso

GenderMag es un método de la Universidad Estatal de Oregón, basado en décadas de estudios, para encontrar problemas de inclusión en software. Identifica cinco aspectos en los que las personas difieren al usar tecnología, y en los que mujeres y hombres se distribuyen de forma distinta en promedio ([fundamentos de GenderMag](https://gendermag.org/foundations.php), [Burnett y otros, 2016](https://openaccess.city.ac.uk/id/eprint/14031/)):

| Aspecto | Un extremo | El otro extremo | Consecuencia para SIASE |
|---|---|---|---|
| Motivación | Usa la tecnología para terminar una tarea | Disfruta explorar la tecnología | Organizar por tarea, no por módulo |
| Procesamiento de información | Reúne toda la información antes de actuar | Actúa con la primera opción prometedora | Ofrecer la vista completa y también el atajo |
| Confianza con la tecnología | Baja ante tareas nuevas; se culpa si algo falla | Alta; culpa al software | Mensajes que explican el estado sin culpar |
| Actitud ante el riesgo | Evita funciones cuyo resultado no conoce | Prueba sin preocuparse | Decir qué va a pasar antes de cada acción |
| Forma de aprender | Paso a paso, con guías | Probando y explorando | Dar guías y permitir saltárselas |

El método advierte que quienes desarrollan software suelen diseñar para el segundo extremo de cada fila. El primer extremo es más frecuente entre mujeres, pero ambos extremos existen en todos los géneros. Por eso la respuesta correcta es cubrir los dos, y no crear una versión "para mujeres".

Un estudio de Microsoft Research puso esto a prueba. El equipo corrigió los problemas de inclusión que el método encontró en un buscador académico y comparó ambas versiones con participantes. En la versión corregida las mujeres tuvieron más éxito, los hombres también mejoraron y la diferencia entre ambos desapareció ([Vorvoreanu y otros, CHI 2019](https://www.microsoft.com/en-us/research/publication/from-gender-biases-to-gender-inclusive-design-an-empirical-investigation/)).

### 2.2 Estética y lenguaje: evidencia débil, decisiones prudentes

- **La comunidad.** La UANL reporta 52 % de mujeres y 48 % de hombres entre 221,576 estudiantes, y 7,123 personas en su planta académica ([Secretaría de Sustentabilidad de la UANL, con datos del informe 2025](https://sds.uanl.mx/en/identidad-institucional/)).
- **Color.** Hurlbert y Ling encontraron que el azul es el color preferido de mujeres y de hombres. Las mujeres se inclinan hacia azules rojizos y violetas, y los hombres hacia azules verdosos ([resumen en ScienceDaily](https://www.sciencedaily.com/releases/2007/08/070820120720.htm)). Una paleta de azules, índigos y verdes azulados queda dentro del gusto compartido. El rosa como señal de "esto es para mujeres" no tiene respaldo.
- **Estilo visual.** Moss y Gunn encontraron diferencias en el estilo de sitios hechos por mujeres y por hombres, y una preferencia por los del propio género ([estudio de 2007](https://www.iiisci.org/journal/PDV/sci/pdfs/I196XFB.pdf)). Sus muestras son pequeñas y de estudiantes, y otros trabajos encuentran diferencias mínimas. La conclusión prudente es no asumir un gusto por género y ofrecer temas a elegir.
- **Lenguaje.** Las orientaciones de Naciones Unidas para el español recomiendan sustantivos sin marca de género y hablar de tú a quien lee ([guía de la ONU](https://www.un.org/es/gender-inclusive-language/guidelines.shtml)). En la práctica: "estudiante" y "docente" en lugar de "alumno" y "maestro", "Hola, Daniela" en lugar de "Bienvenido".
- **Color y visión.** Los hombres tienen un riesgo mucho mayor de deficiencia en la visión del color ([National Eye Institute](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)). Ningún estado debe depender solo del color. En los prototipos cada estado lleva ícono y texto.

### 2.3 Navegación: lo visible gana

- **Navegación oculta.** En un estudio con 179 participantes, las personas usaron el menú oculto en 27 % de los casos en escritorio. Con navegación visible lo usaron en 48 %. Ocultar la navegación también hizo las tareas más lentas y más difíciles, y el daño fue mayor en escritorio que en celular ([Nielsen Norman Group](https://www.nngroup.com/articles/hamburger-menus/)).
- **Tarjetas contra listas.** Las tarjetas se recorren peor que una lista cuando la persona busca algo específico, porque cada dato cambia de lugar. Funcionan bien para resumir contenidos de tipos distintos, como en un tablero ([Nielsen Norman Group](https://www.nngroup.com/articles/cards-component/)). Esto explica por qué una cuadrícula de tarjetas con texto no ayuda a encontrar un trámite.
- **Una cosa por página.** El equipo del gobierno británico encontró que los formularios con una pregunta por pantalla funcionan mejor como punto de partida, ayudan a concentrarse y simplifican los errores ([GOV.UK](https://designnotes.blog.gov.uk/2015/07/03/one-thing-per-page/)). Es evidencia de pruebas con usuarios, no un estudio académico.
- **Barra de comandos.** El buscador con atajo de teclado es rápido para quien ya sabe qué quiere, pero depende de que la persona recuerde palabras y de que sepa que el buscador existe. Las guías de diseño recomiendan acompañarlo siempre con un punto de entrada visible ([historia y límites del patrón](https://www.command.ai/blog/command-palette-past-present-and-future/), [guía de Superhuman](https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/)). Son textos de profesionales, no estudios controlados.

### 2.4 Portales universitarios: pocas tareas, ligadas al calendario

- **MyUW, Universidad de Washington.** El equipo investigó con grupos focales, entrevistas, una encuesta a más de 400 estudiantes y un diario de 12 semanas. Encontró saturación por exceso de enlaces (una página tenía 52), uso frecuente de un grupo pequeño de funciones y un patrón que se repite cada periodo: el trabajo de un estudiante depende de las fechas. Los estudiantes pidieron más contenido personal, menos texto y una versión para celular ([Campus Technology, 2019](https://campustechnology.com/articles/2019/05/23/how-user-centered-design-improves-the-student-experience.aspx)).
- **Tareas principales.** El método de Gerry McGovern pide identificar las pocas tareas que más importan y evitar que las tareas pequeñas las tapen ([Smashing Magazine](https://www.smashingmagazine.com/2022/05/top-tasks-focus-what-matters-must-defocus-what-doesnt/)). Una universidad que lo aplicó concluyó que lo primero es que las tareas principales sean fáciles de localizar ([Queen's University Belfast](https://blogs.qub.ac.uk/digitallearning/blog/understanding-what-really-matters-to-students)).
- **Canvas.** Su vista de lista ordena todos los pendientes por fecha y por materia, con marca de completado ([Emory](https://scholarblogs.emory.edu/digitalmatters/?p=929)).
- **Referentes previos.** `17-ui-inspiration.md` ya cubre Workday, Ellucian, Blackboard, CETYS y otros. De ahí conservo la idea de separar "requiere tu acción" de los avisos generales.

### 2.5 Pantallas pequeñas y accesibilidad

- En México, 97.2 % de las personas usuarias de internet se conecta con celular y 35.9 % con computadora ([INEGI, ENDUTIH 2024](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2025/endutih/ENDUTIH_24_RR.pdf)).
- Hay un límite que el diseño no resuelve: esta extensión es para Chromium de escritorio, y Chrome para Android no instala extensiones. "Pantalla pequeña" significa hoy ventanas angostas, laptops chicas y texto ampliado. El uso en celular real depende de una decisión de producto que está fuera de este documento.
- WCAG 2.2 pide zonas de toque de al menos 24 por 24 px y que el elemento con foco no quede tapado ([W3C](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)). Los prototipos usan 44 px en los controles principales.

### 2.6 Referentes modernos y qué tomo de cada uno

| Referente | Qué tomo | Dónde lo uso |
|---|---|---|
| MyUW | Contenido que cambia según la fecha del periodo | Propuesta 1 |
| Canvas, vista de lista | Pendientes ordenados por fecha con estado | Propuestas 1 y 5 |
| GOV.UK | Una cosa por página, lenguaje llano, pasos numerados | Propuesta 2 |
| Workday y UBC | Bloque "requiere tu acción" separado de los avisos | Propuestas 2 y 3 |
| Ellucian Experience | Tarjetas independientes por sistema | Propuesta 3 |
| Linear, Slack, Superhuman | Buscador con atajo que también ejecuta | Propuesta 4 |
| Nubank | Saldo y acciones a la vista en el inicio ([blog de diseño](https://building.nubank.com/design-at-scale-how-to-maintain-excellence-when-your-product-never-stops-growing/)) | Propuesta 5 |

Nubank también sirve de advertencia: personas usuarias comentan que la app perdió sencillez al sumar productos. Un inicio que crece sin criterio termina igual que el menú actual.

### 2.7 Docentes: sí usan SIASE, pero el repositorio no lo documenta

El catálogo de servicios de la Dirección de Tecnologías y Desarrollo Digital de la UANL confirma que los docentes entran a SIASE por los servicios en línea. Ahí pueden consultar y actualizar datos personales, consultar el horario de clase y las listas de clase, capturar calificaciones parciales y finales, dar seguimiento a tutorías, llenar encuestas y actualizar su expediente para estímulos ([SIASE Escolar](https://www.uanl.mx/utilerias/serviciosdgi/siase/escolar-dependencias.html), [SIASE Recursos Humanos](https://www.uanl.mx/utilerias/serviciosdgi/siase/Recursos_Humanos.html)). Un instructivo de 2016 alojado en el mismo servidor describe la captura de la minuta con número de empleado ([PDF](http://deimos.dgi.uanl.mx/uanlimg/2305/IndicacionesCapturaCalificaciones.pdf)).

En el repositorio no hay ninguna página docente auditada. Las únicas pistas son una función llamada `DesMensajeMaestros()` en la página del selector de carrera y un campo de tipo de usuario, ambas descritas en `.agents/context/notes/eselcarrera-reference.md`. No sé si el portal docente usa el mismo `frameset`, los mismos nombres de marco ni qué direcciones tiene.

Por eso las pantallas docentes de los prototipos son una hipótesis construida con el catálogo. Antes de implementarlas hace falta una auditoría como la de julio de 2026, hecha con una cuenta docente.

## 3. Lo que comparten las cinco propuestas

### 3.1 Reglas técnicas que todas respetan

1. **La navegación se delega.** Cada enlace de la interfaz nueva guarda en memoria una referencia al enlace original de SIASE y lo activa con un clic. No se reconstruyen direcciones ni se copian parámetros de sesión.
2. **Los formularios son los originales.** La interfaz puede cambiar su aspecto y activar sus botones. Nunca envía un formulario clonado ni avanza por la persona en pagos, inscripción, bajas, encuestas o cargas de archivos.
3. **Todo se puede apagar.** El interruptor existente sigue visible, ahora con texto: "Ver la versión original de SIASE".
4. **No hay dominios nuevos.** Ninguna propuesta pide datos fuera de la UANL.

### 3.2 Tres problemas técnicos que todas deben resolver

**Reunir cinco módulos en una sola navegación.** Las cinco propuestas muestran juntas las páginas de Escolar, Tesorería, DGPPE, AFI y English UANL. En SIASE, las páginas de un módulo solo existen en el menú izquierdo después de activar ese módulo en el encabezado. Para abrir "Solicitud de Facturas" la extensión tendría que activar el enlace original "Tesorería", esperar a que el marco izquierdo cargue y entonces activar el enlace original de la página. Es viable sin reconstruir direcciones, pero exige que la navegación nueva sobreviva a la recarga del marco izquierdo. La forma más segura es dibujarla en el marco superior o volver a montarla al terminar la carga. Este es el mayor riesgo técnico común y conviene probarlo antes que cualquier diseño.

**Saber qué páginas existen antes de visitarlas.** La extensión necesita un catálogo fijo con el nombre oficial, el nombre llano y el grupo de cada página. El archivo `mockups/shared/data.js` ya es ese catálogo. Dos reglas evitan que algo se pierda: un enlace que SIASE entrega y el catálogo no conoce aparece en un grupo "Otras opciones de SIASE", y una página del catálogo que SIASE no entrega a esa persona se muestra como "No disponible para ti ahora".

**Mostrar datos sin romper la privacidad.** Los prototipos muestran datos en el inicio. Hoy la extensión solo tiene una parte:

| Dato en los prototipos | Estado actual en la extensión |
|---|---|
| Clases de hoy y horario | Disponible después de abrir Horario una vez |
| Promedio y créditos | Disponible después de abrir Kardex una vez |
| Calificaciones publicadas | Disponible después de abrir Calificaciones; el lector actual es frágil |
| Fecha de inscripción | La página tiene los dos valores; falta el lector |
| Documentos pendientes | La página tiene tabla y barra de avance; falta el lector |
| Adeudo y vencimiento de recibos | **Choca con una regla actual.** `11-receipts-audit.md` prohíbe leer o guardar montos |
| Encuestas abiertas, eventos AFI, nivel de inglés | Páginas sin auditar; no sé si el dato existe |
| Fechas de exámenes y del calendario escolar | No están en SIASE; llegan como avisos en PDF |

Para mostrar el adeudo en el inicio habría que cambiar la regla de recibos: leer el monto en el momento, tenerlo solo en memoria y no guardarlo. Esa decisión es tuya. Mientras no se tome, cada propuesta tiene una versión degradada que muestra un enlace con nombre claro, por ejemplo "Revisa tus recibos", en lugar del monto.

La regla de diseño para todas: un bloque sin dato muestra a dónde ir y nunca dice "Por sincronizar".

### 3.3 Cómo se adaptan a docentes

Todas separan dos capas: el catálogo de páginas por rol y la forma de navegar. Cambiar de rol cambia el catálogo y deja igual la navegación. En los prototipos lo muestra el selector Estudiante y Docente de la franja superior. En la extensión real el rol se detectaría por el menú que SIASE entrega, sin preguntar.

## 4. Las cinco propuestas

Los costos son estimaciones gruesas para una persona que ya conoce el repositorio. Incluyen pruebas con Vitest y no incluyen la auditoría docente.

### Propuesta 1. Mi Semestre

**Idea central.** El portal se ordena por tiempo. El inicio responde qué toca hoy y qué vence esta semana, y una regla con las 20 semanas del semestre muestra en qué punto vas.

**Prototipo.** [mockups/mi-semestre/index.html](mockups/mi-semestre/index.html)

**Navegación y lugar de cada módulo.**

- La regla del semestre queda fija arriba. Marca la semana actual y las semanas con fechas pendientes, y lleva a "Mi semestre".
- Cuatro secciones: Hoy, Mi semestre, Pagos y Todo SIASE.
- "Hoy" muestra las clases del día en una línea de tiempo, los pendientes de la semana y lo que viene. A un lado están el promedio, los créditos, el adeudo y los avisos.
- "Todo SIASE" contiene las 68 páginas en cinco grupos según cuándo se usan: antes de empezar el semestre, durante, al cerrarlo, en cualquier momento y tu cuenta. Tiene un filtro de texto.
- Los módulos no se muestran como módulos. Tesorería queda repartida entre "Antes de empezar" y "En cualquier momento", English UANL entre "Durante" y "Al cerrar", AFI en "Durante" y DGPPE en "En cualquier momento".
- El selector de carrera está en el encabezado, junto al nombre. Las páginas del encabezado original y Salir están en el grupo "Tu cuenta".

**Por qué funciona.**

- Coincide con el hallazgo más sólido sobre portales: el trabajo de un estudiante depende de las fechas y se repite cada periodo (MyUW).
- Para quien usa el portal para cumplir tareas, el inicio ya es la lista de tareas. Para quien evita el riesgo, ver las fechas reduce el miedo a que algo se pase.
- Para quien quiere ver todo antes de actuar existe "Mi semestre" completo. Para quien actúa con lo primero que ve, el pendiente urgente está arriba.
- Para docentes el modelo encaja bien, porque su trabajo en SIASE también tiene fechas: captura de parciales, captura de finales y entrega de minutas.

**Riesgos y desventajas.**

- Es la propuesta que más depende de datos. Sin fechas, la línea de tiempo queda vacía y solo sirve "Todo SIASE".
- Las fechas de exámenes y del calendario escolar no están en SIASE. Habría que mantener a mano un archivo por semestre dentro del repositorio.
- Mostrar vencimientos de recibos choca con la regla de no leer montos (sección 3.2).
- Agrupar por momento es una idea nueva. Alguien que busca "Solicitud de Facturas" puede dudar entre dos grupos. El filtro lo compensa.

**Costo aproximado.** Alto: 6 a 8 semanas. Requiere lectores nuevos para fecha de inscripción, documentos y recibos, el archivo de calendario y la regla del semestre en el marco superior.

### Propuesta 2. Paso a Paso

**Idea central.** El inicio pregunta "¿Qué quieres hacer hoy?" y ofrece nueve tareas escritas como las diría una persona. Las tareas con varios pasos tienen una guía que lleva hasta la página original correcta.

**Prototipo.** [mockups/paso-a-paso/index.html](mockups/paso-a-paso/index.html)

**Navegación y lugar de cada módulo.**

- Una sola columna. Arriba, "Empieza por esto" con lo que tiene fecha cerca.
- Nueve tareas: ver cómo voy en la carrera, inscribirme, pagar o imprimir un recibo, pedir o revisar una beca, entregar un documento o hacer un trámite, participar en una actividad, contestar una encuesta, ver mi avance de inglés y cambiar algo de mi cuenta.
- Cada tarea abre una lista. Cada fila dice qué hace la página en lenguaje llano y, debajo, su nombre oficial en SIASE.
- Tres guías de ejemplo: pagar un recibo, inscribirme y, para docentes, capturar calificaciones. Cada guía tiene tres pasos numerados y termina en un botón o una página original.
- "Todas las opciones" muestra las 68 páginas en una sola pantalla.
- "Respuestas rápidas" da cinco datos sin abrir nada: siguiente clase, promedio, adeudo, fecha de inscripción y avisos.
- Tesorería vive dentro de "Pagar", English UANL dentro de "Ver mi avance de inglés", AFI dentro de "Participar" y DGPPE dentro de "Contestar una encuesta". EXCI, Contraseña, Clave de Seguridad, Aviso de Privacidad, el selector de carrera y Salir están en "Cambiar algo de mi cuenta". Salir y el cambio de carrera también están siempre visibles arriba.
- Cada página termina con "¿Qué sigue?", que enlaza las páginas de la misma tarea.

**Por qué funciona.**

- Ataca la causa principal del diagnóstico: los nombres. La persona lee "Imprimir el recibo de la cuota de mi facultad" y debajo "Recibo Interno de Servicios Académicos y Escolares".
- Cubre los cinco aspectos de GenderMag. Organiza por tarea. Ofrece guías a quien aprende paso a paso y filas directas a quien prefiere explorar. "Todas las opciones" sirve a quien quiere ver todo antes de elegir, y "Respuestas rápidas" a quien quiere actuar de inmediato. Cada guía dice qué va a pasar y aclara que la extensión no envía nada.
- Es el modelo que probó el estudio de Microsoft Research: quitar barreras a quien tiene menos confianza mejora el resultado de todos.
- Usa listas, que se recorren mejor que las tarjetas cuando se busca algo (sección 2.3).
- Para docentes basta otra lista de tareas. "Capturar calificaciones" es un proceso de tres pasos con fecha límite, el caso ideal para una guía.

**Riesgos y desventajas.**

- Quien ya domina SIASE da un clic más que hoy. "Respuestas rápidas" y "Todas las opciones" lo reducen, pero no lo eliminan.
- El tono puede sentirse demasiado guiado para alguien con mucha confianza. La guía siempre es opcional.
- Una guía cruza varias páginas originales. Como cada página original reemplaza el contenido del marco central, los pasos de la guía tienen que dibujarse fuera de ese marco o volver a inyectarse en cada página.
- La guía de pago del prototipo lista recibos con monto. Con la regla actual de recibos, el primer paso listaría tipos de recibo y el monto se vería en la página original.
- El catálogo de tareas se mantiene a mano. El grupo "Otras opciones de SIASE" evita que algo nuevo quede escondido.

**Costo aproximado.** Bajo a medio: 3 a 4 semanas. La mayor parte es el catálogo, que ya existe, y la navegación delegada. Las guías se pueden agregar una por una.

### Propuesta 3. Tablero Vivo

**Idea central.** Cada área de SIASE es un widget que muestra su dato más importante con una visualización. Una barra lateral con las ocho áreas queda siempre visible.

**Prototipo.** [mockups/tablero-vivo/index.html](mockups/tablero-vivo/index.html)

**Navegación y lugar de cada módulo.**

- Barra lateral fija: Inicio, Mis estudios, Inscripción, Pagos y becas, Trámites y documentos, Vida universitaria, Encuestas, English UANL y Mi cuenta. Un contador dorado marca las áreas con pendientes.
- El inicio tiene un widget por área: el día de clases en una pista horaria, el avance de carrera en un anillo, pagado contra por pagar en una barra, documentos en segmentos, días para la inscripción, encuestas abiertas, eventos AFI y niveles de inglés. Los widgets con pendientes llevan un borde rojo y una insignia con texto.
- Cada área abre una página con su resumen y la lista de todas sus páginas con el nombre oficial.
- Tesorería queda dentro de "Pagos y becas", AFI dentro de "Vida universitaria" y DGPPE dentro de "Encuestas". English UANL tiene su propia área. Las páginas del encabezado original están en "Mi cuenta" y EXCI en "Trámites y documentos". El selector de carrera está en el encabezado y en el widget "Otros servicios de la UANL".
- Hay un buscador simple en el encabezado.

**Por qué funciona.**

- Es la evolución natural del código actual, que ya tiene barra lateral e inicio con secciones. Corrige sus fallas: todo visible, agrupación por tema y datos en lugar de etiquetas fijas.
- Los widgets resumen contenidos de tipos distintos, que es el caso en que las tarjetas sí funcionan (sección 2.3).
- Quien quiere el panorama completo lo tiene en una pantalla. Quien actúa rápido va directo al widget en rojo.
- Para docentes, el widget de captura con una barra por grupo responde su pregunta principal: cuánto falta y cuándo cierra.

**Riesgos y desventajas.**

- Es la propuesta más densa. MyUW encontró que el exceso de elementos satura. Doce widgets son muchos para una primera visita.
- Depende de datos tanto como la propuesta 1. Un widget sin dato cae en el mismo problema que el inicio actual.
- Los nombres de la barra lateral son categorías, no tareas. Quien no sabe si "Registro IMSS" es un trámite o un tema de su cuenta tiene que adivinar.
- No queda claro al primer vistazo que todo el widget lleva a su área. Los prototipos agregan un enlace con texto al pie de cada uno.
- En pantalla angosta la barra lateral se convierte en una fila que se desliza, y parte de las áreas queda fuera de la vista.
- Es la más parecida a lo que ya existe. Si el problema percibido es "sigue siendo lo mismo", esta propuesta es la que menos lo cambia.

**Costo aproximado.** Medio: 4 a 5 semanas, porque reutiliza la estructura actual. Sube si se quieren los doce widgets con datos reales.

### Propuesta 4. Busca y Listo

**Idea central.** Un buscador siempre presente que entiende nombres oficiales y palabras comunes. Si la respuesta es un dato, lo muestra sin abrir nada. Debajo, el directorio completo queda siempre visible.

**Prototipo.** [mockups/busca-y-listo/index.html](mockups/busca-y-listo/index.html)

**Navegación y lugar de cada módulo.**

- El buscador está fijo arriba. Se enfoca con `/` o con Ctrl+K. Las flechas mueven la selección y Enter abre.
- Escribir "cuánto debo" responde con el adeudo. "Mi promedio" responde con el promedio. "Horario de hoy" responde con la siguiente clase. Debajo de la respuesta aparecen las páginas que coinciden, con su nombre oficial y su nombre llano.
- El buscador conoce sinónimos: "pagar" encuentra los recibos y "password" encuentra Contraseña.
- El inicio muestra "Para hoy" y luego "Todo SIASE": las 68 páginas en columnas, de la A a la Z o por tema. Ninguna página depende de saber buscar.
- Los cinco módulos aparecen mezclados en el directorio alfabético y agrupados en la vista por tema. Las páginas del encabezado original, el selector de carrera y Salir están en el directorio. El selector también está en el avatar.

**Por qué funciona.**

- Los estudiantes de MyUW dijeron que dependían del buscador aunque los enlaces estuvieran en la página. Con 68 páginas, buscar es más rápido que recorrer.
- Las respuestas al instante sirven a quien quiere terminar pronto: la mayoría de las visitas a SIASE son para consultar un dato.
- El directorio visible cubre a quien prefiere reconocer en lugar de recordar, y a quien quiere ver todo antes de elegir.
- Para personas con mucha confianza y gusto por el teclado es la propuesta más eficiente.
- Para docentes, "lista 009" o "captura" llevan directo a la tarea.

**Riesgos y desventajas.**

- Escribir exige saber qué palabra usar. Es la barrera que más afecta a quien tiene menos confianza con la tecnología. El directorio la compensa, pero entonces esa persona usa una lista larga sin jerarquía.
- El directorio alfabético hereda los nombres oficiales. "Recibo de…" y "Recibo Interno de…" quedan juntos y siguen confundiendo.
- **Límite del `frameset`.** Un panel de resultados dibujado en el marco superior no puede salir de ese marco para cubrir el contenido. Hay dos salidas: agrandar el marco superior mientras el panel está abierto, o inyectar el panel en la página del marco central, lo que requiere un script en todas las páginas del portal.
- Las respuestas dependen de los mismos datos que los widgets. Sin datos, el buscador solo lleva a páginas.
- En celular, el teclado tapa la mitad de la pantalla.

**Costo aproximado.** Medio: 4 a 5 semanas. El índice de búsqueda es sencillo. El costo está en el panel dentro del `frameset` y en las respuestas.

### Propuesta 5. SIASE de Bolsillo

**Idea central.** Cinco pestañas fijas, como una app de banco: Inicio, Estudios, Pagos, Trámites y Yo. Cada pestaña es un lugar con listas cortas y un resumen arriba.

**Prototipo.** [mockups/siase-de-bolsillo/index.html](mockups/siase-de-bolsillo/index.html)

**Navegación y lugar de cada módulo.**

- La barra de pestañas va abajo en pantalla angosta y a la izquierda en pantalla ancha. Siempre muestra las cinco, con un contador rojo si hay pendientes.
- **Inicio:** la clase en curso, cuatro atajos redondos (Horario, Calificaciones, Kardex, Credencial), las clases de hoy, los pendientes y los avisos.
- **Estudios:** este semestre, mi carrera, inscripción y English UANL.
- **Pagos:** el adeudo en grande con los recibos por pagar apilados, luego recibos y boletas, becas y Tesorería.
- **Trámites:** documentos y trámites (incluye EXCI), encuestas (incluye DGPPE) y vida universitaria (incluye AFI).
- **Yo:** datos y fotos, acceso y seguridad, otros servicios de la UANL, sobre el portal, el botón para cambiar de carrera y el botón Cerrar sesión.
- Cada página tiene un botón para volver a su pestaña.

**Por qué funciona.**

- Es el patrón que casi toda la comunidad ya usa a diario en su celular. No hay nada que aprender, y eso ayuda sobre todo a quien evita lo desconocido.
- La navegación está siempre visible, que es lo que recomienda la evidencia (sección 2.3).
- "Pagos" como un lugar propio, con el adeudo arriba, copia lo que mejor hacen las apps de banco.
- Cinco lugares fijos dan un mapa fácil de recordar: "eso está en Trámites".
- Para docentes las pestañas cambian a Inicio, Grupos, Captura, Agenda y Yo. Sus dos tareas principales quedan a un toque.

**Riesgos y desventajas.**

- Cinco pestañas obligan a repartir 68 páginas en cuatro lugares. "Trámites" termina con 19 páginas y "Pagos" con 16. Las listas largas dentro de una pestaña repiten en pequeño el problema del menú actual.
- Su mayor ventaja es el celular, donde la extensión hoy no se puede instalar (sección 2.5). En escritorio queda como una barra lateral de íconos, parecida a la propuesta 3 pero con menos información.
- La barra inferior necesita un script en todas las páginas del marco central, porque el `frameset` no tiene una fila inferior. Agregar una fila al `frameset` contradice la regla de no alterar su estructura.
- El estilo de app puede sentirse menos serio para trámites oficiales. Es una percepción que habría que probar.

**Costo aproximado.** Medio: 4 a 6 semanas. El catálogo y las pestañas son simples. El costo está en la barra inferior y en la pestaña Pagos.

## 5. Matriz de cobertura

La matriz se generó a partir de `mockups/shared/data.js`, el mismo catálogo que usan los prototipos. Una prueba automática recorrió todos los enlaces de cada prototipo en un navegador sin interfaz, y confirmó que las 68 filas son alcanzables en los cinco, sin enlaces rotos ni errores, a 320, 375 y 1280 px de ancho.

La columna "En el SIASE original" indica módulo, página y dónde se abre. En la columna de Busca y Listo, la palabra entre comillas es un ejemplo de búsqueda que encuentra la página.

| Página o elemento | En el SIASE original | 1. Mi Semestre | 2. Paso a Paso | 3. Tablero Vivo | 4. Busca y Listo | 5. SIASE de Bolsillo |
|---|---|---|---|---|---|---|
| Avisos de interés | Portal, `maincenter.htm`, centro | Hoy › Avisos; Todo SIASE › Durante el semestre | Respuestas rápidas; Tarea "Ver cómo voy en la carrera" | Widget Avisos; Mi cuenta | Buscar "noticias"; Directorio › A y Inicio | Inicio › Avisos; Yo › Sobre el portal |
| Situación estudiante UANL | Escolar, `ecSitEst01.htm`, centro | Todo SIASE › Durante el semestre | Tarea "Ver cómo voy en la carrera" | Widget Mi cuenta; Barra lateral › Mis estudios | Buscar "credencial" (responde matrícula y estatus); Directorio › S y Mis estudios | Estudios › Mi carrera; Inicio (atajo Credencial) |
| Créditos académicos | Escolar, `esCreditoMaterias01.htm`, centro | Hoy › Así vas; Todo SIASE › Al cerrar el semestre | Tarea "Ver cómo voy en la carrera" | Widget Avance de carrera; Barra lateral › Mis estudios | Buscar "avance" (responde cuántos faltan); Directorio › C y Mis estudios | Estudios › Mi carrera |
| Kardex | Escolar, `econkdx01.htm`, centro | Hoy › Así vas; Todo SIASE › Al cerrar el semestre | Respuestas rápidas; Tarea "Ver cómo voy en la carrera" | Widget Avance de carrera; Barra lateral › Mis estudios | Buscar "historial" (responde el promedio); Directorio › K y Mis estudios | Estudios › Mi carrera; Inicio (atajo) |
| Horario | Escolar, `echalm01.htm`, centro | Hoy (clases del día); Todo SIASE › Durante el semestre | Respuestas rápidas; Tarea "Ver cómo voy en la carrera" | Widget Hoy en clases; Barra lateral › Mis estudios | Buscar "clases" (responde la siguiente clase); Directorio › H y Mis estudios | Estudios › Este semestre; Inicio (clase actual) |
| Calificaciones | Escolar, `econcfs01.htm`, centro | Hoy › Así vas; Todo SIASE › Al cerrar el semestre | Tarea "Ver cómo voy en la carrera" | Widget Calificaciones; Barra lateral › Mis estudios | Buscar "notas" (responde cuántas hay); Directorio › C y Mis estudios | Estudios › Este semestre; Inicio (atajo) |
| Consulta de Evaluación | Escolar, `econeva01.htm`, centro | Todo SIASE › Al cerrar el semestre | Tarea "Ver cómo voy en la carrera" | Barra lateral › Mis estudios | Buscar "examen"; Directorio › C y Mis estudios | Estudios › Este semestre |
| Consulta fecha de inscripción | Escolar, `ecohoinsint01.htm`, centro | Línea de tiempo; Todo SIASE › Antes de empezar | Guía Inscribirme; Tarea "Inscribirme al siguiente semestre" | Widget Inscripción; Barra lateral › Inscripción | Buscar "cuando" (responde la fecha); Directorio › C y Inscripción | Estudios › Inscripción |
| Inscripción | Escolar, `eins01.htm`, centro | Todo SIASE › Antes de empezar | Guía Inscribirme; Tarea "Inscribirme al siguiente semestre" | Barra lateral › Inscripción | Buscar "materias"; Directorio › I y Inscripción | Estudios › Inscripción |
| Pre-Inscripción | Escolar, `epreins01.htm`, centro | Todo SIASE › Antes de empezar | Guía Inscribirme; Tarea "Inscribirme al siguiente semestre" | Barra lateral › Inscripción | Buscar "preinscripcion"; Directorio › P y Inscripción | Estudios › Inscripción |
| Inscripción 1er. Ingreso Super | Escolar, `einssupaq01.htm`, centro | Todo SIASE › Antes de empezar | Tarea "Inscribirme al siguiente semestre" | Barra lateral › Inscripción | Buscar "primer"; Directorio › I y Inscripción | Estudios › Inscripción |
| Formato Inscripción Rectoría | Escolar, `ecinstreg01.htm`, centro | Todo SIASE › Antes de empezar | Tarea "Inscribirme al siguiente semestre" | Barra lateral › Inscripción | Buscar "formato"; Directorio › F y Inscripción | Estudios › Inscripción |
| Inscripción PROVERICYT | Escolar, `EscInv_01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Participar en una actividad" | Barra lateral › Inscripción | Buscar "verano"; Directorio › I y Inscripción | Estudios › Inscripción |
| Recibo Interno de Servicios Académicos y Escolares | Escolar, `ecavpag01.htm`, centro | Línea de tiempo y Pagos; Todo SIASE › Antes de empezar | Guía Pagar; Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "cuota" (responde cuánto debes); Directorio › R y Pagos y becas | Pagos › Recibos y boletas; cartera de Pagos |
| Recibo de Servicios Académicos y Escolares | Escolar, `ecBolRec-v02.htm`, centro | Línea de tiempo y Pagos; Todo SIASE › Antes de empezar | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "cuota"; Directorio › R y Pagos y becas | Pagos › Recibos y boletas |
| Intersemestral Recibo de Servicios Académicos y Escolares | Escolar, `ecBolRec-v03.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "verano"; Directorio › I y Pagos y becas | Pagos › Recibos y boletas |
| Intersemestral Recibo Interno | Escolar, `EgenbolveranoV2.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "verano"; Directorio › I y Pagos y becas | Pagos › Recibos y boletas |
| Genera Recibo de Cursos de Asesorías | Escolar, `Egenbolsabatino.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "sabatino"; Directorio › G y Pagos y becas | Pagos › Recibos y boletas |
| Boleta Pago EXENS | Escolar, `ceregexens01.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "examen"; Directorio › B y Pagos y becas | Pagos › Recibos y boletas |
| Comercio Electrónico | Escolar, `eComerSrv_vr.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Guía Pagar; Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "pago"; Directorio › C y Pagos y becas | Pagos › Recibos y boletas |
| Solicitud de Beca | Escolar, `bcreq01V2.htm`, ventana nueva | Pagos; Todo SIASE › Antes de empezar | Tarea "Pedir o revisar una beca" | Barra lateral › Pagos y becas | Buscar "apoyo"; Directorio › S y Pagos y becas | Pagos › Becas |
| Carga y seguimiento de beca | Escolar, `bcerCargaDocto05.htm`, ventana nueva | Pagos; Todo SIASE › Antes de empezar | Tarea "Pedir o revisar una beca" | Barra lateral › Pagos y becas | Buscar "beca"; Directorio › C y Pagos y becas | Pagos › Becas |
| Resultado de Beca | Escolar, `bccosobe01.htm`, centro | Pagos; Todo SIASE › Antes de empezar | Tarea "Pedir o revisar una beca" | Barra lateral › Pagos y becas | Buscar "beca"; Directorio › R y Pagos y becas | Pagos › Becas |
| Solicitud de Crédito | Tesorería, `tcSolCredReq01.htm`, centro | Pagos; Todo SIASE › Antes de empezar | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "prorroga"; Directorio › S y Pagos y becas | Pagos › Tesorería |
| Solicitud de Facturas | Tesorería, `gensolfac01.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "factura"; Directorio › S y Pagos y becas | Pagos › Tesorería |
| Sol. Cancelación Factura | Tesorería, `gensolcanfac01.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "cancelar"; Directorio › S y Pagos y becas | Pagos › Tesorería |
| Solicitud de Factura Dependencia | Tesorería, `gensolfacdep01.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "factura"; Directorio › S y Pagos y becas | Pagos › Tesorería |
| Solicitud Devolución Depend. | Tesorería, `tdev_sol_01.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "reembolso"; Directorio › S y Pagos y becas | Pagos › Tesorería |
| Comercio Electrónico TC | Tesorería, `tc_eComerSrv.htm`, centro | Pagos; Todo SIASE › En cualquier momento | Tarea "Pagar o imprimir un recibo" | Barra lateral › Pagos y becas | Buscar "pago"; Directorio › C y Pagos y becas | Pagos › Tesorería |
| Carga Documentos Pendientes | Escolar, `ecCargaDocto01.htm`, centro | Línea de tiempo; Todo SIASE › En cualquier momento | Empieza por esto; Tarea "Entregar un documento o hacer un trámite" | Widget Trámites; Barra lateral › Trámites y documentos | Buscar "expediente" (responde qué falta); Directorio › C y Trámites y documentos | Trámites › Documentos y trámites; Inicio › Pendientes |
| Trámites DEyA | Escolar, `eccontram03.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Entregar un documento o hacer un trámite" | Barra lateral › Trámites y documentos | Buscar "constancia"; Directorio › T y Trámites y documentos | Trámites › Documentos y trámites |
| Trámite Titulación Dependencia | Escolar, `tavpatit01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Entregar un documento o hacer un trámite" | Barra lateral › Trámites y documentos | Buscar "titulo"; Directorio › T y Trámites y documentos | Trámites › Documentos y trámites |
| Registro Servicio Social | Escolar, `essc_rgal_00.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Entregar un documento o hacer un trámite" | Barra lateral › Trámites y documentos | Buscar "servicio"; Directorio › R y Trámites y documentos | Trámites › Documentos y trámites |
| Prácticas Profesionales | Escolar, `vr_dsp_inicio_01.htm`, pantalla completa | Todo SIASE › En cualquier momento | Tarea "Entregar un documento o hacer un trámite" | Barra lateral › Trámites y documentos | Buscar "practicas"; Directorio › P y Trámites y documentos | Trámites › Documentos y trámites |
| Registro IMSS | Escolar, `ecSoImssV3_01.htm`, centro | Todo SIASE › Antes de empezar | Tarea "Entregar un documento o hacer un trámite" | Barra lateral › Trámites y documentos | Buscar "seguro"; Directorio › R y Trámites y documentos | Trámites › Documentos y trámites |
| Solicitud de Baja Voluntaria | Escolar, `ecSolBajaVol00.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Entregar un documento o hacer un trámite" | Barra lateral › Trámites y documentos | Buscar "baja"; Directorio › S y Trámites y documentos | Trámites › Documentos y trámites |
| EXCI | Encabezado, `ceregexci02.htm`, centro | Línea de tiempo; Todo SIASE › En cualquier momento | Tarea "Ver mi avance de inglés" | Barra lateral › Trámites y documentos | Buscar "examen"; Directorio › E y Trámites y documentos | Trámites › Documentos y trámites |
| Reservación Gimnasio | Escolar, `CdGymins01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Participar en una actividad" | Barra lateral › Vida universitaria | Buscar "gym"; Directorio › R y Vida universitaria | Trámites › Vida universitaria |
| Programa Futbol Americano | Escolar, `pfacue01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Participar en una actividad" | Barra lateral › Vida universitaria | Buscar "autenticos"; Directorio › P y Vida universitaria | Trámites › Vida universitaria |
| Voluntariado | Escolar, `ssc_default.htm`, pantalla completa | Todo SIASE › En cualquier momento | Tarea "Participar en una actividad" | Barra lateral › Vida universitaria | Buscar "voluntario"; Directorio › V y Vida universitaria | Trámites › Vida universitaria |
| AFI: Portada | AFI, `delportada01.htm`, centro | Todo SIASE › Durante el semestre | Tarea "Participar en una actividad" | Barra lateral › Vida universitaria | Buscar "formacion"; Directorio › A y Vida universitaria | Trámites › Vida universitaria |
| AFI: Calendario de Eventos | AFI, `delSavePrereg.htm`, centro | Todo SIASE › Durante el semestre | Tarea "Participar en una actividad" | Barra lateral › Vida universitaria | Buscar "eventos"; Directorio › A y Vida universitaria | Trámites › Vida universitaria |
| AFI: Historial | AFI, `delConsRegEven.htm`, centro | Todo SIASE › Durante el semestre | Tarea "Participar en una actividad" | Barra lateral › Vida universitaria | Buscar "asistencias"; Directorio › A y Vida universitaria | Trámites › Vida universitaria |
| Encuestas | Escolar, `eenc01.htm`, centro | Línea de tiempo; Todo SIASE › Al cerrar el semestre | Tarea "Contestar una encuesta" | Widget Encuestas; Barra lateral › Encuestas | Buscar "evaluacion"; Directorio › E y Encuestas | Trámites › Encuestas; Inicio › Pendientes |
| Encuesta de Verano | Escolar, `eenve01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Contestar una encuesta" | Barra lateral › Encuestas | Buscar "verano"; Directorio › E y Encuestas | Trámites › Encuestas |
| Encuesta - CEV | Escolar, `cemaenc01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Contestar una encuesta" | Barra lateral › Encuestas | Buscar "cev"; Directorio › E y Encuestas | Trámites › Encuestas |
| Cuestionario Huella CO2 | Escolar, `DisCO2_00.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Contestar una encuesta" | Barra lateral › Encuestas | Buscar "carbono"; Directorio › C y Encuestas | Trámites › Encuestas |
| DGPPE: Encuestas | DGPPE, `plenc01a_2.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Contestar una encuesta" | Barra lateral › Encuestas | Buscar "planeacion"; Directorio › D y Encuestas | Trámites › Encuestas |
| English UANL: Consulta de Kardex | English UANL, `sac_kardex_01.htm`, centro | Todo SIASE › Al cerrar el semestre | Tarea "Ver mi avance de inglés" | Barra lateral › English UANL | Buscar "ingles"; Directorio › E y English UANL | Estudios › English UANL |
| English UANL: Consulta de Calificaciones | English UANL, `sac_calif_01.htm`, centro | Todo SIASE › Al cerrar el semestre | Tarea "Ver mi avance de inglés" | Barra lateral › English UANL | Buscar "ingles"; Directorio › E y English UANL | Estudios › English UANL |
| English UANL: Consulta de Horario | English UANL, `sac_horario_01.htm`, centro | Todo SIASE › Durante el semestre | Tarea "Ver mi avance de inglés" | Barra lateral › English UANL | Buscar "ingles"; Directorio › E y English UANL | Estudios › English UANL |
| English UANL: Sol. de Convalidación | English UANL, `sac_conv_01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Ver mi avance de inglés" | Barra lateral › English UANL | Buscar "toefl"; Directorio › E y English UANL | Estudios › English UANL |
| English UANL: EXCI Examen Intermedio | English UANL, `sacregexciInt01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Ver mi avance de inglés" | Barra lateral › English UANL | Buscar "examen"; Directorio › E y English UANL | Estudios › English UANL |
| English UANL: EXCI Examen Final | English UANL, `sacregexciFin01.htm`, centro | Todo SIASE › En cualquier momento | Tarea "Ver mi avance de inglés" | Barra lateral › English UANL | Buscar "examen"; Directorio › E y English UANL | Estudios › English UANL |
| Datos Personales | Escolar, `edatal01.htm`, centro | Todo SIASE › Antes de empezar | Guía Inscribirme; Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "direccion"; Directorio › D y Mi cuenta | Yo › Mis datos |
| Subir Foto del Alumno | Escolar, `iaFoto01.htm`, centro | Todo SIASE › Antes de empezar | Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "fotografia"; Directorio › S y Mi cuenta | Yo › Mis datos |
| Consulta Toma de Foto | Escolar, `ecotofo01.htm`, centro | Todo SIASE › Antes de empezar | Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "cita"; Directorio › C y Mi cuenta | Yo › Mis datos |
| Contraseña | Encabezado, `pass01.htm`, centro | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "password"; Directorio › C y Mi cuenta | Yo › Acceso y seguridad |
| Clave de Seguridad | Encabezado, `cveseg01.htm`, centro | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "pregunta"; Directorio › C y Mi cuenta | Yo › Acceso y seguridad |
| Aviso de Privacidad | Encabezado, `avisopriv.htm`, centro | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "datos"; Directorio › A y Mi cuenta | Yo › Sobre el portal |
| Selector de carrera | Selector de carrera, `eselcarrera.htm`, centro | Encabezado (nombre y carrera); Todo SIASE › Tu cuenta | Franja "Entraste como"; Tarea "Cambiar algo de mi cuenta" | Encabezado y widget Otros servicios; Barra lateral › Mi cuenta | Buscar "cambiar" (también en el avatar); Directorio › S y Mi cuenta | Yo › botón Cambiar de carrera |
| Correo universitario | Selector de carrera, `eselcarrera.htm (panel #correo)`, pestaña nueva | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Widget Otros servicios; Barra lateral › Mi cuenta | Buscar "email"; Directorio › C y Mi cuenta | Yo › Otros servicios |
| Nexus | Selector de carrera, `eselcarrera.htm (panel #nexus)`, pestaña nueva | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Widget Otros servicios; Barra lateral › Mi cuenta | Buscar "plataforma"; Directorio › N y Mi cuenta | Yo › Otros servicios |
| Códice | Selector de carrera, `eselcarrera.htm (panel #codice)`, pestaña nueva | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Widget Otros servicios; Barra lateral › Mi cuenta | Buscar "biblioteca"; Directorio › C y Mi cuenta | Yo › Otros servicios |
| Redes sociales de la UANL | Encabezado, `maintop.htm (íconos)`, pestaña nueva | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "facebook"; Directorio › R y Mi cuenta | Yo › Otros servicios |
| Ver la versión original de SIASE | Oh My SIASE, `interruptor de la extensión`, recarga | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "apagar"; Directorio › V y Mi cuenta | Yo › Sobre el portal |
| Estado de la sesión | Oh My SIASE, `mensajes de SIASE`, centro | Todo SIASE › Tu cuenta | Tarea "Cambiar algo de mi cuenta" | Barra lateral › Mi cuenta | Buscar "sesion"; Directorio › E y Mi cuenta | Yo › Acceso y seguridad |
| Salir | Encabezado, `cerrar.htm`, izquierda | Todo SIASE › Tu cuenta | Encabezado; Tarea "Cambiar algo de mi cuenta" | Pie de la barra lateral; Barra lateral › Mi cuenta | Buscar "cerrar"; Directorio › S y Mi cuenta | Yo › botón Cerrar sesión |

Elementos de estructura que no son páginas:

| Elemento del portal | 1. Mi Semestre | 2. Paso a Paso | 3. Tablero Vivo | 4. Busca y Listo | 5. SIASE de Bolsillo |
|---|---|---|---|---|---|
| `frameset` raíz (`default.htm`) | Se conserva; la regla y las secciones van en el marco superior | Se conserva; el encabezado va en el marco superior | Se conserva; la barra lateral va en el marco izquierdo | Se conserva; el buscador va en el marco superior | Se conserva; las pestañas van en el marco izquierdo o inyectadas abajo |
| Enlaces de módulo del encabezado | Ocultos; se activan al abrir una página de ese módulo | Ocultos; se activan al abrir una página de ese módulo | Ocultos; se activan al abrir una página de ese módulo | Ocultos; se activan al abrir una página de ese módulo | Ocultos; se activan al abrir una página de ese módulo |
| Menú izquierdo original | Oculto pero vivo; "Todo SIASE" lo reemplaza | Oculto pero vivo; las tareas lo reemplazan | Oculto pero vivo; las áreas lo reemplazan | Oculto pero vivo; el directorio lo reemplaza | Oculto pero vivo; las pestañas lo reemplazan |
| Leyenda de horario del menú izquierdo | Dentro de Horario | Dentro de Horario | Dentro de Horario | Dentro de Horario | Dentro de Horario |
| Mensajes y ventanas de SIASE (`#idMensaje`) | Se muestran tal cual, con la explicación de "Estado de la sesión" | Igual | Igual | Igual | Igual |
| Botones Imprimir, Modificar y Regresar | Se conservan; los botones nuevos activan los originales | Igual | Igual | Igual | Igual |

## 6. Comparación y recomendación

La escala va de 1 a 5 y más es mejor. Son juicios basados en la investigación y en recorrer los prototipos. No son mediciones con usuarios.

| Criterio | 1. Mi Semestre | 2. Paso a Paso | 3. Tablero Vivo | 4. Busca y Listo | 5. SIASE de Bolsillo |
|---|---|---|---|---|---|
| Intuición al primer vistazo | 4 | 5 | 3 | 3 | 5 |
| Inclusión: estilos de uso y accesibilidad | 4 | 5 | 3 | 3 | 4 |
| Cobertura visible | 4 | 5 | 4 | 5 | 4 |
| Uso docente | 5 | 4 | 4 | 3 | 4 |
| Uso en pantalla pequeña | 4 | 5 | 3 | 3 | 5 |
| Funciona sin datos nuevos | 1 | 4 | 2 | 3 | 4 |
| Bajo esfuerzo técnico | 1 | 4 | 3 | 3 | 3 |
| **Suma** | **23** | **32** | **22** | **23** | **29** |
| Costo estimado | 6 a 8 semanas | 3 a 4 semanas | 4 a 5 semanas | 4 a 5 semanas | 4 a 6 semanas |

Cómo leer cada criterio:

- **Intuición.** Si alguien que nunca vio la extensión adivina qué hace cada elemento. Paso a Paso y SIASE de Bolsillo usan frases y patrones que ya se conocen. Tablero Vivo y Busca y Listo piden interpretar widgets o saber qué escribir.
- **Inclusión.** Cuántos de los cinco aspectos de GenderMag cubre en sus dos extremos, más teclado, contraste y tamaño de texto.
- **Cobertura visible.** Cuántos clics hay hasta cualquier página y si existe una vista con todo. Busca y Listo tiene todo en el inicio. Paso a Paso tiene "Todas las opciones".
- **Uso docente.** Qué tan bien encaja el trabajo docente sin rediseñar.
- **Funciona sin datos nuevos.** Qué tanto sirve la propuesta con lo que la extensión ya sabe leer.

### Recomendación

Implementar **Paso a Paso** como estructura base. Las razones:

1. **Resuelve el problema diagnosticado.** El fallo principal de la interfaz actual es que obliga a leer nombres institucionales dentro de grupos que no significan nada. Paso a Paso cambia justo eso: agrupa por tarea y nombra en lenguaje llano, sin esconder el nombre oficial.
2. **Tiene el mejor respaldo en la evidencia de inclusión.** Cubre los dos extremos de los cinco aspectos de GenderMag, y el estudio de Microsoft Research mostró que ese tipo de corrección mejora el resultado de mujeres y de hombres.
3. **Funciona desde el primer día.** Su valor está en la organización y en los nombres, que no dependen de leer datos. Las propuestas 1 y 3 quedan a medias sin los lectores nuevos y sin cambiar la regla de recibos.
4. **Tiene el menor riesgo técnico.** Una columna de contenido en el marco central y un encabezado simple. No necesita paneles que salgan de un marco ni una barra inferior.
5. **Se adapta a docentes cambiando solo el catálogo.**

Su debilidad es el clic adicional para quien ya domina el portal. Por eso propongo crecerla por fases, tomando lo mejor de otras dos propuestas:

- **Fase 1.** Paso a Paso completa: catálogo, tareas, nombres llanos, "Todas las opciones", estados de sesión y navegación delegada entre módulos.
- **Fase 2.** Agregar el buscador de Busca y Listo en el encabezado, primero solo para encontrar páginas. Sirve a quien quiere ir más rápido y reutiliza el mismo catálogo.
- **Fase 3.** Agregar al inicio el bloque "Hoy" de Mi Semestre, dato por dato, conforme existan los lectores: primero horario, luego fecha de inscripción y documentos. El adeudo entra solo si se cambia la regla de recibos.

La segunda opción es **SIASE de Bolsillo**. Conviene si el proyecto decide llevar la extensión a un navegador de celular. Mientras eso no ocurra, su principal ventaja no se puede aprovechar.

No recomiendo empezar por Tablero Vivo, aunque sea la más cercana al código actual. Es la que menos cambia lo que hoy no funciona, y la que más depende de datos que aún no existen.

## 7. Qué sigue

1. **Probar antes de construir.** Una prueba de primer clic con cinco estudiantes, mujeres y hombres, y dos docentes. Cinco tareas por persona, por ejemplo "imprime el recibo de tu cuota", "averigua cuándo te inscribes" y "pide una factura". Se usa el prototipo de Paso a Paso y uno más como comparación, y se anota si el primer clic fue correcto y cuánto tardó.
2. **Validar el catálogo de nombres llanos.** Las frases de `mockups/shared/data.js` las escribí yo. Hay páginas cuyo contenido el inventario marca como "falta verificar", por ejemplo Consulta de Evaluación, y su frase puede estar mal.
3. **Probar la navegación entre módulos.** Un experimento pequeño que active el enlace original de Tesorería, espere al marco izquierdo y abra una de sus páginas. Si esto no es estable, ninguna propuesta puede reunir los cinco módulos.
4. **Auditar el portal docente** con una cuenta docente, con el mismo método y las mismas reglas de privacidad que el inventario de estudiantes.
5. **Decidir la regla de recibos.** Mantenerla como está o permitir leer el monto en memoria para mostrar el adeudo en el inicio.
6. **Decidir sobre el celular.** Si se quiere uso real en celular, hay que evaluar qué navegadores de Android aceptan la extensión. No lo verifiqué en esta investigación.

## Notas sobre los prototipos

- Todo el contenido es ficticio: nombres, matrículas, materias, calificaciones, montos, fechas y avisos.
- No usan dependencias, fuentes ni imágenes externas. Los íconos son SVG en línea.
- La franja oscura superior es del prototipo y no de la propuesta. Permite volver al índice, cambiar entre Estudiante y Docente y agrandar el texto. Agregar `?rol=docente` a la dirección abre directamente la vista docente.
- Al pie de cada página, una nota indica dónde vive esa página en el SIASE original. Esa nota tampoco es parte de la propuesta.
- Los botones que en la extensión activarían un control original muestran un aviso que lo explica.
- Las páginas no diseñadas a detalle muestran su título, su lugar en la navegación y qué contendrían.
- Las cinco propuestas comparten las pantallas de contenido (kardex, horario, calificaciones, recibos, credencial). Lo que cambia entre ellas es la navegación, el inicio y el estilo. Así la comparación se concentra en la forma de organizar el portal.
- Calculé el contraste de 24 pares de color de texto y fondo de los cinco prototipos. Todos superan 4.5 a 1.
