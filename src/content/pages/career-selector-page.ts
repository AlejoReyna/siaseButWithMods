import {
  extractLegacyAnnouncements,
  renderNotificationBell
} from '../legacy-announcements';

const CAREER_PANEL_IDS = ['siase', 'correo', 'nexus', 'codice'] as const;

type GatewayServiceId = (typeof CAREER_PANEL_IDS)[number];

const UANL_GATEWAY_SERVICES: ReadonlyArray<{
  id: GatewayServiceId;
  label: string;
  mark: string;
  description: string;
}> = [
  {
    id: 'siase',
    label: 'SIASE',
    mark: 'S',
    description: 'Consulta tu información académica y elige la carrera con la que ingresarás.'
  },
  {
    id: 'correo',
    label: 'Correo U',
    mark: 'U',
    description: 'Accede a tu correo electrónico universitario de Microsoft 365.'
  },
  {
    id: 'nexus',
    label: 'Nexus',
    mark: 'N',
    description: 'Entra a la plataforma de clases y actividades en línea.'
  },
  {
    id: 'codice',
    label: 'Códice',
    mark: 'C',
    description: 'Consulta el sistema de bibliotecas digitales de la UANL.'
  }
];

function controlLabel(control: HTMLElement, index: number): string {
  return control.textContent?.replace(/\s+/g, ' ').trim() || `Carrera ${index + 1}`;
}

function careerAction(anchor: HTMLAnchorElement): string {
  return anchor.dataset.siaseCareerAction ?? anchor.getAttribute('href') ?? '';
}

function originalCareerLinks(form: HTMLFormElement): HTMLAnchorElement[] {
  return Array.from(
    form.querySelectorAll<HTMLAnchorElement>('a[data-siase-career-action], a[href]')
  ).filter((anchor) =>
    careerAction(anchor).trim().toLocaleLowerCase('es-MX').startsWith('javascript:')
  );
}

function prepareCareerLinks(careerLinks: HTMLAnchorElement[]): void {
  careerLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href?.trim().toLocaleLowerCase('es-MX').startsWith('javascript:')) {
      link.dataset.siaseCareerAction = href;
      link.removeAttribute('href');
    }
    link.classList.add('siase-v2-career-native-option');
  });
}

function showNativePanel(frameDocument: Document, panelId: GatewayServiceId): void {
  const portalWindow = frameDocument.defaultView as (Window & { muestra?: (panel: string) => void }) | null;
  if (typeof portalWindow?.muestra === 'function') {
    portalWindow.muestra(panelId);
    return;
  }

  CAREER_PANEL_IDS.forEach((id) => {
    const panel = frameDocument.getElementById(id);
    if (panel) panel.style.visibility = id === panelId ? 'visible' : 'hidden';
  });
}

function openExternalLink(frameDocument: Document, link: HTMLAnchorElement): boolean {
  const frameWindow = frameDocument.defaultView ?? window;
  const href = link.href || link.getAttribute('href');
  if (!href) return false;

  const target = link.target || '_blank';
  const opened = frameWindow.open(href, target, 'noopener,noreferrer');
  if (opened) return true;

  frameWindow.location.assign(href);
  return true;
}

function launchGatewayService(frameDocument: Document, serviceId: Exclude<GatewayServiceId, 'siase'>): boolean {
  showNativePanel(frameDocument, serviceId);

  if (serviceId === 'correo') {
    const correoLink =
      frameDocument.querySelector<HTMLAnchorElement>('#correo a[href^="https://login.microsoftonline.com"]') ??
      Array.from(frameDocument.querySelectorAll<HTMLAnchorElement>('#correo a[href^="http"]')).find(
        (link) => !link.classList.contains('style3')
      ) ??
      null;
    return correoLink ? openExternalLink(frameDocument, correoLink) : false;
  }

  const buttonSelector =
    serviceId === 'nexus'
      ? '#idfrNexus input[name="btnNexus"], #linkNexus'
      : '#idfrCodice input[name="btnCodice"], #linkCodice';
  const button = frameDocument.querySelector<HTMLInputElement | HTMLButtonElement>(buttonSelector);
  if (!button) return false;

  button.click();
  return true;
}

function panelSummary(frameDocument: Document, serviceId: GatewayServiceId): string {
  const panel = frameDocument.getElementById(serviceId);
  const text = panel?.querySelector('.margen')?.textContent?.replace(/\s+/g, ' ').trim();
  if (text) return text;
  return UANL_GATEWAY_SERVICES.find((entry) => entry.id === serviceId)?.description ?? '';
}

function studentEmail(frameDocument: Document): string | null {
  const email = frameDocument.querySelector('#correo a.style3')?.textContent?.trim();
  return email || null;
}

function activateCareerLink(
  source: HTMLAnchorElement,
  form: HTMLFormElement,
  shell: HTMLElement,
  trigger?: HTMLButtonElement
): void {
  const href = careerAction(source);
  const assignments = [...href.matchAll(/\.([A-Za-z0-9_]+)\.value\s*=\s*(['"])(.*?)\2/gs)];

  assignments.forEach(([, fieldName, , value]) => {
    const field = form.elements.namedItem(fieldName) as HTMLInputElement | HTMLSelectElement | null;
    if (field) field.value = value;
  });

  if (!assignments.length) return;

  shell.classList.add('is-transitioning');
  trigger?.classList.add('is-selected');
  shell.querySelectorAll<HTMLButtonElement>('.siase-v2-career-choice').forEach((button) => {
    button.disabled = true;
  });

  window.setTimeout(() => form.submit(), 280);
}

function markNativePanels(frameDocument: Document): void {
  CAREER_PANEL_IDS.forEach((id) => {
    const panel = frameDocument.getElementById(id);
    if (!panel) return;
    panel.classList.add('siase-v2-career-service-panel', `siase-v2-career-service-panel--${id}`);
    if (!panel.getAttribute('aria-label')) {
      panel.setAttribute('aria-label', id === 'siase' ? 'SIASE' : id.toLocaleUpperCase('es-MX'));
    }
  });

  frameDocument.getElementById('idfrNexus')?.classList.add('siase-v2-career-native-control');
  frameDocument.getElementById('linkNexus')?.classList.add('siase-v2-career-native-control');
  frameDocument.getElementById('idfrCodice')?.classList.add('siase-v2-career-native-control');
  frameDocument.getElementById('linkCodice')?.classList.add('siase-v2-career-native-control');
}

function replaceLegacyPortalLayout(frameDocument: Document): void {
  try {
    const rootDocument = frameDocument.defaultView?.top?.document;
    if (!rootDocument) return;

    rootDocument.documentElement.classList.add('siase-v2-career-selector-root');
    rootDocument.querySelectorAll<HTMLFrameSetElement>('frameset').forEach((frameset) => {
      if (frameset.hasAttribute('rows')) frameset.setAttribute('rows', '0,*');
      if (frameset.hasAttribute('cols')) frameset.setAttribute('cols', '0,*');
      frameset.setAttribute('border', '0');
      frameset.setAttribute('frameborder', '0');
      frameset.setAttribute('framespacing', '0');
    });
  } catch {
    // Cross-document access can be unavailable in unusual embedded contexts.
  }
}

function setHeaderServiceActive(shell: HTMLElement, serviceId: GatewayServiceId): void {
  shell.querySelectorAll<HTMLButtonElement>('[data-siase-service-nav]').forEach((control) => {
    control.classList.toggle('is-active', control.dataset.siaseServiceNav === serviceId);
  });
}

function showServiceHub(shell: HTMLElement): void {
  shell.dataset.siaseView = 'hub';
  delete shell.dataset.siaseSelectedService;
  shell
    .querySelector<HTMLElement>('.siase-v2-module-tile-wrapper--siase')
    ?.classList.remove('is-expanded');
  shell.querySelector<HTMLElement>('[data-siase-v2-module-hub]')?.removeAttribute('hidden');
  shell.querySelector<HTMLElement>('[data-siase-v2-gateway-panel]')?.setAttribute('hidden', '');
}

function expandSiaseCareers(shell: HTMLElement): void {
  shell.dataset.siaseView = 'siase-expanded';
  shell.dataset.siaseSelectedService = 'siase';
  setHeaderServiceActive(shell, 'siase');
  shell.querySelector<HTMLElement>('[data-siase-v2-gateway-panel]')?.setAttribute('hidden', '');
  shell
    .querySelector<HTMLElement>('.siase-v2-module-tile-wrapper--siase')
    ?.classList.add('is-expanded');
  shell
    .querySelector<HTMLButtonElement>('.siase-v2-module-tile__expand .siase-v2-career-choice')
    ?.focus();
}

function showGatewayServicePanel(
  shell: HTMLElement,
  frameDocument: Document,
  serviceId: Exclude<GatewayServiceId, 'siase'>
): void {
  const service = UANL_GATEWAY_SERVICES.find((entry) => entry.id === serviceId);
  if (!service) return;

  shell.dataset.siaseView = 'service';
  shell.dataset.siaseSelectedService = serviceId;
  setHeaderServiceActive(shell, serviceId);

  const panel = shell.querySelector<HTMLElement>('[data-siase-v2-gateway-panel]');
  const title = panel?.querySelector<HTMLElement>('[data-siase-gateway-title]');
  const body = panel?.querySelector<HTMLElement>('[data-siase-gateway-body]');
  const email = panel?.querySelector<HTMLElement>('[data-siase-gateway-email]');
  const action = panel?.querySelector<HTMLButtonElement>('[data-siase-gateway-action]');

  if (title) title.textContent = service.label;
  if (body) body.textContent = panelSummary(frameDocument, serviceId);

  const studentMailbox = studentEmail(frameDocument);
  if (email) {
    if (serviceId === 'correo' && studentMailbox) {
      email.hidden = false;
      email.textContent = studentMailbox;
    } else {
      email.hidden = true;
      email.textContent = '';
    }
  }

  if (action) {
    action.textContent =
      serviceId === 'correo' ? 'Ingresar a Outlook' : `Ingresar a ${service.label}`;
    action.onclick = () => {
      launchGatewayService(frameDocument, serviceId);
    };
  }

  shell.querySelector<HTMLElement>('[data-siase-v2-module-hub]')?.setAttribute('hidden', '');
  panel?.removeAttribute('hidden');
  action?.focus();
}

function openGatewayService(
  shell: HTMLElement,
  frameDocument: Document,
  serviceId: GatewayServiceId
): void {
  if (serviceId === 'siase') {
    if (shell.dataset.siaseView === 'hub') {
      expandSiaseCareers(shell);
      return;
    }
    showServiceHub(shell);
    window.setTimeout(() => expandSiaseCareers(shell), 20);
    return;
  }
  showGatewayServicePanel(shell, frameDocument, serviceId);
}

function buildCareerChoices(
  frameDocument: Document,
  form: HTMLFormElement,
  shell: HTMLElement,
  careerLinks: HTMLAnchorElement[]
): HTMLElement {
  const choices = frameDocument.createElement('div');
  choices.className = 'siase-v2-career-choices';
  if (!careerLinks.length) {
    const empty = frameDocument.createElement('p');
    empty.className = 'siase-v2-career-choices__empty';
    empty.textContent =
      'No encontramos carreras en el listado de SIASE. Vuelve e intenta de nuevo o usa la versión original.';
    choices.append(empty);
  }
  careerLinks.forEach((source, index) => {
    const button = frameDocument.createElement('button');
    button.type = 'button';
    button.className = 'siase-v2-career-choice';
    button.dataset.siaseCareerIndex = String(index);

    const icon = frameDocument.createElement('span');
    icon.className = 'siase-v2-career-choice__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-5 9 5-9 5-9-5Z"/><path d="M6 12.5v4.2c2.9 2.2 9.1 2.2 12 0v-4.2"/><path d="M21 10v6"/></svg>';
    const label = frameDocument.createElement('strong');
    label.textContent = controlLabel(source, index);
    const detail = frameDocument.createElement('span');
    detail.className = 'siase-v2-career-choice__detail';
    detail.textContent = 'Accede a tu información académica y servicios.';
    const badge = frameDocument.createElement('span');
    badge.className = 'siase-v2-career-choice__badge';
    badge.textContent = 'Carrera disponible';
    const copy = frameDocument.createElement('span');
    copy.className = 'siase-v2-career-choice__copy';
    copy.append(label, detail);
    const action = frameDocument.createElement('span');
    action.className = 'siase-v2-career-choice__action';
    action.textContent = 'Abrir →';
    button.append(icon, copy, badge, action);

    button.addEventListener('click', () => {
      if (source.isConnected) activateCareerLink(source, form, shell, button);
    });
    choices.append(button);
  });
  return choices;
}

function buildSiaseTile(
  frameDocument: Document,
  form: HTMLFormElement,
  shell: HTMLElement,
  service: (typeof UANL_GATEWAY_SERVICES)[number],
  careerLinks: HTMLAnchorElement[]
): HTMLElement {
  const wrapper = frameDocument.createElement('div');
  wrapper.className = 'siase-v2-module-tile-wrapper siase-v2-module-tile-wrapper--siase';
  wrapper.dataset.siaseModuleTile = 'siase';

  const surface = frameDocument.createElement('button');
  surface.type = 'button';
  surface.className = 'siase-v2-module-tile siase-v2-module-tile--siase siase-v2-module-tile__surface';
  surface.innerHTML = `
      <span class="siase-v2-module-tile__mark" aria-hidden="true">${service.mark}</span>
      <span class="siase-v2-module-tile__copy">
        <strong>${service.label}</strong>
        <span>${service.description}</span>
      </span>
    `;
  surface.addEventListener('click', () => expandSiaseCareers(shell));

  const expand = frameDocument.createElement('div');
  expand.className = 'siase-v2-module-tile__expand';
  expand.dataset.siaseV2CareerPicker = 'true';
  expand.setAttribute('aria-labelledby', 'siase-v2-career-title');

  const backButton = frameDocument.createElement('button');
  backButton.type = 'button';
  backButton.className = 'siase-v2-career-picker__back';
  backButton.textContent = '← Volver a servicios';
  backButton.addEventListener('click', () => showServiceHub(shell));

  const header = frameDocument.createElement('header');
  header.className = 'siase-v2-module-tile__expand-header';
  const eyebrow = frameDocument.createElement('p');
  eyebrow.className = 'siase-v2-service-eyebrow';
  eyebrow.textContent = 'SIASE · UANL';
  const title = frameDocument.createElement('h1');
  title.id = 'siase-v2-career-title';
  title.textContent = 'Selecciona tu carrera';
  const description = frameDocument.createElement('p');
  description.textContent = 'Elige el programa académico con el que deseas continuar.';
  header.append(eyebrow, title, description);

  expand.append(backButton, header, buildCareerChoices(frameDocument, form, shell, careerLinks));
  wrapper.append(surface, expand);
  return wrapper;
}

export function enhanceCareerSelectorPage(frameDocument: Document): boolean {
  if (frameDocument.querySelector('.siase-v2-career-shell')) {
    return true;
  }

  const form = frameDocument.querySelector<HTMLFormElement>('form[name="SelCarrera"]');
  if (!form) return false;

  frameDocument.body.classList.add('siase-v2-career-selector-page');
  const legacyAnnouncements = extractLegacyAnnouncements(frameDocument);
  replaceLegacyPortalLayout(frameDocument);
  markNativePanels(frameDocument);

  form.classList.add('siase-v2-career-native-form');
  const careerLinks = originalCareerLinks(form);
  prepareCareerLinks(careerLinks);

  const gatewayPanel = frameDocument.createElement('section');
  gatewayPanel.className = 'siase-v2-gateway-service';
  gatewayPanel.dataset.siaseV2GatewayPanel = 'true';
  gatewayPanel.hidden = true;
  gatewayPanel.innerHTML = `
    <div class="siase-v2-career-picker__toolbar">
      <button type="button" class="siase-v2-career-picker__back" data-siase-gateway-back>← Volver a servicios</button>
    </div>
    <header class="siase-v2-gateway-service__header">
      <p class="siase-v2-service-eyebrow">Servicio UANL</p>
      <h1 data-siase-gateway-title></h1>
      <p class="siase-v2-gateway-service__email" data-siase-gateway-email hidden></p>
      <p data-siase-gateway-body></p>
    </header>
    <button type="button" class="siase-v2-gateway-service__action" data-siase-gateway-action></button>
  `;

  const moduleHub = frameDocument.createElement('section');
  moduleHub.className = 'siase-v2-module-hub';
  moduleHub.dataset.siaseV2ModuleHub = 'true';
  moduleHub.setAttribute('aria-label', 'Servicios UANL');

  const hubChrome = frameDocument.createElement('div');
  hubChrome.className = 'siase-v2-module-hub__chrome';

  const moduleGrid = frameDocument.createElement('div');
  moduleGrid.className = 'siase-v2-module-grid';

  const shell = frameDocument.createElement('div');
  shell.className = 'siase-v2-career-shell';
  shell.dataset.siaseView = 'hub';
  shell.innerHTML = `
    <header class="siase-v2-career-shell__header">
      <div class="siase-v2-career-shell__brand"><span>U</span><strong>UANL<em>SIASE</em></strong></div>
      <nav class="siase-v2-career-shell__modules" aria-label="Servicios UANL"></nav>
    </header>
    <main class="siase-v2-career-shell__main siase-v2-career-shell__main--hub"></main>
  `;

  const serviceNav = shell.querySelector<HTMLElement>('.siase-v2-career-shell__modules');
  UANL_GATEWAY_SERVICES.forEach((service, index) => {
    const navButton = frameDocument.createElement('button');
    navButton.type = 'button';
    navButton.className = index === 0 ? 'is-active' : '';
    navButton.dataset.siaseServiceNav = service.id;
    navButton.textContent = service.label;
    navButton.addEventListener('click', () => openGatewayService(shell, frameDocument, service.id));
    serviceNav?.append(navButton);

    if (service.id === 'siase') {
      moduleGrid.append(buildSiaseTile(frameDocument, form, shell, service, careerLinks));
      return;
    }

    const tile = frameDocument.createElement('button');
    tile.type = 'button';
    tile.className = `siase-v2-module-tile siase-v2-module-tile--${service.id}`;
    tile.dataset.siaseModuleTile = service.id;
    tile.innerHTML = `
      <span class="siase-v2-module-tile__mark" aria-hidden="true">${service.mark}</span>
      <span class="siase-v2-module-tile__copy">
        <strong>${service.label}</strong>
        <span>${service.description}</span>
      </span>
    `;
    tile.addEventListener('click', () => openGatewayService(shell, frameDocument, service.id));
    moduleGrid.append(tile);
  });

  moduleHub.append(hubChrome, moduleGrid);

  const shellMain = shell.querySelector('.siase-v2-career-shell__main');
  shellMain?.append(moduleHub, gatewayPanel);

  gatewayPanel
    .querySelector<HTMLButtonElement>('[data-siase-gateway-back]')
    ?.addEventListener('click', () => showServiceHub(shell));

  const shellHeader = shell.querySelector('.siase-v2-career-shell__header');
  hubChrome.append(renderNotificationBell(frameDocument, legacyAnnouncements));
  shellHeader?.append(renderNotificationBell(frameDocument, legacyAnnouncements));

  frameDocument.body.append(shell);
  frameDocument.body.classList.add('siase-v2-career-selector-ready');
  return true;
}