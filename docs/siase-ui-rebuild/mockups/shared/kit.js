/*
 * Kit compartido de los prototipos: íconos, pantallas de contenido, buscador,
 * cambio de rol y enrutador por hash. Sin dependencias; funciona con file://.
 * Cada prototipo aporta su propia navegación, su inicio y su estilo.
 */
(function () {
  'use strict';
  var S = window.SIASE;

  /* ---------- Íconos SVG en línea (trazo, 24×24) ---------- */
  var I = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 8h7"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
    wallet: '<path d="M3 7a2 2 0 0 1 2-2h13v4"/><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 13.5h2"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3.5-5 7-5s7 1.5 7 5M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2.5.5 4 2 4 5"/>',
    chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-7"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 16c.6-1.6 2-2.3 3.5-2.3s2.9.7 3.5 2.3M15 10h4M15 14h3"/>',
    ring: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 8 8" stroke-width="3.2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 15h9"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
    undo: '<path d="M8 5L3 10l5 5"/><path d="M3 10h11a5 5 0 0 1 0 10h-3"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c2 2 10 2 12 0v-4.5M22 9v6"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 13h18"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    exit: '<path d="M6 21V3h9v18M4 21h16M12 12h.01"/>',
    logout: '<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/>',
    dumbbell: '<path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4c0 3 1.5 4 3 4M17 6h3c0 3-1.5 4-3 4M12 14v4M8 21h8"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16v4M17 18h4"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
    swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    library: '<path d="M4 20V5M8 20V5M12 20V8M15.5 8.5l4 11M3 20h18"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8"/>',
    toggle: '<rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="8" cy="12" r="2.5"/>',
    alert: '<path d="M12 3l10 17H2z"/><path d="M12 10v4M12 17h.01"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
    chevron: '<path d="M9 5l7 7-7 7"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    text: '<path d="M3 19L8 6l5 13M5 15h6M15 19l3-8 3 8M16 17h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    dot: '<circle cx="12" cy="12" r="3"/>'
  };
  S.icon = function (name, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (I[name] || I.dot) + '</svg>';
  };
  var icon = S.icon;

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function money(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function fold(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  S.esc = esc; S.money = money; S.fold = fold;
  S.href = function (id) { return '#/p/' + id; };

  /* ---------- Rol y tamaño de texto ---------- */
  var role = 'estudiante';
  try { role = localStorage.getItem('siase-mock-role') || role; } catch (e) { /* sin almacenamiento */ }
  /* index.html?rol=docente abre el prototipo directamente en la vista docente */
  if (/[?&]rol=docente/.test(location.search)) role = 'docente';
  if (/[?&]rol=estudiante/.test(location.search)) role = 'estudiante';
  S.getRole = function () { return role; };
  S.isTeacher = function () { return role === 'docente'; };
  S.setRole = function (next) {
    role = next === 'docente' ? 'docente' : 'estudiante';
    try { localStorage.setItem('siase-mock-role', role); } catch (e) { /* sin almacenamiento */ }
  };
  S.person = function () { return S.isTeacher() ? S.teacher : S.student; };
  S.roleSwitch = function () {
    function b(r, label) {
      return '<button type="button" data-role="' + r + '" aria-pressed="' + (role === r) + '">' + label + '</button>';
    }
    return '<div class="k-seg" role="group" aria-label="Ver el prototipo como">' + b('estudiante', 'Estudiante') + b('docente', 'Docente') + '</div>';
  };
  S.textSizeButton = function () {
    return '<button type="button" class="k-tool" data-textsize aria-pressed="false">' + icon('text') + '<span>Texto más grande</span></button>';
  };

  /* Franja común a los cinco prototipos: volver al índice, rol y tamaño de texto */
  S.protoBar = function (n, name) {
    return '<div class="k-proto"><a href="../index.html">' + icon('back') + '<span>Las 5 propuestas</span></a>' +
      '<span class="k-proto__name">Propuesta ' + n + ': ' + name + '</span>' +
      '<span class="k-proto__tools">' + S.roleSwitch() + S.textSizeButton() + '</span></div>';
  };
  S.crumbs = function (items) {
    return '<nav class="k-crumbs" aria-label="Ruta"><ol>' + items.map(function (it, i) {
      return '<li>' + (it[1] && i < items.length - 1 ? '<a href="' + it[1] + '">' + esc(it[0]) + '</a>' : '<span aria-current="page">' + esc(it[0]) + '</span>') + '</li>';
    }).join('') + '</ol></nav>';
  };

  /* Páginas visibles según el rol */
  S.pagesFor = function () {
    if (!S.isTeacher()) return S.pages;
    return S.teacherPages.concat(S.teacherAccount.map(function (id) { return S.byId[id]; }));
  };
  S.find = function (id) { return S.byId[id] || S.teacherById[id]; };

  /* ---------- Buscador: coincide con nombre oficial, frase llana y sinónimos ---------- */
  S.search = function (q) {
    var words = fold(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return S.pagesFor().map(function (p) {
      /* se compara al inicio de cada palabra para que "pagar" no encuentre "apagar" */
      var label = ' ' + fold(p.label), plain = ' ' + fold(p.plain);
      var kw = ' ' + fold(p.kw || '') + (p.kind === 'pago' ? ' pagar pago recibo' : '');
      var score = 0;
      for (var i = 0; i < words.length; i++) {
        var w = ' ' + words[i], s = 0;
        /* raíz simple: "recibos" también encuentra "recibo" */
        var stem = w.length > 6 ? w.slice(0, -2) : w;
        if (label.indexOf(w) === 0) s = 6; else if (label.indexOf(w) >= 0) s = 5;
        else if (plain.indexOf(w) >= 0) s = 4; else if (kw.indexOf(w) >= 0) s = 3;
        else if ((label + plain + kw).indexOf(stem) >= 0) s = 1;
        if (!s) return null;
        score += s;
      }
      return { page: p, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).map(function (r) { return r.page; });
  };

  /* ---------- Piezas pequeñas ---------- */
  function badge(kind, text) {
    var ic = { good: 'check', warn: 'clock', bad: 'alert', info: 'info' }[kind] || 'info';
    return '<span class="k-badge is-' + kind + '">' + icon(ic) + esc(text) + '</span>';
  }
  function bar(value, max, label) {
    var pct = Math.round(value / max * 100);
    return '<div class="k-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + max + '" aria-valuenow="' + value + '" aria-label="' + esc(label) + '"><span style="width:' + pct + '%"></span></div>';
  }
  function stat(label, value, sub) {
    return '<div class="k-stat"><span class="k-stat__label">' + esc(label) + '</span><strong class="k-stat__value">' + value + '</strong>' + (sub ? '<span class="k-stat__sub">' + sub + '</span>' : '') + '</div>';
  }
  function nativeBtn(label, ic, primary) {
    return '<button type="button" class="k-btn' + (primary ? ' k-btn--primary' : '') + '" data-native="' + esc(label) + '">' + (ic ? icon(ic) : '') + esc(label) + '</button>';
  }
  function targetBadge(p) {
    if (p.target === '_new' || p.target === '_blank') return '<span class="k-chip">' + icon('external') + 'Abre otra ventana</span>';
    if (p.target === '_top') return '<span class="k-chip">' + icon('external') + 'Sale de SIASE</span>';
    return '';
  }
  S.badge = badge; S.bar = bar; S.stat = stat; S.nativeBtn = nativeBtn; S.targetBadge = targetBadge;

  /* Fila enlazada a una página. opts.primary: 'plain' (frase llana) o 'label' (nombre oficial) */
  S.row = function (p, opts) {
    opts = opts || {};
    var plainFirst = opts.primary === 'plain';
    var main = plainFirst ? p.plain : p.label, sub = plainFirst ? p.label : p.plain;
    return '<a class="k-row" href="#/p/' + p.id + '">' +
      '<span class="k-row__ic">' + icon(p.icon) + '</span>' +
      '<span class="k-row__tx"><b>' + esc(main) + '</b>' + (opts.noSub ? '' : '<small>' + esc(sub) + '</small>') + '</span>' +
      (opts.meta ? opts.meta(p) : targetBadge(p)) + icon('chevron', 'k-row__go') + '</a>';
  };
  S.rows = function (list, opts) {
    return '<ul class="k-rows">' + list.map(function (p) { return '<li>' + S.row(p, opts) + '</li>'; }).join('') + '</ul>';
  };

  /* Nota que explica dónde vive la pantalla en el SIASE original */
  S.nativeNote = function (p) {
    if (p.teacher) {
      return '<aside class="k-native">' + icon('info') + '<p><b>Pantalla docente sin auditar.</b> El repositorio solo documenta el portal de estudiantes. Esta pantalla sigue el catálogo de servicios de la UANL para docentes y habría que confirmarla con una cuenta docente real.</p></aside>';
    }
    var where = { center: 'se abre en el marco central', left: 'se carga en el marco izquierdo', top: 'recarga el portal',
      _new: 'SIASE la abre en otra ventana', _blank: 'se abre en otra pestaña', _top: 'reemplaza toda la pantalla de SIASE' }[p.target];
    var extra = '';
    if (p.kind === 'pago' || p.id === 'inscripcion' || p.id === 'baja') extra = ' Tú confirmas cada paso: la extensión nunca envía este formulario por ti.';
    return '<aside class="k-native">' + icon('info') + '<p><b>En el SIASE original:</b> ' + esc(S.modules[p.module]) + ' › ' + esc(p.label) +
      ' (<code>' + esc(p.endpoint) + '</code>), ' + where + '. La extensión muestra la página original con mejor presentación y activa sus botones nativos.' + extra + '</p></aside>';
  };

  /* ================= Pantallas de estudiante ================= */
  var V = {};

  function approvedCount() {
    var n = 0;
    S.kardex.forEach(function (s) { s.rows.forEach(function (r) { if (r[1] != null && r[1] >= 70) n++; }); });
    return n;
  }

  V.kardex = function () {
    var st = S.student, c = st.credits;
    var html = '<div class="k-stats">' +
      stat('Promedio general', st.average.toFixed(1), 'de 100') +
      stat('Créditos', c.done + ' de ' + c.total, bar(c.done, c.total, 'Créditos aprobados')) +
      stat('Materias aprobadas', approvedCount(), 'contando 2 de este semestre') +
      '</div>';
    S.kardex.slice().reverse().forEach(function (s) {
      html += '<section class="k-block"><h2>Semestre ' + s.sem + ' <small>' + s.period + (s.current ? ', en curso' : '') + '</small></h2>' +
        '<div class="k-scroll"><table class="k-table"><thead><tr><th scope="col">Materia</th><th scope="col" class="num">Calificación</th><th scope="col">Estado</th></tr></thead><tbody>' +
        s.rows.map(function (r) {
          var state = r[1] == null ? badge('info', 'Cursando') : (r[2] ? badge('warn', 'Aprobada en ' + r[2] + '.ª oportunidad') : badge('good', 'Aprobada'));
          return '<tr><th scope="row">' + esc(r[0]) + '</th><td class="num">' + (r[1] == null ? '<span class="k-muted">Sin calificación</span>' : '<b>' + r[1] + '</b>') + '</td><td>' + state + '</td></tr>';
        }).join('') + '</tbody></table></div></section>';
    });
    return html + '<div class="k-actions">' + nativeBtn('Imprimir kardex', 'print') + '</div>';
  };

  function weekGrid(list, opts) {
    opts = opts || {};
    var now = opts.now;
    var covered = {};
    var html = '<div class="k-scroll k-week-wrap"><table class="k-week"><caption class="sr-only">Horario semanal</caption><thead><tr><th scope="col">Hora</th>' +
      S.days.map(function (d) { return '<th scope="col"' + (now && d.id === now.day ? ' class="is-today"' : '') + '>' + d.label + '</th>'; }).join('') + '</tr></thead><tbody>';
    for (var h = 0; h < S.hours.length - 1; h++) {
      html += '<tr><th scope="row">' + S.hours[h] + '</th>';
      S.days.forEach(function (d) {
        if (covered[d.id + h]) return;
        var c = list.filter(function (x) { return x.days.indexOf(d.id) >= 0 && x.start === h; })[0];
        if (!c) { html += '<td></td>'; return; }
        for (var k = 1; k < c.len; k++) covered[d.id + (h + k)] = true;
        var isNow = now && d.id === now.day && opts.nowSlot === h;
        html += '<td rowspan="' + c.len + '" class="k-class' + (c.lab ? ' is-lab' : '') + (isNow ? ' is-now' : '') + '"><b>' + esc(c.name || c.course) + '</b><span>Salón ' + esc(c.room) + '</span><span>Grupo ' + esc(c.group) + '</span>' + (isNow ? '<em>Ahora</em>' : '') + '</td>';
      });
      html += '</tr>';
    }
    return html + '</tbody></table></div>';
  }
  function dayList(list, opts) {
    opts = opts || {};
    return '<div class="k-days">' + S.days.map(function (d) {
      var cs = list.filter(function (x) { return x.days.indexOf(d.id) >= 0; }).sort(function (a, b) { return a.start - b.start; });
      var today = opts.now && opts.now.day === d.id;
      return '<section class="k-day' + (today ? ' is-today' : '') + '"><h3>' + d.label + (today ? ' <small>hoy</small>' : '') + '</h3>' +
        (cs.length ? '<ol>' + cs.map(function (c) {
          return '<li><time>' + S.hours[c.start] + '–' + S.hours[c.start + c.len] + '</time><span><b>' + esc(c.name || c.course) + '</b><small>Salón ' + esc(c.room) + ', grupo ' + esc(c.group) + (c.teacher ? ', ' + esc(c.teacher) : '') + '</small></span></li>';
        }).join('') + '</ol>' : '<p class="k-muted">Sin clases</p>') + '</section>';
    }).join('') + '</div>';
  }
  S.weekGrid = weekGrid; S.dayList = dayList;

  function periodSelect() {
    return '<label class="k-field"><span>Periodo</span><select data-native="Periodo"><option>Semestral Agosto–Diciembre 2026</option><option>Semestral Enero–Junio 2026</option><option>Semestral Agosto–Diciembre 2025</option></select></label>';
  }
  V.horario = function () {
    return '<div class="k-toolbar">' + periodSelect() + nativeBtn('Imprimir horario', 'print') + '</div>' +
      weekGrid(S.courses, { now: S.student.today, nowSlot: 1 }) + dayList(S.courses, { now: S.student.today });
  };

  function gradeTable(set, open) {
    return '<section class="k-block"><h2>' + set.period + (open ? ' <small>en curso</small>' : '') + '</h2><div class="k-scroll"><table class="k-table"><thead><tr><th scope="col">Materia</th><th scope="col" class="num">1.ª oportunidad</th><th scope="col" class="num">2.ª oportunidad</th><th scope="col">Estado</th></tr></thead><tbody>' +
      set.rows.map(function (r) {
        var fin = r.op2 != null ? r.op2 : r.op1;
        var state = fin == null ? badge('info', 'Aún sin calificación') : fin >= 70 ? badge(r.op2 != null ? 'warn' : 'good', r.op2 != null ? 'Aprobada en 2.ª' : 'Aprobada') : badge('bad', 'No aprobada');
        return '<tr><th scope="row">' + esc(r.c) + '</th><td class="num">' + (r.op1 == null ? '<span class="k-muted">Pendiente</span>' : '<b>' + r.op1 + '</b>') + '</td><td class="num">' + (r.op2 == null ? '' : '<b>' + r.op2 + '</b>') + '</td><td>' + state + '</td></tr>';
      }).join('') + '</tbody></table></div></section>';
  }
  V.calificaciones = function () {
    var cur = S.grades.current, done = cur.rows.filter(function (r) { return r.op1 != null; }).length;
    return '<div class="k-stats">' + stat('Publicadas este semestre', done + ' de ' + cur.rows.length, bar(done, cur.rows.length, 'Calificaciones publicadas')) +
      stat('Finales completas', '11 de diciembre', 'fecha estimada') + '</div>' +
      gradeTable(cur, true) + gradeTable(S.grades.previous, false);
  };

  /* Recibos: lista compartida. filter = id de página nativa o nada para todos */
  function receiptList(filter) {
    var list = S.receipts.filter(function (r) { return !filter || r.page === filter; });
    var pend = list.filter(function (r) { return r.state === 'pendiente'; });
    var paid = list.filter(function (r) { return r.state === 'pagado'; });
    var html = '';
    if (pend.length) {
      html += '<section class="k-block"><h2>Por pagar</h2><ul class="k-receipts">' + pend.map(function (r) {
        return '<li class="k-receipt is-due"><div class="k-receipt__main"><b>' + esc(r.concept) + '</b>' + badge(r.dueIn <= 5 ? 'bad' : 'warn', 'Vence el ' + r.due + ' (en ' + r.dueIn + ' días)') +
          '<small>Referencia ' + r.ref + '</small></div><strong class="k-receipt__amt">' + money(r.amount) + '</strong>' +
          '<div class="k-receipt__act">' + nativeBtn('Imprimir recibo', 'print', true) + '<a class="k-btn" href="#/p/comercio">' + icon('card') + 'Pagar en línea</a></div></li>';
      }).join('') + '</ul></section>';
    }
    if (paid.length) {
      html += '<section class="k-block"><h2>Pagados</h2><ul class="k-receipts">' + paid.map(function (r) {
        return '<li class="k-receipt"><div class="k-receipt__main"><b>' + esc(r.concept) + '</b>' + badge('good', 'Pagado el ' + r.paid) + '</div><strong class="k-receipt__amt">' + money(r.amount) + '</strong>' +
          '<div class="k-receipt__act">' + nativeBtn('Ver comprobante', 'receipt') + '</div></li>';
      }).join('') + '</ul></section>';
    }
    if (!list.length) html += '<p class="k-empty">No tienes recibos de este tipo en ' + S.student.period + '.</p>';
    return html;
  }
  S.receiptList = receiptList;
  V['recibo-interno'] = function () { return receiptList('recibo-interno'); };
  V['recibo-servicios'] = function () { return receiptList('recibo-servicios'); };
  V['recibo-asesorias'] = function () { return receiptList('recibo-asesorias'); };
  V['recibo-inter-interno'] = function () { return receiptList('recibo-inter-interno'); };
  V['recibo-inter-servicios'] = function () { return receiptList('recibo-inter-servicios'); };
  /* Resumen de pagos: lo usan las propuestas para su pantalla de Tesorería o Pagos */
  S.paymentsOverview = function () {
    return '<div class="k-stats">' + stat('Por pagar', money(S.owed), '2 recibos pendientes') + stat('Próximo vencimiento', '20 de noviembre', 'en 4 días') + stat('Pagado este semestre', money(6580), '3 recibos') + '</div>' + receiptList();
  };

  V.carrera = function () {
    return '<fieldset class="k-careers"><legend>Elige con qué carrera quieres entrar</legend>' + S.careers.map(function (c) {
      return '<button type="button" class="k-career' + (c.current ? ' is-current' : '') + '" data-native="Entrar a ' + esc(c.program) + '" aria-pressed="' + c.current + '">' +
        '<span class="k-career__ic">' + icon(c.level === 'Licenciatura' ? 'cap' : 'book') + '</span><span class="k-career__tx"><b>' + esc(c.program) + '</b><small>' + esc(c.school) + '</small></span>' +
        badge(c.current ? 'good' : 'info', c.current ? 'Estás aquí' : c.state) + '</button>';
    }).join('') + '</fieldset>' +
      '<p class="k-muted">Si no aparece tu carrera, acude al departamento escolar de tu facultad.</p>' +
      '<section class="k-block"><h2>Otros servicios de la UANL</h2>' + S.rows([S.byId.correo, S.byId.nexus, S.byId.codice], { primary: 'label' }) + '</section>';
  };
  function ext(p, text) {
    return '<p>' + text + '</p><div class="k-actions">' + nativeBtn('Abrir ' + p.label, 'external', true) + '</div>';
  }
  V.correo = function (p) { return ext(p, 'Tu correo es <b>' + S.student.email + '</b>. Se abre en Microsoft 365, fuera de SIASE.'); };
  V.nexus = function (p) { return ext(p, 'Nexus es la plataforma de tareas y actividades de tus clases. Se abre fuera de SIASE.'); };
  V.codice = function (p) { return ext(p, 'Códice es el sistema de bibliotecas de la UANL. Se abre fuera de SIASE.'); };
  V.redes = function (p) { return ext(p, 'El encabezado original tiene íconos sin texto hacia las redes de la UANL. Aquí cada enlace lleva su nombre.'); };

  function fakeQr() {
    function finder(x, y) {
      return '<rect x="' + x + '" y="' + y + '" width="3" height="3"/><rect x="' + (x + 0.6) + '" y="' + (y + 0.6) + '" width="1.8" height="1.8" fill="#fff"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="1" height="1"/>';
    }
    var cells = finder(0, 0) + finder(8, 0) + finder(0, 8);
    for (var y = 0; y < 11; y++) for (var x = 0; x < 11; x++) {
      if ((x < 4 && y < 4) || (x > 6 && y < 4) || (x < 4 && y > 6)) continue;
      if ((x * 7 + y * 13 + x * y) % 3 === 0) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg class="k-qr" viewBox="-1 -1 13 13" role="img" aria-label="Código QR de ejemplo"><rect x="-1" y="-1" width="13" height="13" fill="#fff"/><g fill="#111">' + cells + '</g></svg>';
  }
  V.situacion = function () {
    var st = S.student;
    return '<div class="k-cred-wrap"><div class="k-cred"><div class="k-cred__top"><span>Universidad Autónoma de Nuevo León</span><b>Credencial digital</b></div>' +
      '<div class="k-cred__body"><span class="k-avatar" aria-hidden="true">' + st.initials + '</span><div><b>' + esc(st.name) + '</b><span>Matrícula ' + st.matricula + '</span><span>' + esc(st.program) + '</span><span>' + st.facultyShort + '</span></div>' + fakeQr() + '</div>' +
      '<div class="k-cred__foot">' + badge('good', 'Vigente en ' + st.period) + '</div></div>' +
      '<dl class="k-dl"><div><dt>Semestre</dt><dd>' + st.semester + '.º</dd></div><div><dt>Estatus</dt><dd>' + st.status + '</dd></div><div><dt>Tipo de inscripción</dt><dd>' + st.enrollment + '</dd></div><div><dt>Foto</dt><dd>Aceptada</dd></div></dl></div>' +
      '<div class="k-actions">' + nativeBtn('Imprimir credencial', 'print') + '</div>';
  };

  V.creditos = function () {
    var c = S.student.credits;
    var html = '<div class="k-stats">' + stat('Créditos aprobados', c.done + ' de ' + c.total, bar(c.done, c.total, 'Créditos aprobados')) + stat('Te faltan', c.total - c.done, 'créditos para egresar') + '</div>';
    S.kardex.forEach(function (s) {
      html += '<details class="k-acc"' + (s.current ? ' open' : '') + '><summary>Semestre ' + s.sem + '<span>' + s.rows.length * 4 + ' créditos</span></summary><table class="k-table"><thead><tr><th scope="col">Materia</th><th scope="col" class="num">Créditos</th><th scope="col">Situación</th></tr></thead><tbody>' +
        s.rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td class="num">4</td><td>' + (r[1] == null ? badge('info', 'Cursando') : badge('good', 'Aprobada')) + '</td></tr>'; }).join('') + '</tbody></table></details>';
    });
    return html + '<details class="k-acc"><summary>Semestres 6 a 9<span>108 créditos</span></summary><p class="k-muted">Materias que aún no cursas, con sus optativas.</p></details>';
  };

  V['fecha-inscripcion'] = function () {
    var e = S.enrollment;
    return '<div class="k-bigdate"><span class="k-bigdate__ic">' + icon('calendar') + '</span><div><p class="k-bigdate__day">' + e.day + '</p><p class="k-bigdate__time">a las ' + e.time + ' horas</p>' + badge('info', 'Faltan ' + e.inDays + ' días') + '</div></div>' +
      '<section class="k-block"><h2>Para llegar lista a tu inscripción</h2>' + S.rows(['recibo-servicios', 'recibo-interno', 'documentos', 'inscripcion'].map(S.find), { primary: 'plain' }) + '</section>';
  };

  V.documentos = function () {
    var ok = S.documents.filter(function (d) { return d.state === 'aceptado'; }).length;
    return '<div class="k-stats">' + stat('Documentos aceptados', ok + ' de ' + S.documents.length, bar(ok, S.documents.length, 'Documentos aceptados')) + '</div>' +
      '<ul class="k-docs">' + S.documents.map(function (d) {
        return '<li><span class="k-row__ic">' + icon('file') + '</span><div><b>' + esc(d.name) + '</b><small>Subido el ' + d.date + '</small>' + (d.note ? '<p>' + esc(d.note) + '</p>' : '') + '</div>' + badge(d.state === 'aceptado' ? 'good' : 'bad', d.state === 'aceptado' ? 'Aceptado' : 'Rechazado') + '</li>';
      }).join('') + '</ul>' +
      '<section class="k-block k-form"><h2>Subir un documento</h2><label class="k-field"><span>Tipo de documento</span><select data-native="Tipo de documento"><option>Certificado de bachillerato</option><option>Acta de nacimiento</option><option>CURP</option></select></label>' +
      '<div class="k-actions">' + nativeBtn('Elegir archivo', 'upload') + nativeBtn('Enviar a revisión', 'check', true) + '</div></section>';
  };

  V.datos = function () {
    function sec(title, rows) {
      return '<section class="k-block k-datos"><div class="k-block__head"><h2>' + title + '</h2>' + nativeBtn('Modificar', 'edit') + '</div><dl class="k-dl">' +
        rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl></section>';
    }
    return '<p class="k-callout">' + icon('shield') + 'Estos datos solo se muestran en pantalla. La extensión no los guarda ni los envía.</p>' +
      sec('Datos generales', [['Nombre', S.student.name], ['Fecha de nacimiento', '14 de marzo de 2006'], ['CURP', 'XXXX000000XXXXXX00']]) +
      sec('Domicilio', [['Calle y número', 'Av. Ejemplo 123'], ['Colonia', 'Centro'], ['Municipio', 'San Nicolás de los Garza']]) +
      sec('Contacto', [['Celular', '81 0000 0000'], ['Correo personal', 'daniela@ejemplo.mx']]) +
      sec('Contacto de emergencia', [['Nombre', 'Laura Cantú (madre)'], ['Teléfono', '81 0000 0001']]) +
      sec('Servicio médico', [['IMSS', 'Afiliada'], ['Tipo de sangre', 'O+']]) +
      '<div class="k-actions">' + nativeBtn('Imprimir datos', 'print') + '</div>';
  };

  V.avisos = function () {
    return '<ul class="k-notices">' + S.notices.map(function (n) {
      return '<li><span class="k-chip">' + n.kind + '</span><div><b>' + esc(n.title) + '</b><p>' + esc(n.text) + '</p><small>Publicado el ' + n.date + '</small></div>' + nativeBtn('Abrir aviso', 'external') + '</li>';
    }).join('') + '</ul>';
  };

  V.sesion = function () {
    var rows = [['good', 'Sesión activa', 'Todo funciona. No tienes que hacer nada.'],
      ['warn', 'Opción no disponible', 'SIASE no ofrece esta página ahora. Tu sesión sigue abierta; vuelve al menú e intenta de nuevo.'],
      ['warn', 'Formulario expirado', 'Tardaste más de lo que SIASE permite. Vuelve a abrir la página desde el menú.'],
      ['bad', 'Inicia sesión otra vez', 'SIASE cerró tu sesión. Entra de nuevo con tu matrícula; la extensión nunca guarda tu contraseña.']];
    return '<ul class="k-states">' + rows.map(function (r) { return '<li>' + badge(r[0], r[1]) + '<p>' + r[2] + '</p></li>'; }).join('') + '</ul>';
  };
  V.salir = function () {
    return '<p>Vas a cerrar tu sesión de SIASE en este navegador.</p><div class="k-actions">' + nativeBtn('Cerrar sesión', 'logout', true) + '<a class="k-btn" href="#/">Seguir en SIASE</a></div>';
  };
  V.original = function () {
    return '<p>Oh My SIASE solo cambia la presentación. Con este interruptor el portal se recarga tal como lo entrega la UANL, y puedes volver a activar las mejoras cuando quieras.</p><div class="k-actions">' + nativeBtn('Ver SIASE original', 'toggle', true) + '</div>';
  };

  /* Pantalla sencilla para páginas que no se diseñaron a detalle */
  V._generic = function (p) {
    return '<section class="k-block"><h2>Qué contendría esta pantalla</h2><ul class="k-bullets">' + p.has.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></section>' +
      '<div class="k-placeholder" role="img" aria-label="Espacio del formulario original de SIASE">' + icon(p.icon) + '<span>Aquí va la página original de SIASE: ' + esc(p.label) + '</span></div>' +
      (p.target === '_top' || p.target === '_new' || p.target === '_blank' ? '<div class="k-actions">' + nativeBtn('Abrir ' + p.label, 'external', true) + '</div>' : '');
  };

  /* ================= Pantallas de docente (hipotéticas) ================= */
  V['d-grupos'] = function () {
    return '<ul class="k-groups">' + S.groups.map(function (g) {
      return '<li><div><b>' + esc(g.course) + '</b><small>Grupo ' + g.group + ', salón ' + g.room + ', ' + g.size + ' estudiantes</small></div>' +
        '<div class="k-actions"><a class="k-btn" href="#/d/lista/' + g.id + '">' + icon('users') + 'Ver lista</a><a class="k-btn k-btn--primary" href="#/p/d-captura">' + icon('edit') + 'Capturar</a></div></li>';
    }).join('') + '</ul>';
  };
  S.rosterView = function (gid) {
    var g = S.groups.filter(function (x) { return x.id === gid; })[0] || S.groups[0];
    return { title: 'Lista de clase: ' + g.course + ', grupo ' + g.group,
      html: '<p class="k-muted">' + g.size + ' estudiantes. Se muestran 8 de ejemplo.</p><div class="k-scroll"><table class="k-table"><thead><tr><th scope="col">Matrícula</th><th scope="col">Nombre</th></tr></thead><tbody>' +
        S.roster.map(function (r) { return '<tr><td>' + r[0] + '</td><th scope="row">' + esc(r[1]) + '</th></tr>'; }).join('') + '</tbody></table></div><div class="k-actions">' + nativeBtn('Imprimir lista', 'print') + '</div>' };
  };
  V['d-captura'] = function () {
    var g = S.groups[1], cap = S.teacher.capture;
    return '<div class="k-stats">' + stat('Evaluación', cap.name, 'cierra el ' + cap.due) + stat('Capturadas', g.captured + ' de ' + g.size, bar(g.captured, g.size, 'Calificaciones capturadas')) + '</div>' +
      '<div class="k-toolbar"><label class="k-field"><span>Grupo</span><select data-native="Grupo">' + S.groups.map(function (x) { return '<option' + (x === g ? ' selected' : '') + '>' + esc(x.course) + ', grupo ' + x.group + '</option>'; }).join('') + '</select></label>' +
      '<label class="k-field"><span>Evaluación</span><select data-native="Evaluación"><option>Segundo parcial</option><option>Primer parcial</option><option>Final ordinario</option></select></label></div>' +
      '<div class="k-scroll"><table class="k-table k-capture"><thead><tr><th scope="col">Matrícula</th><th scope="col">Nombre</th><th scope="col">Calificación</th><th scope="col">Estado</th></tr></thead><tbody>' +
      S.roster.map(function (r, i) {
        return '<tr><td>' + r[0] + '</td><th scope="row">' + esc(r[1]) + '</th><td><label class="sr-only" for="cal' + i + '">Calificación de ' + esc(r[1]) + '</label><input id="cal' + i + '" type="number" min="0" max="100" inputmode="numeric" value="' + (r[2] == null ? '' : r[2]) + '"></td><td>' + (r[2] == null ? badge('warn', 'Falta') : badge('good', 'Capturada')) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="k-actions">' + nativeBtn('Guardar avance', 'check') + nativeBtn('Enviar minuta', 'upload', true) + '</div>';
  };
  V['d-horario'] = function () {
    return weekGrid(S.groups, {}) + dayList(S.groups, {});
  };
  V['d-tutorias'] = function () {
    return '<div class="k-stats">' + stat('Tutorados', '12', 'en ' + S.teacher.period) + stat('Sesiones registradas', '19 de 24', bar(19, 24, 'Sesiones registradas')) + '</div>' + V._generic(S.teacherById['d-tutorias']);
  };

  S.views = V;

  /* Arma una pantalla completa. opts.heading: 'plain' usa la frase llana como título */
  S.renderPage = function (id, opts) {
    opts = opts || {};
    var p = S.find(id);
    if (!p) return null;
    var body = (V[id] || V._generic)(p);
    var title = opts.heading === 'plain' ? p.plain : p.label;
    var lead = opts.heading === 'plain' ? p.label : p.plain;
    return {
      page: p, title: p.label,
      html: '<header class="k-head">' + (opts.before || '') + '<h1 tabindex="-1">' + esc(title) + '</h1><p class="k-lead">' + esc(lead) + ' ' + targetBadge(p) + '</p></header>' + body + S.nativeNote(p)
    };
  };

  /* ---------- Aviso breve (toast) ---------- */
  var toastEl, toastTimer;
  S.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'k-toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4200);
  };

  /* ---------- Enrutador por hash ----------
   * cfg.name: nombre de la propuesta
   * cfg.resolve(path, query): devuelve { title, html } o null
   * cfg.shell(): pinta la navegación fija (se repinta al cambiar de rol)
   * cfg.after(path): marca el elemento activo, etc.
   */
  S.start = function (cfg) {
    var view = document.getElementById('view');
    var first = true;
    function render() {
      var raw = location.hash.replace(/^#/, '') || '/';
      var cut = raw.indexOf('?');
      var path = cut < 0 ? raw : raw.slice(0, cut), query = cut < 0 ? '' : decodeURIComponent(raw.slice(cut + 1));
      var res = cfg.resolve(path, query) || {
        title: 'Página no encontrada',
        html: '<header class="k-head"><h1 tabindex="-1">Esta pantalla no existe en el prototipo</h1><p class="k-lead">Vuelve al inicio para seguir explorando.</p></header><div class="k-actions"><a class="k-btn k-btn--primary" href="#/">Ir al inicio</a></div>'
      };
      view.innerHTML = res.html;
      document.title = res.title + ' | ' + cfg.name;
      if (cfg.after) cfg.after(path, query);
      if (!first && !cfg.keepFocus) {
        var h = view.querySelector('h1');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
        window.scrollTo(0, 0);
      }
      first = false;
    }
    function repaint() { if (cfg.shell) cfg.shell(); render(); }
    document.addEventListener('click', function (ev) {
      var t = ev.target.closest ? ev.target.closest('[data-role],[data-textsize],[data-native]') : null;
      if (!t) return;
      if (t.hasAttribute('data-role')) {
        S.setRole(t.getAttribute('data-role'));
        if (location.hash && location.hash !== '#/') { first = true; location.hash = '#/'; if (cfg.shell) cfg.shell(); }
        else repaint();
        var on = document.querySelector('[data-role][aria-pressed="true"]');
        if (on) on.focus();
        S.toast(S.isTeacher() ? 'Ahora ves el prototipo como docente.' : 'Ahora ves el prototipo como estudiante.');
      } else if (t.hasAttribute('data-textsize')) {
        var big = document.documentElement.classList.toggle('is-big');
        t.setAttribute('aria-pressed', String(big));
      } else if (t.tagName !== 'SELECT') {
        S.toast('Prototipo: aquí la extensión activaría "' + t.getAttribute('data-native') + '" en la página original de SIASE.');
      }
    });
    window.addEventListener('hashchange', render);
    repaint();
    return { render: render, repaint: repaint };
  };
})();
