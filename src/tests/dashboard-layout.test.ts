import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type StyledRule = {
  media: string;
  style: CSSStyleDeclaration;
};

function rulesFor(selector: string): StyledRule[] {
  const css = readFileSync(resolve(process.cwd(), 'src/content/styles/center-v2.css'), 'utf8');
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
  const found: StyledRule[] = [];

  const walk = (rules: CSSRuleList, media = ''): void => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSMediaRule) {
        walk(rule.cssRules, rule.conditionText);
        continue;
      }
      if (
        rule instanceof CSSStyleRule &&
        rule.selectorText.split(',').some((part) => part.trim() === selector)
      ) {
        found.push({ media, style: rule.style });
      }
    }
  };

  const sheet = style.sheet;
  if (!sheet) throw new Error('No se pudo leer center-v2.css');
  walk(sheet.cssRules);
  style.remove();
  return found;
}

describe('resumen dashboard layout', () => {
  it('places the profile rail on the right and scrolls only the feed', () => {
    const layout = rulesFor('.siase-v2-profile-layout').find((rule) => rule.media === '');
    const card = rulesFor('.siase-v2-profile-card').find((rule) => rule.media === '');
    const content = rulesFor('.siase-v2-profile-content').find((rule) => rule.media === '');
    const dashboard = rulesFor('#siase-v2-dashboard.siase-v2-profile-dashboard').find(
      (rule) => rule.media === ''
    );

    expect(layout?.style.gridTemplateColumns).toBe('minmax(0, 1fr) minmax(260px, 320px)');
    expect(layout?.style.overflow).toBe('hidden');
    expect(card?.style.gridArea).toBe('1 / 2');
    expect(card?.style.overflow).toBe('hidden');
    expect(content?.style.gridArea).toBe('1 / 1');
    expect(content?.style.overflowY).toBe('auto');
    expect(dashboard?.style.overflow).toBe('hidden');
    expect(dashboard?.style.height).toBe('100%');
  });

  it('locks the document so the page itself does not scroll', () => {
    const locked = rulesFor(
      'body.siase-v2-center:has(#siase-v2-dashboard.siase-v2-profile-dashboard)'
    ).find((rule) => rule.media === '');

    expect(locked?.style.overflow).toBe('hidden');
    expect(locked?.style.height).toBe('100%');
  });

  it('shrinks the avatar so every profile field fits the rail', () => {
    const photo = rulesFor('.siase-v2-profile-photo').find((rule) => rule.media.includes('1051'));

    expect(photo?.style.getPropertyValue('--siase-v2-avatar-size')).toContain('100cqb');
    expect(photo?.style.height).toBe('var(--siase-v2-avatar-size)');
  });

  it('stacks the columns and scrolls that stack on a narrow center frame', () => {
    const layout = rulesFor('.siase-v2-profile-layout').find((rule) => rule.media.includes('1050'));
    const card = rulesFor('.siase-v2-profile-card').find((rule) => rule.media.includes('1050'));

    expect(layout?.style.gridTemplateColumns).toBe('minmax(0, 1fr)');
    expect(layout?.style.overflowY).toBe('auto');
    expect(card?.style.gridArea).toBe('auto');
    expect(card?.style.overflow).toBe('visible');
  });
});
