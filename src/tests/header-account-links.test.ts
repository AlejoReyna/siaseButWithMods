import { describe, expect, it } from 'vitest';
import {
  isExcludedHeaderUtilityLink,
  parseHeaderAccountLinks,
  parseHeaderLogoutLink,
  parseHeaderModuleLinks,
  parseHeaderServiceLinks
} from '@/utils/parser/header-account-links';

function headerFixture(): string {
  return `
    <table class="MenuLink">
      <tr>
        <td><a href="/cgi-bin/wspd_cgi.sh/escolar.htm" target="left">Escolar</a></td>
        <td><a href="/cgi-bin/wspd_cgi.sh/teso.htm" target="left">Tesorería</a></td>
        <td><a href="/cgi-bin/exci.sh/portal.htm" target="center">EXCI</a></td>
        <td><a href="/cgi-bin/wspd_cgi.sh/pass01.htm" target="center">Contraseña</a></td>
        <td><a href="/cgi-bin/feria.sh/cveseg01.htm" target="center">Clave de Seguridad</a></td>
        <td><a href="/cgi-bin/wspd_cgi.sh/avisopriv.htm" target="center">Aviso de Privacidad</a></td>
        <td><a href="/cgi-bin/wspd_cgi.sh/cerrar.htm" target="left">Salir</a></td>
      </tr>
    </table>
  `;
}

describe('parseHeaderAccountLinks', () => {
  it('extracts account utility links from the native header', () => {
    document.body.innerHTML = headerFixture();
    expect(parseHeaderAccountLinks(document).map(({ label }) => label)).toEqual([
      'Contraseña',
      'Clave de Seguridad',
      'Aviso de Privacidad'
    ]);
  });

  it('extracts module and service header links for the sidebar', () => {
    document.body.innerHTML = headerFixture();
    expect(parseHeaderModuleLinks(document).map(({ label }) => label)).toEqual([
      'Escolar',
      'Tesorería'
    ]);
    expect(parseHeaderServiceLinks(document).map(({ label }) => label)).toEqual(['EXCI']);
  });

  it('treats account and logout labels as excluded from the top utility nav', () => {
    expect(isExcludedHeaderUtilityLink('Contraseña')).toBe(true);
    expect(isExcludedHeaderUtilityLink('Salir')).toBe(true);
    expect(isExcludedHeaderUtilityLink('Recibos')).toBe(false);
  });

  it('extracts the logout link from the native header', () => {
    document.body.innerHTML = headerFixture();
    expect(parseHeaderLogoutLink(document)?.label).toBe('Salir');
  });
});