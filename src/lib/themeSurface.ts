
export const THEME_LS = {
  primary: 'cursoflow-primary-color',
  background: 'cursoflow-background-color',
  card: 'cursoflow-card-color',
  pairedDarkBg: 'cursoflow-paired-dark-bg',
  pairedDarkCard: 'cursoflow-paired-dark-card',
} as const


export const ON_DARK_SURFACE = {
  foreground: 'oklch(0.97 0.01 260)',
  mutedForeground: 'oklch(0.72 0.03 260)',
  cardForeground: 'oklch(0.97 0.01 260)',
  border: 'oklch(0.42 0.02 260 / 0.5)',
  input: 'oklch(0.34 0.03 260 / 0.65)',
} as const


export const DARK_BACKGROUND_PRESETS = [
  { name: 'Naranja', value: 'oklch(0.19 0.06 45)' },
  { name: 'Azul', value: 'oklch(0.19 0.075 250)' },
  { name: 'Esmeralda', value: 'oklch(0.19 0.055 160)' },
  { name: 'Rosa', value: 'oklch(0.19 0.075 340)' },
  { name: 'Cian', value: 'oklch(0.19 0.065 200)' },
  { name: 'Índigo', value: 'oklch(0.19 0.08 280)' },
] as const


export const DARK_CARD_PRESETS = [
  { name: 'Naranja', value: 'oklch(0.26 0.065 45)' },
  { name: 'Azul', value: 'oklch(0.26 0.08 250)' },
  { name: 'Esmeralda', value: 'oklch(0.26 0.06 160)' },
  { name: 'Rosa', value: 'oklch(0.26 0.08 340)' },
  { name: 'Cian', value: 'oklch(0.26 0.07 200)' },
  { name: 'Índigo', value: 'oklch(0.26 0.09 280)' },
] as const

function applyPairedDarkBg(root: HTMLElement) {
  root.style.setProperty('--foreground', ON_DARK_SURFACE.foreground)
  root.style.setProperty('--muted-foreground', ON_DARK_SURFACE.mutedForeground)
  root.style.setProperty('--border', ON_DARK_SURFACE.border)
  root.style.setProperty('--input', ON_DARK_SURFACE.input)
}

function clearPairedDarkBg(root: HTMLElement) {
  root.style.removeProperty('--foreground')
  root.style.removeProperty('--muted-foreground')
  root.style.removeProperty('--border')
  root.style.removeProperty('--input')
}

function applyPairedDarkCard(root: HTMLElement) {
  root.style.setProperty('--card-foreground', ON_DARK_SURFACE.cardForeground)
}

function clearPairedDarkCard(root: HTMLElement) {
  root.style.removeProperty('--card-foreground')
}

/** Aplica variables CSS guardadas (navegador). */
export function applyStoredCursoflowTheme(): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const get = (k: string) => localStorage.getItem(k)

  const primary = get(THEME_LS.primary)
  if (primary) root.style.setProperty('--primary', primary)

  const bg = get(THEME_LS.background)
  if (bg) root.style.setProperty('--background', bg)
  else root.style.removeProperty('--background')

  if (get(THEME_LS.pairedDarkBg) === '1' && bg) applyPairedDarkBg(root)
  else clearPairedDarkBg(root)

  const card = get(THEME_LS.card)
  if (card) root.style.setProperty('--card', card)
  else root.style.removeProperty('--card')

  if (get(THEME_LS.pairedDarkCard) === '1' && card) applyPairedDarkCard(root)
  else clearPairedDarkCard(root)
}

/** Script inline para el primer paint (sin flash). */
export function getThemeBootstrapInlineScript(): string {
  const k = THEME_LS
  const o = ON_DARK_SURFACE
  return (
    '(function(){try{' +
    'var r=document.documentElement;' +
    'function g(x){try{return localStorage.getItem(x)}catch(e){return null}}' +
    ';var p=g("' +
    k.primary +
    '");if(p)r.style.setProperty("--primary",p);' +
    'var b=g("' +
    k.background +
    '");if(b)r.style.setProperty("--background",b);else r.style.removeProperty("--background");' +
    'if(g("' +
    k.pairedDarkBg +
    '")==="1"&&b){' +
    'r.style.setProperty("--foreground","' +
    o.foreground +
    '");' +
    'r.style.setProperty("--muted-foreground","' +
    o.mutedForeground +
    '");' +
    'r.style.setProperty("--border","' +
    o.border +
    '");' +
    'r.style.setProperty("--input","' +
    o.input +
    '");' +
    '}else{' +
    'r.style.removeProperty("--foreground");' +
    'r.style.removeProperty("--muted-foreground");' +
    'r.style.removeProperty("--border");' +
    'r.style.removeProperty("--input");' +
    '}' +
    'var c=g("' +
    k.card +
    '");if(c)r.style.setProperty("--card",c);else r.style.removeProperty("--card");' +
    'if(g("' +
    k.pairedDarkCard +
    '")==="1"&&c){' +
    'r.style.setProperty("--card-foreground","' +
    o.cardForeground +
    '");' +
    '}else{r.style.removeProperty("--card-foreground");}' +
    '}catch(e){}})();'
  )
}
