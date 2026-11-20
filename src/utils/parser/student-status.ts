import { textContent } from './dom';

const fieldLabels = {
  semester: 'semestre',
  status: 'situaci[oó]n del estudiante',
  enrollmentType: 'tipo de inscripci[oó]n',
  photoAccepted: 'foto aceptada',
  note: 'nota'
};

type StudentStatusField = keyof typeof fieldLabels;
export type StudentStatusDetails = Partial<Record<StudentStatusField, string>>;

const labelBoundary = Object.values(fieldLabels).join('|');
const fieldPatterns = (Object.keys(fieldLabels) as StudentStatusField[]).map((field) => ({
  field,
  pattern: new RegExp(
    `(?:^|\\s)${fieldLabels[field]}\\s*:\\s*(.*?)(?=\\s*(?:${labelBoundary})\\s*:|$)`,
    'i'
  )
}));

export function parseStudentStatusDetails(frameDocument: Document): StudentStatusDetails {
  const legacy = frameDocument.querySelector('body > center');
  if (!legacy) return {};

  const credential = legacy.querySelector('#idCredencial');
  const details: StudentStatusDetails = {};
  const blocks = Array.from(legacy.querySelectorAll('div, p, tr, td, b, strong')).reverse();
  for (const block of blocks) {
    if (credential && (credential.contains(block) || block.contains(credential))) continue;
    const copy = block.cloneNode(true) as Element;
    copy.querySelectorAll('br').forEach((lineBreak) => lineBreak.replaceWith(' '));
    const text = textContent(copy);
    for (const { field, pattern } of fieldPatterns) {
      const value = text.match(pattern)?.[1]?.trim();
      if (value && !details[field]) details[field] = value;
    }
  }
  return details;
}
