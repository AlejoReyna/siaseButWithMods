/*
 * Datos compartidos por los cinco prototipos de Oh My SIASE.
 * TODO es ficticio: nombres, matrículas, materias, calificaciones, montos y fechas.
 * El inventario de páginas sale de docs/siase-ui-rebuild/ (archivos 02 a 14).
 * Se carga con <script src> clásico para que funcione con file://.
 */
(function () {
  'use strict';

  /* ---------- Módulos nativos de SIASE (enlaces del encabezado) ---------- */
  var modules = {
    inicio: 'Portal',
    escolar: 'Escolar',
    tesoreria: 'Tesorería',
    dgppe: 'DGPPE',
    afi: 'AFI',
    english: 'English UANL',
    header: 'Encabezado',
    carrera: 'Selector de carrera',
    extension: 'Oh My SIASE'
  };

  /* ---------- Áreas: agrupación por tema, usada por varias propuestas ---------- */
  var areas = [
    { id: 'estudios', label: 'Mis estudios', icon: 'book', blurb: 'Materias, horario, calificaciones y avance' },
    { id: 'inscripcion', label: 'Inscripción', icon: 'clipboard', blurb: 'Fechas, inscripción y preinscripción' },
    { id: 'pagos', label: 'Pagos y becas', icon: 'wallet', blurb: 'Recibos, boletas, facturas y becas' },
    { id: 'tramites', label: 'Trámites y documentos', icon: 'file', blurb: 'Documentos, titulación, servicio social' },
    { id: 'vida', label: 'Vida universitaria', icon: 'heart', blurb: 'Deporte, eventos AFI y voluntariado' },
    { id: 'encuestas', label: 'Encuestas', icon: 'chat', blurb: 'Encuestas y cuestionarios abiertos' },
    { id: 'ingles', label: 'English UANL', icon: 'globe', blurb: 'Kardex, horario y exámenes de inglés' },
    { id: 'cuenta', label: 'Mi cuenta', icon: 'user', blurb: 'Datos, credencial, contraseña y sesión' }
  ];

  /* ---------- Momentos del semestre (propuesta Mi Semestre) ---------- */
  var moments = [
    { id: 'antes', label: 'Antes de empezar', blurb: 'Lo que se hace al inicio de cada semestre' },
    { id: 'durante', label: 'Durante el semestre', blurb: 'Lo que consultas semana a semana' },
    { id: 'cierre', label: 'Al cerrar el semestre', blurb: 'Exámenes, evaluaciones y resultados' },
    { id: 'siempre', label: 'En cualquier momento', blurb: 'Trámites y servicios sin fecha fija' },
    { id: 'cuenta', label: 'Tu cuenta', blurb: 'Datos personales, acceso y sesión' }
  ];

  /* ---------- Tareas en lenguaje llano (propuesta Paso a Paso) ---------- */
  var tasks = [
    { id: 'ver', label: 'Ver cómo voy en la carrera', icon: 'chart', blurb: 'Calificaciones, kardex, créditos y horario' },
    { id: 'inscribirme', label: 'Inscribirme al siguiente semestre', icon: 'clipboard', blurb: 'Tu fecha, la inscripción y sus formatos' },
    { id: 'pagar', label: 'Pagar o imprimir un recibo', icon: 'wallet', blurb: 'Cuotas, boletas, facturas y devoluciones' },
    { id: 'beca', label: 'Pedir o revisar una beca', icon: 'star', blurb: 'Solicitud, documentos y resultado' },
    { id: 'documento', label: 'Entregar un documento o hacer un trámite', icon: 'file', blurb: 'Expediente, titulación, servicio social, IMSS' },
    { id: 'participar', label: 'Participar en una actividad', icon: 'heart', blurb: 'Gimnasio, eventos AFI, voluntariado, deporte' },
    { id: 'opinar', label: 'Contestar una encuesta', icon: 'chat', blurb: 'Encuestas abiertas y cuestionarios' },
    { id: 'ingles', label: 'Ver mi avance de inglés', icon: 'globe', blurb: 'English UANL: kardex, horario y EXCI' },
    { id: 'cuenta', label: 'Cambiar algo de mi cuenta', icon: 'user', blurb: 'Datos, foto, contraseña, carrera y salir' }
  ];

  /* ---------- Pestañas (propuesta SIASE de Bolsillo) ---------- */
  var tabs = [
    { id: 'inicio', label: 'Inicio', icon: 'home' },
    { id: 'estudios', label: 'Estudios', icon: 'book' },
    { id: 'pagos', label: 'Pagos', icon: 'wallet' },
    { id: 'tramites', label: 'Trámites', icon: 'file' },
    { id: 'yo', label: 'Yo', icon: 'user' }
  ];
  var areaToTab = {
    inicio: 'inicio',
    estudios: 'estudios', inscripcion: 'estudios', ingles: 'estudios',
    pagos: 'pagos',
    tramites: 'tramites', vida: 'tramites', encuestas: 'tramites',
    cuenta: 'yo'
  };

  /*
   * Inventario completo. Campos:
   * id, label (nombre oficial en SIASE), plain (qué hace, en lenguaje llano),
   * module (módulo nativo), area, moment, task, endpoint, target,
   * kind: consulta | tramite | pago | encuesta | cuenta | externo | sistema
   * icon, kw (sinónimos para el buscador), has (qué contendría la pantalla)
   */
  function P(id, label, plain, module, area, moment, task, endpoint, target, kind, icon, kw, has) {
    return { id: id, label: label, plain: plain, module: module, area: area, moment: moment, task: task,
      endpoint: endpoint, target: target, kind: kind, icon: icon, kw: kw || '', has: has || [] };
  }

  var pages = [
    /* Portal */
    P('avisos', 'Avisos de interés', 'Leer los avisos oficiales de la UANL', 'inicio', 'inicio', 'durante', 'ver', 'maincenter.htm', 'center', 'consulta', 'bell',
      'noticias anuncios carrusel comunicados', ['Carrusel original de avisos con sus enlaces y PDF', 'Aviso importante en ventana emergente cuando SIASE lo envía']),

    /* Escolar: consulta académica */
    P('situacion', 'Situación estudiante UANL', 'Ver mi estatus y mi credencial digital', 'escolar', 'estudios', 'durante', 'ver', 'ecSitEst01.htm', 'center', 'consulta', 'id',
      'credencial qr estatus regular vigente inscrita inscrito', ['Semestre, estatus y tipo de inscripción', 'Credencial virtual con código QR', 'Botón Imprimir original']),
    P('creditos', 'Créditos académicos', 'Ver cuántos créditos llevo y cuántos me faltan', 'escolar', 'estudios', 'cierre', 'ver', 'esCreditoMaterias01.htm', 'center', 'consulta', 'ring',
      'avance porcentaje plan optativas faltan', ['Acordeón por semestre o área', 'Tabla Semestre, Materia, Créditos, Situación', 'Barra de avance calculada']),
    P('kardex', 'Kardex', 'Ver todas mis materias cursadas y mi promedio', 'escolar', 'estudios', 'cierre', 'ver', 'econkdx01.htm', 'center', 'consulta', 'book',
      'historial promedio materias aprobadas reprobadas oportunidades', ['Materias por semestre con sus seis oportunidades', 'Laboratorios, créditos acumulados y promedio', 'Botón Imprimir original']),
    P('horario', 'Horario', 'Ver mis clases, salones y horas', 'escolar', 'estudios', 'durante', 'ver', 'echalm01.htm', 'center', 'consulta', 'calendar',
      'clases salon aula grupo semana hoy', ['Selector de periodo', 'Cuadrícula semanal y catálogo de materias', 'Botones Regresar e Imprimir originales']),
    P('calificaciones', 'Calificaciones', 'Ver las calificaciones de este semestre', 'escolar', 'estudios', 'cierre', 'ver', 'econcfs01.htm', 'center', 'consulta', 'check',
      'notas boleta resultados parciales finales ordinario extraordinario', ['Calificación por materia y oportunidad', 'Estado cuando SIASE responde "Opción no disponible"']),
    P('evaluacion', 'Consulta de Evaluación', 'Consultar el resultado de una evaluación', 'escolar', 'estudios', 'cierre', 'ver', 'econeva01.htm', 'center', 'consulta', 'search',
      'examen resultado evaluacion', ['Formulario original de consulta (contenido por verificar en el portal)']),

    /* Escolar: inscripción */
    P('fecha-inscripcion', 'Consulta fecha de inscripción', 'Saber qué día y a qué hora me inscribo', 'escolar', 'inscripcion', 'antes', 'inscribirme', 'ecohoinsint01.htm', 'center', 'consulta', 'clock',
      'cuando turno dia hora', ['Día de inscripción y hora de inscripción', 'Cuenta regresiva calculada por la extensión']),
    P('inscripcion', 'Inscripción', 'Inscribir mis materias del siguiente semestre', 'escolar', 'inscripcion', 'antes', 'inscribirme', 'eins01.htm', 'center', 'tramite', 'clipboard',
      'materias grupos alta paquete reinscripcion', ['Formulario original de inscripción', 'La extensión nunca lo envía por ti']),
    P('preinscripcion', 'Pre-Inscripción', 'Apartar materias antes de la inscripción', 'escolar', 'inscripcion', 'antes', 'inscribirme', 'epreins01.htm', 'center', 'tramite', 'clipboard',
      'preinscripcion apartar materias', ['Formulario original de preinscripción']),
    P('inscripcion-super', 'Inscripción 1er. Ingreso Super', 'Inscribirme si soy de primer ingreso', 'escolar', 'inscripcion', 'antes', 'inscribirme', 'einssupaq01.htm', 'center', 'tramite', 'clipboard',
      'primer ingreso nuevo paquete', ['Formulario original para primer ingreso']),
    P('formato-rectoria', 'Formato Inscripción Rectoría', 'Imprimir el formato de inscripción de Rectoría', 'escolar', 'inscripcion', 'antes', 'inscribirme', 'ecinstreg01.htm', 'center', 'tramite', 'print',
      'formato hoja rectoria imprimir', ['Formato original; puede mostrar una advertencia de SIASE']),
    P('provericyt', 'Inscripción PROVERICYT', 'Inscribirme al verano de investigación', 'escolar', 'inscripcion', 'siempre', 'participar', 'EscInv_01.htm', 'center', 'tramite', 'flask',
      'verano investigacion cientifica', ['Formulario original del programa']),

    /* Escolar: pagos y becas */
    P('recibo-interno', 'Recibo Interno de Servicios Académicos y Escolares', 'Imprimir el recibo de la cuota de mi facultad', 'escolar', 'pagos', 'antes', 'pagar', 'ecavpag01.htm', 'center', 'pago', 'receipt',
      'cuota interna boleta pago adeudo facultad', ['Selección de recibo e historial originales', 'Monto, vencimiento y botón Imprimir de SIASE']),
    P('recibo-servicios', 'Recibo de Servicios Académicos y Escolares', 'Imprimir el recibo de la cuota de Rectoría', 'escolar', 'pagos', 'antes', 'pagar', 'ecBolRec-v02.htm', 'center', 'pago', 'receipt',
      'cuota rectoria boleta pago adeudo', ['Recibo original con sus tablas y ventanas']),
    P('recibo-inter-servicios', 'Intersemestral Recibo de Servicios Académicos y Escolares', 'Imprimir el recibo de Rectoría del curso intersemestral', 'escolar', 'pagos', 'siempre', 'pagar', 'ecBolRec-v03.htm', 'center', 'pago', 'receipt',
      'verano invierno intersemestral rectoria', ['Recibo original del periodo intersemestral']),
    P('recibo-inter-interno', 'Intersemestral Recibo Interno', 'Imprimir el recibo interno del curso intersemestral', 'escolar', 'pagos', 'siempre', 'pagar', 'EgenbolveranoV2.htm', 'center', 'pago', 'receipt',
      'verano invierno intersemestral interno', ['Recibo original; estado vacío si no hay curso']),
    P('recibo-asesorias', 'Genera Recibo de Cursos de Asesorías', 'Generar el recibo de un curso de asesorías', 'escolar', 'pagos', 'siempre', 'pagar', 'Egenbolsabatino.htm', 'center', 'pago', 'receipt',
      'sabatino asesoria curso', ['Formulario original para generar el recibo']),
    P('boleta-exens', 'Boleta Pago EXENS', 'Imprimir la boleta de pago del examen EXENS', 'escolar', 'pagos', 'siempre', 'pagar', 'ceregexens01.htm', 'center', 'pago', 'receipt',
      'examen exens boleta', ['Boleta original del examen']),
    P('comercio', 'Comercio Electrónico', 'Pagar en línea con tarjeta', 'escolar', 'pagos', 'siempre', 'pagar', 'eComerSrv_vr.htm', 'center', 'pago', 'card',
      'pago en linea tarjeta', ['Flujo original de pago en línea; tú confirmas cada paso']),
    P('beca-solicitud', 'Solicitud de Beca', 'Pedir una beca', 'escolar', 'pagos', 'antes', 'beca', 'bcreq01V2.htm', '_new', 'tramite', 'star',
      'apoyo descuento solicitar', ['Solicitud original; SIASE la abre en otra ventana']),
    P('beca-documentos', 'Carga y seguimiento de beca', 'Subir documentos de mi beca y ver su avance', 'escolar', 'pagos', 'antes', 'beca', 'bcerCargaDocto05.htm', '_new', 'tramite', 'upload',
      'beca documentos seguimiento', ['Carga original; SIASE la abre en otra ventana']),
    P('beca-resultado', 'Resultado de Beca', 'Saber si me dieron la beca', 'escolar', 'pagos', 'antes', 'beca', 'bccosobe01.htm', 'center', 'consulta', 'star',
      'beca aprobada rechazada resultado', ['Resultado original de la solicitud']),

    /* Tesorería */
    P('tes-credito', 'Solicitud de Crédito', 'Pedir un crédito para pagar mis cuotas', 'tesoreria', 'pagos', 'antes', 'pagar', 'tcSolCredReq01.htm', 'center', 'tramite', 'wallet',
      'prorroga credito financiamiento', ['Formulario original de Tesorería']),
    P('tes-factura', 'Solicitud de Facturas', 'Pedir la factura de un pago', 'tesoreria', 'pagos', 'siempre', 'pagar', 'gensolfac01.htm', 'center', 'tramite', 'receipt',
      'factura cfdi rfc', ['Formulario original de facturación']),
    P('tes-cancelar-factura', 'Sol. Cancelación Factura', 'Cancelar una factura', 'tesoreria', 'pagos', 'siempre', 'pagar', 'gensolcanfac01.htm', 'center', 'tramite', 'receipt',
      'cancelar factura', ['Formulario original de cancelación']),
    P('tes-factura-dep', 'Solicitud de Factura Dependencia', 'Pedir la factura de un pago a mi facultad', 'tesoreria', 'pagos', 'siempre', 'pagar', 'gensolfacdep01.htm', 'center', 'tramite', 'receipt',
      'factura dependencia facultad', ['Formulario original de facturación de la dependencia']),
    P('tes-devolucion', 'Solicitud Devolución Depend.', 'Pedir la devolución de un pago', 'tesoreria', 'pagos', 'siempre', 'pagar', 'tdev_sol_01.htm', 'center', 'tramite', 'undo',
      'reembolso devolucion', ['Formulario original de devolución']),
    P('tes-comercio', 'Comercio Electrónico TC', 'Pagar a Tesorería con tarjeta', 'tesoreria', 'pagos', 'siempre', 'pagar', 'tc_eComerSrv.htm', 'center', 'pago', 'card',
      'pago en linea tarjeta tesoreria', ['Flujo original de pago con tarjeta']),

    /* Escolar: trámites */
    P('documentos', 'Carga Documentos Pendientes', 'Subir los documentos que me faltan', 'escolar', 'tramites', 'siempre', 'documento', 'ecCargaDocto01.htm', 'center', 'tramite', 'upload',
      'expediente acta certificado curp subir archivo', ['Selector de documento y archivo originales', 'Tabla con estatus y comentario', 'Botón Enviar a Revisión original']),
    P('tramites-deya', 'Trámites DEyA', 'Seguir un trámite de Escolar y Archivo', 'escolar', 'tramites', 'siempre', 'documento', 'eccontram03.htm', 'center', 'consulta', 'file',
      'constancia certificado kardex oficial seguimiento', ['Consulta original de trámites']),
    P('titulacion', 'Trámite Titulación Dependencia', 'Empezar o seguir mi titulación', 'escolar', 'tramites', 'siempre', 'documento', 'tavpatit01.htm', 'center', 'tramite', 'cap',
      'titulo egreso cedula', ['Formulario original de titulación']),
    P('servicio-social', 'Registro Servicio Social', 'Registrar mi servicio social', 'escolar', 'tramites', 'siempre', 'documento', 'essc_rgal_00.htm', 'center', 'tramite', 'users',
      'servicio social registro horas', ['Registro original']),
    P('practicas', 'Prácticas Profesionales', 'Registrar mis prácticas profesionales', 'escolar', 'tramites', 'siempre', 'documento', 'vr_dsp_inicio_01.htm', '_top', 'externo', 'briefcase',
      'practicas empresa vinculacion', ['Sistema aparte: reemplaza toda la pantalla de SIASE']),
    P('imss', 'Registro IMSS', 'Darme de alta en el seguro del IMSS', 'escolar', 'tramites', 'antes', 'documento', 'ecSoImssV3_01.htm', 'center', 'tramite', 'shield',
      'seguro social nss afiliacion', ['Registro original']),
    P('baja', 'Solicitud de Baja Voluntaria', 'Pedir mi baja de la carrera', 'escolar', 'tramites', 'siempre', 'documento', 'ecSolBajaVol00.htm', 'center', 'tramite', 'exit',
      'baja darse de baja abandonar', ['Flujo original; es una acción delicada y tú confirmas cada paso']),
    P('exci', 'EXCI', 'Registrarme al examen de competencia en inglés', 'header', 'tramites', 'siempre', 'ingles', 'ceregexci02.htm', 'center', 'tramite', 'globe',
      'examen ingles competencia registro', ['Registro original del examen']),

    /* Escolar: vida universitaria */
    P('gimnasio', 'Reservación Gimnasio', 'Apartar mi lugar en el gimnasio', 'escolar', 'vida', 'siempre', 'participar', 'CdGymins01.htm', 'center', 'tramite', 'dumbbell',
      'gym reservar deporte ejercicio', ['Reservación original']),
    P('futbol', 'Programa Futbol Americano', 'Ver el programa de futbol americano', 'escolar', 'vida', 'siempre', 'participar', 'pfacue01.htm', 'center', 'consulta', 'trophy',
      'autenticos tigres boletos deporte', ['Página original del programa']),
    P('voluntariado', 'Voluntariado', 'Inscribirme a un voluntariado', 'escolar', 'vida', 'siempre', 'participar', 'ssc_default.htm', '_top', 'externo', 'heart',
      'voluntario ayuda comunidad', ['Sistema aparte: reemplaza toda la pantalla de SIASE']),
    P('afi-portada', 'AFI: Portada', 'Ver cuántos eventos de formación integral llevo', 'afi', 'vida', 'durante', 'participar', 'delportada01.htm', 'center', 'consulta', 'sparkle',
      'formacion integral cultura eventos', ['Portada original del módulo AFI']),
    P('afi-calendario', 'AFI: Calendario de Eventos', 'Registrarme a un evento AFI', 'afi', 'vida', 'durante', 'participar', 'delSavePrereg.htm', 'center', 'tramite', 'calendar',
      'eventos culturales deportivos registro', ['Calendario original con registro']),
    P('afi-historial', 'AFI: Historial', 'Ver los eventos AFI a los que fui', 'afi', 'vida', 'durante', 'participar', 'delConsRegEven.htm', 'center', 'consulta', 'list',
      'asistencias eventos historial', ['Historial original']),

    /* Encuestas */
    P('encuestas', 'Encuestas', 'Contestar las encuestas de mi facultad', 'escolar', 'encuestas', 'cierre', 'opinar', 'eenc01.htm', 'center', 'encuesta', 'chat',
      'evaluacion docente maestros opinion', ['Encuesta original']),
    P('encuesta-verano', 'Encuesta de Verano', 'Contestar la encuesta del curso de verano', 'escolar', 'encuestas', 'siempre', 'opinar', 'eenve01.htm', 'center', 'encuesta', 'chat',
      'verano intersemestral opinion', ['Encuesta original']),
    P('encuesta-cev', 'Encuesta - CEV', 'Contestar la encuesta CEV', 'escolar', 'encuestas', 'siempre', 'opinar', 'cemaenc01.htm', 'center', 'encuesta', 'chat',
      'cev opinion', ['Encuesta original']),
    P('huella-co2', 'Cuestionario Huella CO2', 'Contestar el cuestionario de huella de carbono', 'escolar', 'encuestas', 'siempre', 'opinar', 'DisCO2_00.htm', 'center', 'encuesta', 'leaf',
      'carbono sustentabilidad ambiente', ['Cuestionario original']),
    P('dgppe-encuestas', 'DGPPE: Encuestas', 'Contestar las encuestas institucionales', 'dgppe', 'encuestas', 'siempre', 'opinar', 'plenc01a_2.htm', 'center', 'encuesta', 'chat',
      'planeacion institucional opinion', ['Encuesta original del módulo DGPPE']),

    /* English UANL */
    P('en-kardex', 'English UANL: Consulta de Kardex', 'Ver mis niveles de inglés aprobados', 'english', 'ingles', 'cierre', 'ingles', 'sac_kardex_01.htm', 'center', 'consulta', 'book',
      'ingles niveles historial', ['Kardex original de inglés']),
    P('en-calificaciones', 'English UANL: Consulta de Calificaciones', 'Ver mis calificaciones de inglés', 'english', 'ingles', 'cierre', 'ingles', 'sac_calif_01.htm', 'center', 'consulta', 'check',
      'ingles notas', ['Calificaciones originales de inglés']),
    P('en-horario', 'English UANL: Consulta de Horario', 'Ver mi horario de inglés', 'english', 'ingles', 'durante', 'ingles', 'sac_horario_01.htm', 'center', 'consulta', 'calendar',
      'ingles clases', ['Horario original de inglés']),
    P('en-convalidacion', 'English UANL: Sol. de Convalidación', 'Pedir que me validen un certificado de inglés', 'english', 'ingles', 'siempre', 'ingles', 'sac_conv_01.htm', 'center', 'tramite', 'file',
      'toefl certificado revalidar', ['Solicitud original']),
    P('en-exci-intermedio', 'English UANL: EXCI Examen Intermedio', 'Registrarme al EXCI intermedio', 'english', 'ingles', 'siempre', 'ingles', 'sacregexciInt01.htm', 'center', 'tramite', 'globe',
      'examen ingles intermedio', ['Registro original']),
    P('en-exci-final', 'English UANL: EXCI Examen Final', 'Registrarme al EXCI final', 'english', 'ingles', 'siempre', 'ingles', 'sacregexciFin01.htm', 'center', 'tramite', 'globe',
      'examen ingles final', ['Registro original']),

    /* Cuenta: Escolar + encabezado + selector + extensión */
    P('datos', 'Datos Personales', 'Revisar y corregir mis datos personales', 'escolar', 'cuenta', 'antes', 'cuenta', 'edatal01.htm', 'center', 'cuenta', 'user',
      'direccion telefono correo contacto emergencia', ['Secciones originales con sus cinco botones Modificar', 'Botón Imprimir original', 'La extensión no guarda estos datos']),
    P('foto-subir', 'Subir Foto del Alumno', 'Subir la foto para mi credencial', 'escolar', 'cuenta', 'antes', 'cuenta', 'iaFoto01.htm', 'center', 'tramite', 'camera',
      'fotografia credencial imagen', ['Selector de archivo y botón Adjuntar Fotografía originales']),
    P('foto-consulta', 'Consulta Toma de Foto', 'Saber cuándo me toman la foto', 'escolar', 'cuenta', 'antes', 'cuenta', 'ecotofo01.htm', 'center', 'consulta', 'camera',
      'cita fotografia credencial', ['Consulta original']),
    P('contrasena', 'Contraseña', 'Cambiar mi contraseña', 'header', 'cuenta', 'cuenta', 'cuenta', 'pass01.htm', 'center', 'cuenta', 'lock',
      'password clave acceso cambiar', ['Formulario original; la extensión nunca lee ni llena estos campos']),
    P('clave', 'Clave de Seguridad', 'Configurar mi clave de seguridad', 'header', 'cuenta', 'cuenta', 'cuenta', 'cveseg01.htm', 'center', 'cuenta', 'key',
      'pregunta secreta recuperar', ['Formulario original; la extensión nunca lee ni llena estos campos']),
    P('privacidad', 'Aviso de Privacidad', 'Leer el aviso de privacidad', 'header', 'cuenta', 'cuenta', 'cuenta', 'avisopriv.htm', 'center', 'consulta', 'shield',
      'datos personales legal', ['Texto original del aviso']),
    P('carrera', 'Selector de carrera', 'Cambiar de carrera o escuela', 'carrera', 'cuenta', 'cuenta', 'cuenta', 'eselcarrera.htm', 'center', 'cuenta', 'swap',
      'cambiar carrera facultad preparatoria programa', ['Listado original de carreras', 'Paneles Correo, Nexus y Códice', 'Recordatorio de datos personales']),
    P('correo', 'Correo universitario', 'Abrir mi correo de la UANL', 'carrera', 'cuenta', 'cuenta', 'cuenta', 'eselcarrera.htm (panel #correo)', '_blank', 'externo', 'mail',
      'email outlook microsoft 365 teams', ['Enlace original a Microsoft 365']),
    P('nexus', 'Nexus', 'Abrir la plataforma de clases Nexus', 'carrera', 'cuenta', 'cuenta', 'cuenta', 'eselcarrera.htm (panel #nexus)', '_blank', 'externo', 'layers',
      'plataforma tareas actividades', ['Enlace original a Nexus']),
    P('codice', 'Códice', 'Abrir la biblioteca digital Códice', 'carrera', 'cuenta', 'cuenta', 'cuenta', 'eselcarrera.htm (panel #codice)', '_blank', 'externo', 'library',
      'biblioteca libros prestamo', ['Enlace original a Códice']),
    P('redes', 'Redes sociales de la UANL', 'Abrir las redes sociales de la UANL', 'header', 'cuenta', 'cuenta', 'cuenta', 'maintop.htm (íconos)', '_blank', 'externo', 'share',
      'facebook instagram x youtube', ['Enlaces originales del encabezado, ahora con nombre accesible']),
    P('original', 'Ver la versión original de SIASE', 'Apagar las mejoras y ver SIASE como era', 'extension', 'cuenta', 'cuenta', 'cuenta', 'interruptor de la extensión', 'top', 'sistema', 'toggle',
      'apagar desactivar clasico viejo comparar', ['Interruptor existente: recarga el portal sin mejoras']),
    P('sesion', 'Estado de la sesión', 'Entender por qué SIASE me pide entrar otra vez', 'extension', 'cuenta', 'cuenta', 'cuenta', 'mensajes de SIASE', 'center', 'sistema', 'alert',
      'sesion expirada opcion no disponible error', ['Sesión activa, opción no disponible, formulario expirado o inicio de sesión requerido', 'La extensión explica el estado; nunca reingresa por ti']),
    P('salir', 'Salir', 'Cerrar mi sesión', 'header', 'cuenta', 'cuenta', 'cuenta', 'cerrar.htm', 'left', 'cuenta', 'logout',
      'cerrar sesion logout terminar', ['Activa el enlace Salir original; es la única forma de cerrar sesión'])
  ];

  var byId = {};
  pages.forEach(function (p) { byId[p.id] = p; });

  /* ---------- Estudiante ficticia ---------- */
  var student = {
    name: 'Daniela Ríos Cantú',
    first: 'Daniela',
    initials: 'DR',
    matricula: '1234567',
    faculty: 'Facultad de Ingeniería Mecánica y Eléctrica',
    facultyShort: 'FIME',
    program: 'Ingeniero Administrador de Sistemas',
    plan: 'Plan 401',
    semester: 5,
    period: 'Agosto–Diciembre 2026',
    status: 'Regular',
    enrollment: 'Inscripción ordinaria',
    credits: { done: 96, total: 220 },
    average: 88.6,
    email: 'daniela.riosc@ejemplo.uanl.mx',
    today: { label: 'Lunes 16 de noviembre', day: 'L', time: '8:10', week: 16, weeks: 20 }
  };

  var careers = [
    { id: 'c1', school: 'Facultad de Ingeniería Mecánica y Eléctrica', program: 'Ingeniero Administrador de Sistemas', level: 'Licenciatura', state: 'Activa', current: true },
    { id: 'c2', school: 'Escuela Preparatoria No. 7', program: 'Bachillerato General', level: 'Bachillerato', state: 'Egresada', current: false }
  ];

  /* ---------- Horario ficticio ---------- */
  var days = [
    { id: 'L', label: 'Lunes', short: 'Lun' }, { id: 'M', label: 'Martes', short: 'Mar' },
    { id: 'X', label: 'Miércoles', short: 'Mié' }, { id: 'J', label: 'Jueves', short: 'Jue' },
    { id: 'V', label: 'Viernes', short: 'Vie' }, { id: 'S', label: 'Sábado', short: 'Sáb' }
  ];
  var hours = ['7:00', '7:50', '8:40', '9:30', '10:20', '11:10', '12:00'];
  var courses = [
    { id: 'BDL', name: 'Bases de Datos y Lenguajes', group: '004', room: '4203', teacher: 'Mtro. H. Salinas', days: ['L', 'X', 'V'], start: 0, len: 1 },
    { id: 'SO', name: 'Sistemas Operativos', group: '004', room: '4203', teacher: 'Dra. P. Lozano', days: ['L', 'X', 'V'], start: 1, len: 1 },
    { id: 'PYE', name: 'Probabilidad y Estadística', group: '012', room: '2301', teacher: 'Mtra. A. Treviño', days: ['L', 'X', 'V'], start: 2, len: 1 },
    { id: 'AP', name: 'Administración de Proyectos', group: '003', room: '5102', teacher: 'Ing. R. Cavazos', days: ['M', 'J'], start: 0, len: 2 },
    { id: 'RC', name: 'Redes de Computadoras', group: '007', room: '4105', teacher: 'Dr. E. Garza', days: ['M', 'J'], start: 2, len: 2 },
    { id: 'LBD', name: 'Laboratorio de Bases de Datos', group: '105', room: 'Lab. 3', teacher: 'Ing. S. Molina', days: ['J'], start: 4, len: 2, lab: true },
    { id: 'CP', name: 'Cultura de Paz', group: '021', room: '1104', teacher: 'Lic. M. Elizondo', days: ['V'], start: 4, len: 2 }
  ];
  function endHour(c) { return hours[c.start + c.len]; }
  function classesOn(dayId) {
    return courses.filter(function (c) { return c.days.indexOf(dayId) >= 0; })
      .sort(function (a, b) { return a.start - b.start; });
  }

  /* ---------- Calificaciones ficticias ---------- */
  var grades = {
    current: {
      period: 'Agosto–Diciembre 2026',
      rows: [
        { c: 'Cultura de Paz', op1: 95 }, { c: 'Administración de Proyectos', op1: 90 },
        { c: 'Bases de Datos y Lenguajes', op1: null }, { c: 'Sistemas Operativos', op1: null },
        { c: 'Probabilidad y Estadística', op1: null }, { c: 'Redes de Computadoras', op1: null },
        { c: 'Laboratorio de Bases de Datos', op1: null }
      ]
    },
    previous: {
      period: 'Enero–Junio 2026',
      rows: [
        { c: 'Estructura de Datos', op1: 92 }, { c: 'Ecuaciones Diferenciales', op1: 58, op2: 78 },
        { c: 'Contabilidad Administrativa', op1: 88 }, { c: 'Programación Orientada a Objetos', op1: 96 },
        { c: 'Electricidad y Magnetismo', op1: 81 }, { c: 'Ética y Cultura de la Legalidad', op1: 100 }
      ]
    }
  };

  /* ---------- Kardex ficticio (por semestre) ---------- */
  var kardex = [
    { sem: 1, period: 'Ago–Dic 2024', rows: [['Álgebra para Ingeniería', 90], ['Cálculo Diferencial', 84], ['Programación Básica', 98], ['Química General', 79], ['Dibujo para Ingeniería', 93], ['Responsabilidad Social', 100]] },
    { sem: 2, period: 'Ene–Jun 2025', rows: [['Cálculo Integral', 82], ['Física I', 76], ['Programación Estructurada', 95], ['Álgebra Lineal', 88], ['Lab. de Física I', 91], ['Liderazgo y Emprendimiento', 97]] },
    { sem: 3, period: 'Ago–Dic 2025', rows: [['Matemáticas Discretas', 89], ['Física II', 80], ['Administración', 92], ['Circuitos Lógicos', 85], ['Lab. de Circuitos Lógicos', 94], ['Economía', 87]] },
    { sem: 4, period: 'Ene–Jun 2026', rows: [['Estructura de Datos', 92], ['Ecuaciones Diferenciales', 78, 2], ['Contabilidad Administrativa', 88], ['Programación Orientada a Objetos', 96], ['Electricidad y Magnetismo', 81], ['Ética y Cultura de la Legalidad', 100]] },
    { sem: 5, period: 'Ago–Dic 2026', current: true, rows: [['Bases de Datos y Lenguajes', null], ['Sistemas Operativos', null], ['Probabilidad y Estadística', null], ['Administración de Proyectos', 90], ['Redes de Computadoras', null], ['Lab. de Bases de Datos', null], ['Cultura de Paz', 95]] }
  ];

  /* ---------- Recibos ficticios ---------- */
  var receipts = [
    { id: 'r1', concept: 'Cuota interna FIME, 2.ª parcialidad', page: 'recibo-interno', amount: 3150, due: '20 de noviembre', dueIn: 4, state: 'pendiente', ref: '0000 1111 2222 3333' },
    { id: 'r2', concept: 'Examen EXCI', page: 'exci', amount: 380, due: '28 de noviembre', dueIn: 12, state: 'pendiente', ref: '0000 4444 5555 6666' },
    { id: 'r3', concept: 'Cuota de Rectoría Ago–Dic 2026', page: 'recibo-servicios', amount: 2980, paid: '4 de agosto', state: 'pagado' },
    { id: 'r4', concept: 'Cuota interna FIME, 1.ª parcialidad', page: 'recibo-interno', amount: 3150, paid: '6 de agosto', state: 'pagado' },
    { id: 'r5', concept: 'Curso de asesorías sabatino', page: 'recibo-asesorias', amount: 450, paid: '12 de septiembre', state: 'pagado' }
  ];
  var owed = receipts.filter(function (r) { return r.state === 'pendiente'; })
    .reduce(function (s, r) { return s + r.amount; }, 0);

  /* ---------- Documentos, avisos y fechas clave ficticias ---------- */
  var documents = [
    { name: 'Acta de nacimiento', date: '12 de agosto', state: 'aceptado', note: '' },
    { name: 'CURP', date: '12 de agosto', state: 'aceptado', note: '' },
    { name: 'Certificado de bachillerato', date: '14 de agosto', state: 'rechazado', note: 'La imagen no se lee. Súbelo otra vez en PDF.' }
  ];
  var notices = [
    { title: 'Calendario de exámenes ordinarios', date: '13 de noviembre', text: 'Los exámenes ordinarios son del 30 de noviembre al 5 de diciembre.', kind: 'PDF' },
    { title: 'Mantenimiento de SIASE', date: '12 de noviembre', text: 'El portal no estará disponible el domingo 22 de noviembre de 0:00 a 8:00.', kind: 'Aviso' },
    { title: 'Convocatoria de becas Enero–Junio 2027', date: '9 de noviembre', text: 'La solicitud abre el 23 de noviembre.', kind: 'Enlace' }
  ];
  /* week = semana del semestre; sirve a la regla del semestre */
  var timeline = [
    { week: 1, date: '3 de agosto', title: 'Inicio de clases', page: 'horario', state: 'hecho' },
    { week: 1, date: '4 de agosto', title: 'Pagaste la cuota de Rectoría', page: 'recibo-servicios', state: 'hecho' },
    { week: 2, date: '14 de agosto', title: 'Entregaste 3 documentos', page: 'documentos', state: 'hecho' },
    { week: 16, date: 'Hoy', title: 'Tienes 3 clases', page: 'horario', state: 'hoy' },
    { week: 16, date: '20 de noviembre', title: 'Vence la cuota interna: $3,150.00', page: 'recibo-interno', state: 'urgente' },
    { week: 16, date: 'Sin fecha', title: 'Vuelve a subir tu certificado de bachillerato', page: 'documentos', state: 'urgente' },
    { week: 17, date: '27 de noviembre', title: 'Cierra la encuesta de tu facultad', page: 'encuestas', state: 'pendiente' },
    { week: 17, date: '28 de noviembre', title: 'Vence el pago del EXCI: $380.00', page: 'exci', state: 'pendiente' },
    { week: 18, date: '30 de noviembre', title: 'Empiezan los exámenes ordinarios', page: 'avisos', state: 'pendiente' },
    { week: 19, date: '11 de diciembre', title: 'Salen las calificaciones finales', page: 'calificaciones', state: 'pendiente' },
    { week: 20, date: '14 de enero, 10:30', title: 'Tu inscripción a Enero–Junio 2027', page: 'fecha-inscripcion', state: 'pendiente' }
  ];
  var enrollment = { day: 'Jueves 14 de enero de 2027', time: '10:30', inDays: 59 };

  /* ---------- Docente ficticio ----------
   * El portal docente NO está auditado en el repositorio. Estas pantallas se basan
   * en el catálogo de servicios de la DTyDD de la UANL, que lista para docentes:
   * horario de clase, listas de clase, captura de calificaciones parciales y finales,
   * seguimiento a tutorías, encuestas, datos personales y expediente para estímulos.
   */
  var teacher = {
    name: 'Mtro. Héctor Salinas Villarreal', first: 'Héctor', initials: 'HS',
    employee: '012345', faculty: 'Facultad de Ingeniería Mecánica y Eléctrica', facultyShort: 'FIME',
    period: 'Agosto–Diciembre 2026',
    capture: { name: 'Segundo parcial', due: '20 de noviembre', dueIn: 4 }
  };
  var groups = [
    { id: 'g1', course: 'Bases de Datos y Lenguajes', group: '004', room: '4203', days: ['L', 'X', 'V'], start: 0, len: 1, size: 38, captured: 38 },
    { id: 'g2', course: 'Bases de Datos y Lenguajes', group: '009', room: '4207', days: ['L', 'X', 'V'], start: 3, len: 1, size: 35, captured: 21 },
    { id: 'g3', course: 'Laboratorio de Bases de Datos', group: '105', room: 'Lab. 3', days: ['J'], start: 4, len: 2, size: 22, captured: 0 }
  ];
  var roster = [
    ['9000001', 'Aguirre Peña, Sofía', 92], ['9000002', 'Benavides Luna, Marco', 85], ['9000003', 'Cárdenas Ruiz, Ximena', null],
    ['9000004', 'Domínguez Sáenz, Iván', 74], ['9000005', 'Espinosa Vela, Regina', null], ['9000006', 'Flores Tamez, Emilio', 61],
    ['9000007', 'González Ibarra, Andrea', 98], ['9000008', 'Herrera Nava, Luis', null]
  ];
  function T(id, label, plain, icon, kw, has) { return { id: id, label: label, plain: plain, icon: icon, kw: kw, has: has, teacher: true }; }
  var teacherPages = [
    T('d-grupos', 'Mis grupos y listas de clase', 'Ver mis grupos y quién está en cada uno', 'users', 'lista alumnos estudiantes grupo asistencia', ['Grupos del periodo', 'Lista de clase con matrícula y nombre', 'Imprimir lista']),
    T('d-captura', 'Captura de calificaciones', 'Capturar calificaciones parciales y finales', 'edit', 'minuta parcial final capturar notas', ['Grupo, evaluación y fecha límite', 'Una fila por estudiante', 'Avance de captura y envío de la minuta']),
    T('d-horario', 'Horario de clase', 'Ver mis clases y salones', 'calendar', 'clases salon semana', ['Cuadrícula semanal del periodo']),
    T('d-tutorias', 'Seguimiento a tutorías', 'Registrar las sesiones con mis tutorados', 'chat', 'tutorados tutoria sesiones', ['Lista de tutorados', 'Sesiones registradas y pendientes']),
    T('d-encuestas', 'Encuestas', 'Contestar las encuestas institucionales', 'chat', 'dgppe opinion', ['Encuestas abiertas para docentes']),
    T('d-datos', 'Datos personales', 'Validar y actualizar mis datos en SIASE-RH', 'user', 'recursos humanos direccion telefono', ['Datos personales registrados en SIASE-RH']),
    T('d-expediente', 'Expediente para estímulos', 'Actualizar mi expediente de estímulos', 'file', 'estimulos productividad documentos', ['Documentos del expediente y su estado'])
  ];
  var teacherById = {};
  teacherPages.forEach(function (p) { teacherById[p.id] = p; });
  /* Páginas de cuenta que también aplican a docentes */
  var teacherAccount = ['contrasena', 'clave', 'privacidad', 'original', 'sesion', 'salir'];

  window.SIASE = {
    modules: modules, areas: areas, moments: moments, tasks: tasks, tabs: tabs, areaToTab: areaToTab,
    pages: pages, byId: byId,
    student: student, careers: careers, days: days, hours: hours, courses: courses,
    endHour: endHour, classesOn: classesOn,
    grades: grades, kardex: kardex, receipts: receipts, owed: owed,
    documents: documents, notices: notices, timeline: timeline, enrollment: enrollment,
    teacher: teacher, groups: groups, roster: roster,
    teacherPages: teacherPages, teacherById: teacherById, teacherAccount: teacherAccount
  };
})();
