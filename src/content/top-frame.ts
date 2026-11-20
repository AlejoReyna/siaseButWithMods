import { parseStudentInfo } from '@/utils/parser/student';
import { getStorageValue, setStorageValue } from '@/utils/storage';
import { enhancementsEnabled } from '@/utils/enhancements';
import { collapseLegacyFrames, restoreLegacyFrames } from './single-view-layout';

export async function initializeTopFrame(frameDocument: Document): Promise<void> {
  if (window.name !== 'top') return;

  const enabled = await enhancementsEnabled();
  if (!enabled) {
    restoreLegacyFrames();
    frameDocument.body.classList.remove('siase-v2-top', 'siase-v2-top--chromeless');
    return;
  }

  collapseLegacyFrames();
  const parsed = parseStudentInfo(frameDocument);
  const existing = await getStorageValue('studentInfo');
  const studentInfo = {
    ...existing,
    ...parsed,
    matricula: existing?.matricula || parsed.matricula
  };
  await setStorageValue('studentInfo', studentInfo);

  frameDocument.body.classList.add('siase-v2-top', 'siase-v2-top--chromeless');
  frameDocument.querySelectorAll('table.MenuLink').forEach((table) => {
    table.classList.add('siase-v2-native-header');
  });
  frameDocument.getElementById('siase-v2-header')?.remove();
}

void initializeTopFrame(document);