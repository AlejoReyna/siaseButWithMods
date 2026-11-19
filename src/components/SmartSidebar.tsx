import { useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  GraduationCap,
  Home,
  LogOut,
  Pin,
  Search,
  Settings,
  Sparkles,
  UserRound
} from 'lucide-react';
import type { MenuCategory, MenuItem } from '@/types/menu';
import type { HeaderAccountLink, HeaderNavLink } from '@/utils/parser/header-account-links';

export interface SmartSidebarProps {
  items: MenuItem[];
  accountLinks: HeaderAccountLink[];
  logoutLink: HeaderNavLink | null;
  moduleLinks: HeaderNavLink[];
  serviceLinks: HeaderNavLink[];
  enhancementsActive: boolean;
  query: string;
  pinnedIds: string[];
  initialCollapsed?: boolean;
  onQueryChange: (query: string) => void;
  onTogglePinned: (id: string) => void;
  onToggleEnhancements: () => void;
  onToggleCollapsed?: (collapsed: boolean) => void;
}

const categoryOrder: MenuCategory[] = [
  'academic',
  'schedule',
  'payments',
  'services',
  'profile',
  'other'
];

const categoryMeta = {
  academic: { label: 'Académico', icon: GraduationCap },
  schedule: { label: 'Horario', icon: CalendarDays },
  payments: { label: 'Finanzas', icon: CircleDollarSign },
  services: { label: 'Trámites', icon: FileCheck2 },
  profile: { label: 'Perfil', icon: UserRound },
  other: { label: 'Otros servicios', icon: Sparkles }
} satisfies Record<MenuCategory, { label: string; icon: typeof BookOpen }>;

export function SmartSidebar({
  items,
  accountLinks,
  logoutLink,
  moduleLinks,
  serviceLinks,
  enhancementsActive,
  query,
  pinnedIds,
  initialCollapsed = false,
  onQueryChange,
  onTogglePinned,
  onToggleEnhancements,
  onToggleCollapsed
}: SmartSidebarProps): JSX.Element {
  const [localQuery, setLocalQuery] = useState(query);
  const [localPinnedIds, setLocalPinnedIds] = useState(pinnedIds);
  const [activeId, setActiveId] = useState<string>();
  const [activeModuleHref, setActiveModuleHref] = useState(moduleLinks[0]?.href);
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const headerLinks = [...moduleLinks, ...serviceLinks];
  const [openGroups, setOpenGroups] = useState<Record<MenuCategory, boolean>>({
    academic: false,
    schedule: false,
    payments: false,
    services: false,
    profile: false,
    other: false
  });

  const filteredItems = useMemo(() => {
    const normalized = localQuery.trim().toLocaleLowerCase('es-MX');
    if (!normalized) return items;
    return items.filter((item) => item.label.toLocaleLowerCase('es-MX').includes(normalized));
  }, [items, localQuery]);

  const groups = useMemo(
    () =>
      categoryOrder
        .map((category) => ({
          category,
          items: filteredItems.filter((item) => item.category === category)
        }))
        .filter((group) => group.items.length),
    [filteredItems]
  );

  const pinnedItems = filteredItems.filter((item) => localPinnedIds.includes(item.id));

  function updateQuery(value: string): void {
    setLocalQuery(value);
    onQueryChange(value);
  }

  function togglePinned(id: string): void {
    setLocalPinnedIds((current) =>
      current.includes(id) ? current.filter((currentId) => currentId !== id) : [...current, id]
    );
    onTogglePinned(id);
  }

  function handleHome(): void {
    window.top?.location.reload();
  }

  function handleLogout(): void {
    if (logoutLink?.href) {
      window.top?.location.assign(logoutLink.href);
      return;
    }

    const logout = Array.from(
      document.querySelectorAll<HTMLAnchorElement | HTMLButtonElement | HTMLInputElement>(
        'a, button, input[type="button"], input[type="submit"]'
      )
    ).find((element) => {
      const label = element instanceof HTMLInputElement ? element.value : element.textContent;
      return /salir|cerrar\s+sesi[oó]n|logout/i.test(label ?? '');
    });

    if (logout instanceof HTMLAnchorElement && logout.href) {
      window.top?.location.assign(logout.href);
    } else if (logout) {
      logout.click();
    }
  }

  function toggleCollapsed(): void {
    setIsCollapsed((current) => {
      const next = !current;
      onToggleCollapsed?.(next);
      return next;
    });
  }

  function renderItem(item: MenuItem): JSX.Element {
    const pinned = localPinnedIds.includes(item.id);
    const opensNewContext = item.target === '_blank' || item.target === '_new';
    return (
      <li className="siase-v2-nav-item" key={item.id}>
        <a
          className={activeId === item.id ? 'is-active' : ''}
          href={item.href}
          target={item.target}
          rel={opensNewContext ? 'noopener noreferrer' : undefined}
          onClick={() => setActiveId(item.id)}
          title={item.label}
        >
          <span>{item.label}</span>
          {item.target !== 'center' ? <em>{item.target === '_top' ? '↗' : '＋'}</em> : null}
        </a>
        <button
          className={pinned ? 'siase-v2-pin is-pinned' : 'siase-v2-pin'}
          type="button"
          aria-label={pinned ? `Quitar ${item.label} de favoritos` : `Fijar ${item.label}`}
          onClick={() => togglePinned(item.id)}
        >
          <Pin size={14} aria-hidden="true" />
        </button>
      </li>
    );
  }

  return (
    <nav
      className={isCollapsed ? 'siase-v2-sidebar is-collapsed' : 'siase-v2-sidebar'}
      aria-label="Servicios SIASE"
    >
      <div className="siase-v2-sidebar__top">
        <div className="siase-v2-sidebar__top-row">
          <button
            className="siase-v2-sidebar__brand"
            type="button"
            aria-label="Inicio de SIASE"
            title="Inicio de SIASE"
            onClick={handleHome}
          >
            <span className="siase-v2-sidebar__brand-mark" aria-hidden="true">U</span>
            <span className="siase-v2-sidebar__brand-name" aria-hidden="true">
              <strong>UANL</strong>
              <em>SIASE</em>
            </span>
          </button>
          <button
            className={
              enhancementsActive
                ? 'siase-v2-sidebar__style-toggle'
                : 'siase-v2-sidebar__style-toggle is-native'
            }
            type="button"
            aria-pressed={!enhancementsActive}
            aria-label={
              enhancementsActive
                ? 'Comparar con la versión original de SIASE'
                : 'Activar estilos de Oh My SIASE'
            }
            title={enhancementsActive ? 'Ver versión original' : 'Activar Oh My SIASE'}
            onClick={onToggleEnhancements}
          >
            <span aria-hidden="true">◐</span>
          </button>
          <button
            className="siase-v2-sidebar__collapse-toggle"
            type="button"
            aria-expanded={!isCollapsed}
            aria-controls="siase-v2-sidebar-content"
            aria-label={isCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
            title={isCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
            onClick={toggleCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight size={17} aria-hidden="true" />
            ) : (
              <ChevronLeft size={17} aria-hidden="true" />
            )}
          </button>
        </div>
        <label className="siase-v2-search" aria-hidden={isCollapsed}>
          <Search size={16} aria-hidden="true" />
          <span className="siase-v2-sr-only">Buscar servicio</span>
          <input
            type="search"
            value={localQuery}
            placeholder="Buscar"
            tabIndex={isCollapsed ? -1 : undefined}
            onChange={(event) => updateQuery(event.currentTarget.value)}
          />
        </label>
      </div>

      <div className="siase-v2-sidebar__scroll" id="siase-v2-sidebar-content">
        <button
          className="siase-v2-home siase-v2-home--nav"
          type="button"
          onClick={handleHome}
          title="Inicio"
        >
          <Home size={18} aria-hidden="true" />
          <span>Inicio</span>
        </button>

        {headerLinks.length ? (
          <section className="siase-v2-sidebar__modules" aria-label="Módulos y servicios del portal">
            <h2 className="siase-v2-sidebar__modules-title">Módulos</h2>
            <ul className="siase-v2-sidebar__module-list">
              {moduleLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className={activeModuleHref === link.href ? 'is-active' : undefined}
                    href={link.href}
                    target={link.target}
                    title={link.label}
                    onClick={() => setActiveModuleHref(link.href)}
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.target}
                    title={link.label}
                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  >
                    <span>{link.label}</span>
                    {link.target !== 'center' ? <em>{link.target === '_top' ? '↗' : '＋'}</em> : null}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {pinnedItems.length ? (
          <section className="siase-v2-nav-group siase-v2-nav-group--favorites">
            <h2>Favoritos</h2>
            <ul>{pinnedItems.map(renderItem)}</ul>
          </section>
        ) : null}

        {groups.map(({ category, items: groupItems }) => {
          const meta = categoryMeta[category];
          const CategoryIcon = meta.icon;
          const isOpen = Boolean(localQuery) || (!isCollapsed && openGroups[category]);
          return (
            <section className="siase-v2-nav-group" key={category}>
              <button
                className="siase-v2-nav-group__toggle"
                type="button"
                aria-expanded={isOpen}
                title={meta.label}
                onClick={() =>
                  isCollapsed
                    ? toggleCollapsed()
                    : setOpenGroups((current) => ({ ...current, [category]: !current[category] }))
                }
              >
                <span>
                  <CategoryIcon size={17} aria-hidden="true" />
                  {meta.label}
                </span>
                <span className="siase-v2-nav-group__count">{groupItems.length}</span>
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {isOpen ? <ul>{groupItems.map(renderItem)}</ul> : null}
            </section>
          );
        })}

        {!filteredItems.length ? (
          <p className="siase-v2-no-results">No encontramos un servicio con ese nombre.</p>
        ) : null}
      </div>

      {accountLinks.length ? (
        <section
          className="siase-v2-sidebar__settings"
          aria-label="Configuración de la cuenta"
        >
          <button
            className="siase-v2-sidebar__settings-toggle"
            type="button"
            aria-expanded={settingsOpen}
            aria-controls="siase-v2-settings-links"
            title="Configuración de cuenta"
            onClick={() => {
              if (isCollapsed) {
                setSettingsOpen(true);
                toggleCollapsed();
                return;
              }
              setSettingsOpen((current) => !current);
            }}
          >
            <Settings size={18} aria-hidden="true" />
            <span>Cuenta</span>
            <ChevronDown
              size={15}
              aria-hidden="true"
              className={settingsOpen ? 'is-open' : undefined}
            />
          </button>
          {settingsOpen && !isCollapsed ? (
            <ul id="siase-v2-settings-links">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target={link.target} title={link.label}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <footer className="siase-v2-sidebar__footer">
        <button type="button" onClick={handleLogout}>
          <LogOut size={17} aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </footer>
    </nav>
  );
}
