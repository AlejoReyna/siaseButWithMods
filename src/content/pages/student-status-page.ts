import {
  parseStudentStatusDetails,
  type StudentStatusDetails
} from '@/utils/parser/student-status';

const downloadLabel = 'Descargar credencial';
const downloadHint = 'PNG · Disponible sin conexión';
const waitingForQr = 'La descarga estará disponible cuando SIASE cargue el código QR.';

function renderSchoolDetails(shell: HTMLElement, details: StudentStatusDetails): void {
  const list = shell.querySelector('dl')!;
  const fields = [
    ['Semestre', details.semester],
    ['Situación del estudiante', details.status],
    ['Tipo de inscripción', details.enrollmentType],
    ['Foto aceptada', details.photoAccepted]
  ] as const;
  for (const [label, value] of fields) {
    const row = shell.ownerDocument.createElement('div');
    const term = shell.ownerDocument.createElement('dt');
    const description = shell.ownerDocument.createElement('dd');
    const photoAccepted = label === 'Foto aceptada' && /^s[ií]$/i.test(value ?? '');
    term.textContent = label;
    description.textContent = photoAccepted ? 'Sí' : (value ?? 'Sin información');
    if (label === 'Situación del estudiante' && value)
      description.classList.add('siase-v2-status-badge');
    if (photoAccepted)
      description.classList.add('siase-v2-status-badge', 'siase-v2-status-badge--positive');
    row.append(term, description);
    list.append(row);
  }

  const note = shell.querySelector<HTMLElement>('.siase-v2-status-note')!;
  if (details.note) {
    note.textContent = details.note;
    note.hidden = false;
  }
}

function isDisplayed(element: Element): boolean {
  if (element.checkVisibility) return element.checkVisibility({ visibilityProperty: true });
  const style = element.ownerDocument.defaultView!.getComputedStyle(element);
  return (
    style.display !== 'none' && style.visibility !== 'hidden' && !element.hasAttribute('hidden')
  );
}

function hasQrCode(credential: HTMLElement): boolean {
  return Array.from(credential.querySelectorAll('#qrcode :is(img, canvas, table, svg)')).some(
    (node) => {
      if (!isDisplayed(node)) return false;
      if (node instanceof HTMLImageElement) return node.complete && node.naturalWidth > 0;
      if (node instanceof HTMLCanvasElement) return node.width > 0 && node.height > 0;
      return node.childElementCount > 0;
    }
  );
}

async function downloadCredential(credential: HTMLElement): Promise<void> {
  const images = Array.from(credential.querySelectorAll('img')).filter(isDisplayed);
  await Promise.all(images.map((image) => image.decode()));
  if (!hasQrCode(credential)) throw new Error('Credential QR is unavailable');

  const { toBlob } = await import('html-to-image');
  const blob = await toBlob(credential, {
    pixelRatio: 3,
    skipFonts: true,
    includeQueryParams: true,
    fetchRequestInit: { mode: 'same-origin' },
    style: { margin: '0' }
  });
  if (!blob?.size) throw new Error('Credential image is empty');

  const url = URL.createObjectURL(blob);
  const link = credential.ownerDocument.createElement('a');
  link.href = url;
  link.download = 'credencial-uanl.png';
  try {
    link.click();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

function attachDownload(shell: HTMLElement, credential: HTMLElement): void {
  const button = shell.querySelector<HTMLButtonElement>('[data-download]')!;
  const label = button.querySelector('span')!;
  const feedback = shell.querySelector<HTMLElement>('[role="status"]')!;
  let downloading = false;
  let message = downloadHint;

  const update = () => {
    const ready = hasQrCode(credential);
    button.disabled = downloading || !ready;
    label.textContent = downloading ? 'Preparando imagen…' : downloadLabel;
    const next = ready ? message : waitingForQr;
    if (feedback.textContent !== next) feedback.textContent = next;
  };

  button.addEventListener('click', async () => {
    downloading = true;
    message = '';
    update();
    try {
      await downloadCredential(credential);
      message = 'Descarga iniciada. Puedes abrir la imagen sin conexión.';
    } catch {
      message = 'No se pudo guardar la imagen. Intenta descargarla de nuevo.';
    } finally {
      downloading = false;
      update();
    }
  });

  new MutationObserver(update).observe(credential, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'style', 'class', 'hidden', 'width', 'height']
  });
  credential.addEventListener('load', update, true);
  credential.addEventListener('error', update, true);
  update();
}

function mountCredential(
  shell: HTMLElement,
  credential: HTMLElement,
  nativePrint: HTMLInputElement | null
): () => void {
  const frameDocument = shell.ownerDocument;
  const frameWindow = frameDocument.defaultView!;
  const preview = shell.querySelector<HTMLElement>('.siase-v2-status-preview')!;
  const width = credential.offsetWidth;
  const inherited = frameWindow.getComputedStyle(credential.parentElement!);
  const holder = frameDocument.createElement('div');
  holder.className = 'siase-v2-status-credential';
  Object.assign(holder.style, {
    fontFamily: inherited.fontFamily,
    fontSize: inherited.fontSize,
    lineHeight: inherited.lineHeight,
    color: inherited.color,
    textAlign: inherited.textAlign,
    width: width ? `${width}px` : ''
  });
  const origin = frameDocument.createComment('SIASE credential');
  credential.before(origin);

  const showPreview = () => holder.append(credential);
  const restore = () => origin.after(credential);
  preview.append(holder);
  showPreview();

  if (width && typeof ResizeObserver !== 'undefined') {
    const fit = (available: number) => {
      if (available > 0) holder.style.zoom = String(Math.min(1.15, available / width));
    };
    fit(preview.clientWidth);
    new ResizeObserver(([entry]) => fit(entry.contentRect.width)).observe(preview);
  }

  frameWindow.addEventListener('beforeprint', restore);
  frameWindow.addEventListener('afterprint', showPreview);
  attachDownload(shell, credential);
  return () => {
    restore();
    try {
      nativePrint?.click();
    } finally {
      showPreview();
    }
  };
}

export function enhanceStudentStatusPage(frameDocument: Document): void {
  const legacy = frameDocument.querySelector('body > center');
  if (
    !legacy ||
    !frameDocument.defaultView ||
    frameDocument.getElementById('siase-v2-student-status')
  )
    return;

  const details = parseStudentStatusDetails(frameDocument);
  const credential = legacy.querySelector<HTMLElement>('#idCredencial');
  const nativePrint = legacy.querySelector<HTMLInputElement>(
    'input[name="Imprimir"][type="button"]'
  );
  if (!credential && !Object.keys(details).length) return;

  const shell = frameDocument.createElement('main');
  shell.id = 'siase-v2-student-status';
  shell.innerHTML = `
    <div class="siase-v2-status-layout">
      <header class="siase-v2-status-header">
        <h1>Situación estudiantil</h1>
        <p>Departamento Escolar y de Archivo · UANL</p>
      </header>
      <div class="siase-v2-status-grid">
        <section class="siase-v2-status-panel" aria-labelledby="siase-v2-credential-title">
          <h2 id="siase-v2-credential-title">Credencial virtual temporal</h2>
          <div class="siase-v2-status-stage">
            <div class="siase-v2-status-preview"></div>
          </div>
          <div class="siase-v2-status-actions">
            <button type="button" class="siase-v2-status-download" data-download disabled>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>
              <span>${downloadLabel}</span>
            </button>
            <button type="button" class="siase-v2-status-print" data-print>Imprimir</button>
          </div>
          <p class="siase-v2-status-feedback" role="status">${downloadHint}</p>
        </section>
        <section class="siase-v2-status-panel" aria-labelledby="siase-v2-school-title">
          <h2 id="siase-v2-school-title">Datos escolares</h2>
          <dl class="siase-v2-status-details"></dl>
          <p class="siase-v2-status-note" hidden></p>
        </section>
      </div>
    </div>
  `;
  renderSchoolDetails(shell, details);
  frameDocument.body.append(shell);

  const print = credential
    ? mountCredential(shell, credential, nativePrint)
    : () => nativePrint?.click();
  if (!credential) {
    shell.querySelector('.siase-v2-status-preview')!.textContent =
      'SIASE aún no muestra una credencial para este periodo.';
    shell.querySelector('[data-download]')?.remove();
    shell.querySelector('[role="status"]')?.remove();
  }
  const printButton = shell.querySelector('[data-print]')!;
  if (nativePrint) printButton.addEventListener('click', print);
  else printButton.remove();

  legacy.classList.add('siase-v2-status-original');
  frameDocument.body.classList.add('siase-plus-student-status-page');
}
