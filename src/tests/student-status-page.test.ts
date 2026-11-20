import { describe, expect, it, vi } from 'vitest';
import { enhanceStudentStatusPage } from '@/content/pages/student-status-page';
import { parseStudentStatusDetails } from '@/utils/parser/student-status';
import sessionExpiredFixture from './fixtures/session-expired.html?raw';
import studentStatusFixture from './fixtures/student-status.html?raw';

function mountFixture(html: string): void {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  document.body.className = '';
  document.body.innerHTML = parsed.body.innerHTML;
}

describe('student status details', () => {
  it('reads the school fields from the native markup', () => {
    mountFixture(studentStatusFixture);
    expect(parseStudentStatusDetails(document)).toEqual({
      semester: 'Enero-Junio 2099',
      status: 'DEFINITIVO',
      enrollmentType: 'REINGRESO',
      photoAccepted: 'SI',
      note: 'El trámite es únicamente al estudiante'
    });
  });

  it('leaves unidentified and expired responses in their original layout', () => {
    for (const html of ['<center>Sin información</center>', sessionExpiredFixture]) {
      mountFixture(html);
      expect(parseStudentStatusDetails(document)).toEqual({});
      enhanceStudentStatusPage(document);
      expect(document.querySelector('#siase-v2-student-status')).toBeNull();
    }
  });
});

describe('student status page', () => {
  it('keeps the live credential and waits for its QR before enabling the download', async () => {
    mountFixture(studentStatusFixture);
    const credential = document.querySelector('#idCredencial')!;
    enhanceStudentStatusPage(document);
    enhanceStudentStatusPage(document);

    expect(document.querySelectorAll('#siase-v2-student-status')).toHaveLength(1);
    const panels = document.querySelector('#siase-v2-student-status')!.children;
    expect(Array.from(panels, (panel) => panel.firstElementChild?.textContent)).toEqual([
      'Credencial virtual temporal',
      'Datos escolares'
    ]);
    expect(document.querySelector('.siase-v2-status-preview #idCredencial')).toBe(credential);
    expect(document.querySelector('.siase-v2-status-badge--positive')?.textContent).toBe('Sí');
    const download = document.querySelector<HTMLButtonElement>('[data-download]')!;
    expect(download.disabled).toBe(true);

    credential.querySelector('#qrcode')?.append(document.createElement('canvas'));

    await vi.waitFor(() => expect(download.disabled).toBe(false));
    expect(document.querySelector('[role="status"]')?.textContent).toContain('sin conexión');
  });

  it('returns the credential to its native position for printing', () => {
    mountFixture(studentStatusFixture);
    const credential = document.querySelector('#idCredencial')!;
    const parent = credential.parentElement;
    const nativePrint = document.querySelector<HTMLInputElement>('input[name="Imprimir"]')!;
    const print = vi.spyOn(nativePrint, 'click').mockImplementation(() => {
      expect(credential.parentElement).toBe(parent);
    });
    enhanceStudentStatusPage(document);

    document.querySelector<HTMLButtonElement>('[data-print]')?.click();

    expect(print).toHaveBeenCalledOnce();
    expect(document.querySelector('.siase-v2-status-preview #idCredencial')).toBe(credential);
  });

  it('shows the status without an export action when SIASE has no credential', () => {
    mountFixture(studentStatusFixture);
    document.querySelector('#idCredencial')?.remove();

    enhanceStudentStatusPage(document);

    expect(document.querySelector('dl')?.textContent).toContain('REINGRESO');
    expect(document.querySelector('[data-download]')).toBeNull();
    expect(document.querySelector('.siase-v2-status-preview')?.textContent).toContain(
      'aún no muestra'
    );
  });
});
