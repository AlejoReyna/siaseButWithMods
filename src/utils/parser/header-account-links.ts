export interface HeaderNavLink {
  label: string;
  href: string;
  target: string;
}

export type HeaderAccountLink = HeaderNavLink;

const ACCOUNT_UTILITY_PATTERN = /contraseña|clave de seguridad|aviso de privacidad/i;
const LOGOUT_PATTERN = /salir|cerrar\s+sesi[oó]n/i;

export function cleanHeaderLinkLabel(anchor: HTMLAnchorElement): string {
  return (anchor.textContent ?? anchor.getAttribute('title') ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isHeaderAccountUtilityLink(label: string): boolean {
  return ACCOUNT_UTILITY_PATTERN.test(label);
}

export function isExcludedHeaderUtilityLink(label: string): boolean {
  return isHeaderAccountUtilityLink(label) || LOGOUT_PATTERN.test(label);
}

function dedupeHeaderNavLinks(links: HeaderNavLink[]): HeaderNavLink[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.label}|${link.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mapHeaderAnchors(document: Document): HeaderNavLink[] {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>('table.MenuLink a[href]')).map(
    (anchor) => ({
      label: cleanHeaderLinkLabel(anchor),
      href: anchor.href,
      target: anchor.target || 'center'
    })
  );
}

export function parseHeaderModuleLinks(document: Document): HeaderNavLink[] {
  return dedupeHeaderNavLinks(
    mapHeaderAnchors(document).filter(
      (link) =>
        link.label &&
        link.href &&
        link.target === 'left' &&
        !isExcludedHeaderUtilityLink(link.label)
    )
  );
}

export function parseHeaderServiceLinks(document: Document): HeaderNavLink[] {
  return dedupeHeaderNavLinks(
    mapHeaderAnchors(document).filter(
      (link) =>
        link.label &&
        link.href &&
        link.target !== 'left' &&
        !isExcludedHeaderUtilityLink(link.label)
    )
  );
}

export function parseHeaderAccountLinks(document: Document): HeaderAccountLink[] {
  return dedupeHeaderNavLinks(
    mapHeaderAnchors(document).filter(
      (link) => link.label && link.href && isHeaderAccountUtilityLink(link.label)
    )
  );
}

export function parseHeaderLogoutLink(document: Document): HeaderNavLink | null {
  const match = mapHeaderAnchors(document).find(
    (link) => link.label && link.href && LOGOUT_PATTERN.test(link.label)
  );
  return match ?? null;
}