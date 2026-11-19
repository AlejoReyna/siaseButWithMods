export interface VisibleCreditTotals {
  approved: number;
  total: number;
}

type CreditSection = {
  heading: HTMLHeadingElement;
  panel: HTMLElement;
};

function parseNumber(value: string): number {
  return Number(value.replace(',', '.'));
}

export function parseVisibleCreditTotals(text: string): VisibleCreditTotals | null {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const patterns = [
    /cr[eé]ditos?\s+(?:aprobados?|acreditados?)\D{0,20}(\d+(?:[.,]\d+)?)\s*(?:de|\/)\s*(\d+(?:[.,]\d+)?)/i,
    /(?:aprobados?|acreditados?)\D{0,16}(\d+(?:[.,]\d+)?)\s*(?:de|\/)\s*(\d+(?:[.,]\d+)?)/i,
    /cr[eé]ditos?\D{0,20}(\d+(?:[.,]\d+)?)\s*(?:de|\/)\s*(\d+(?:[.,]\d+)?)/i
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (!match) continue;
    const approved = parseNumber(match[1]);
    const total = parseNumber(match[2]);
    if (Number.isFinite(approved) && Number.isFinite(total) && approved >= 0 && total > 0) {
      return { approved, total };
    }
  }
  return null;
}

const CREDIT_TOTAL_LINE =
  /cr[eé]ditos?\s+(?:aprobados?|acreditados?)\D{0,20}\d+(?:[.,]\d+)?\s*(?:de|\/)\s*\d+(?:[.,]\d+)?/i;

export function parseCareerTitleFromCreditHeader(text: string): string | null {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;

  const withoutTotals = normalized.replace(CREDIT_TOTAL_LINE, ' ').replace(/\s+/g, ' ').trim();
  if (withoutTotals.length > 3) return withoutTotals;

  const lines = text
    .split(/[\n\r]+|<br\s*\/?>/gi)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  for (const line of lines) {
    if (parseVisibleCreditTotals(line)) continue;
    if (line.length > 3) return line;
  }
  return null;
}

function normalizedHeader(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('es-MX');
}

function isCreditsTable(table: HTMLTableElement): boolean {
  const firstRow = table.rows.item(0);
  if (!firstRow) return false;
  const headers = Array.from(firstRow.cells).map((cell) =>
    normalizedHeader(cell.textContent ?? '')
  );
  return ['semestre', 'materia', 'creditos', 'situacion'].every((header) =>
    headers.some((candidate) => candidate === header)
  );
}

function findVisibleTotals(frameDocument: Document): VisibleCreditTotals | null {
  const sources = [
    frameDocument.getElementById('ResCred'),
    frameDocument.getElementById('Contenedor')
  ];
  for (const source of sources) {
    const totals = parseVisibleCreditTotals(source?.textContent ?? '');
    if (totals) return totals;
  }
  return null;
}

function findCareerTitle(frameDocument: Document): string | null {
  const resCred = frameDocument.getElementById('ResCred');
  const fromResCred = parseCareerTitleFromCreditHeader(resCred?.textContent ?? '');
  if (fromResCred) return fromResCred;

  const heading = frameDocument.querySelector('h1, h2');
  const headingText = heading?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  if (headingText && !parseVisibleCreditTotals(headingText)) return headingText;

  return null;
}

function creditSections(accordion: HTMLElement): CreditSection[] {
  const sections: CreditSection[] = [];
  const children = Array.from(accordion.children);
  for (let index = 0; index < children.length - 1; index += 2) {
    const heading = children[index];
    const panel = children[index + 1];
    if (heading?.tagName !== 'H3' || panel?.tagName !== 'DIV') continue;
    sections.push({ heading: heading as HTMLHeadingElement, panel: panel as HTMLElement });
  }
  return sections;
}

function initialActiveIndex(sections: CreditSection[]): number {
  const activeIndex = sections.findIndex((section) =>
    section.heading.classList.contains('ui-state-active')
  );
  return activeIndex >= 0 ? activeIndex : 0;
}

function applyMasterDetailLayout(accordion: HTMLElement, activeIndex: number): void {
  const sections = creditSections(accordion);
  let listRow = 1;

  sections.forEach((section, index) => {
    const isDetail = index === activeIndex;
    section.heading.classList.toggle('siase-v2-credit-detail-heading', isDetail);
    section.heading.classList.toggle('siase-v2-credit-list-heading', !isDetail);
    section.panel.classList.toggle('siase-v2-credit-detail-panel', isDetail);
    section.panel.classList.toggle('siase-v2-credit-list-panel', !isDetail);

    section.heading.classList.toggle('ui-state-active', isDetail);
    section.heading.setAttribute('aria-expanded', String(isDetail));

    if (isDetail) {
      section.heading.style.gridColumn = '1';
      section.heading.style.gridRow = '1';
      section.panel.style.gridColumn = '1';
      section.panel.style.gridRow = '2';
      section.panel.style.display = '';
    } else {
      section.heading.style.gridColumn = '2';
      section.heading.style.gridRow = String(listRow);
      listRow += 1;
      section.panel.style.gridColumn = '2';
      section.panel.style.gridRow = String(listRow);
      listRow += 1;
      section.panel.style.display = 'none';
    }
  });
}

function wireMasterDetailAccordion(accordion: HTMLElement): void {
  if (accordion.dataset.siaseV2CreditLayout === 'master-detail') return;
  accordion.dataset.siaseV2CreditLayout = 'master-detail';

  let activeIndex = initialActiveIndex(creditSections(accordion));
  applyMasterDetailLayout(accordion, activeIndex);

  accordion.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const heading = target.closest<HTMLHeadingElement>('#accordion > h3');
      if (!heading || !accordion.contains(heading)) return;
      if (heading.classList.contains('siase-v2-credit-detail-heading')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      const sections = creditSections(accordion);
      const nextIndex = sections.findIndex((section) => section.heading === heading);
      if (nextIndex < 0 || nextIndex === activeIndex) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      activeIndex = nextIndex;
      applyMasterDetailLayout(accordion, activeIndex);
    },
    true
  );
}

function addContainerHeader(
  frameDocument: Document,
  container: HTMLElement,
  resCred: HTMLElement | null
): void {
  if (container.querySelector('[data-siase-v2-credit-page-header]')) return;

  const totals = findVisibleTotals(frameDocument);
  const careerTitle = findCareerTitle(frameDocument);

  const header = frameDocument.createElement('header');
  header.className = 'siase-v2-credit-page-header';
  header.dataset.siaseV2CreditPageHeader = 'true';

  const title = frameDocument.createElement('h1');
  title.className = 'siase-v2-credit-page-title';
  title.textContent = careerTitle ?? 'Consulta de créditos';
  header.append(title);

  if (totals) {
    const subtitle = frameDocument.createElement('p');
    subtitle.className = 'siase-v2-credit-page-subtitle';
    subtitle.textContent = `Créditos aprobados ${totals.approved} de ${totals.total}`;
    header.append(subtitle);
  }

  container.prepend(header);
  resCred?.classList.add('siase-v2-credit-result--hidden');
}

export function enhanceAcademicCreditsPage(frameDocument: Document): boolean {
  frameDocument.body.classList.add('siase-v2-academic-credits-page');
  const resCred = frameDocument.getElementById('ResCred');
  resCred?.classList.add('siase-v2-credit-result');
  const container = frameDocument.getElementById('Contenedor');
  container?.classList.add('siase-v2-credit-container');

  const accordion = frameDocument.getElementById('accordion');
  if (!accordion) return false;
  accordion.classList.add('siase-v2-credit-accordion');

  Array.from(accordion.children).forEach((child) => {
    if (child.tagName === 'H3') child.classList.add('siase-v2-credit-heading');
    if (child.tagName === 'DIV') child.classList.add('siase-v2-credit-panel');
  });

  Array.from(accordion.querySelectorAll<HTMLTableElement>('table')).forEach((table) => {
    if (isCreditsTable(table)) table.classList.add('siase-v2-credit-table');
  });

  if (container) addContainerHeader(frameDocument, container, resCred);

  if (creditSections(accordion).length > 1) {
    accordion.classList.add('siase-v2-credit-accordion--split');
    wireMasterDetailAccordion(accordion);
  }

  return true;
}