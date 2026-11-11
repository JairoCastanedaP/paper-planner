import { Injectable, computed, effect, signal } from '@angular/core';
import { COLOMBIAN_MONTHS } from './colombia';

/** Ambientación de un mes (temas que cambian con el mes, como "Colombiano"). */
export interface MonthAmbience {
  emoji: string;
  name: string;
  /** Nota corta que se muestra debajo de la frase del mes. */
  note: string;
  /** Variables CSS que reemplazan las del tema durante ese mes. */
  tokens: Record<string, string>;
}

/** Paleta completa: colores base de la hoja y colores del marcador por categoría. */
export interface Theme {
  id: string;
  name: string;
  description: string;
  dark?: boolean;
  /** Variables CSS que se aplican en :root. */
  tokens: Record<string, string>;
  categoryColors: Record<string, string>;
  /** Si existe, cada mes (0 = enero) tiene su propia ambientación. */
  monthly?: MonthAmbience[];
}

const LIGHT_BASE = {
  '--on-line': '#ffffff',
  '--on-accent': '#ffffff',
  '--input-bg': '#ffffff',
  '--ink-blend': 'multiply',
  '--ink-on-highlight': 'var(--ink)',
};

export const THEMES: Theme[] = [
  {
    id: 'standard',
    name: 'Estándar',
    description: 'Los colores del calendario de papel.',
    tokens: {
      ...LIGHT_BASE,
      '--paper': '#fbf8f1',
      '--card': '#fffdf8',
      '--ink': '#1d1b19',
      '--muted': '#6b645b',
      '--line': '#2a2622',
      '--soft-line': '#d9d2c5',
      '--red': '#c8102e',
      '--red-hover': '#a50d26',
      '--sunday': '#f8e4e7',
      '--out': '#f1ede4',
      '--hover': '#fff6d6',
    },
    categoryColors: {
      academic: '#ffa94d',
      english: '#8ce563',
      finance: '#ff6fb5',
      birthday: '#f5c542',
      project: '#6cb4ff',
    },
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Tonos suaves, como marcadores pastel.',
    tokens: {
      ...LIGHT_BASE,
      '--paper': '#fdf6f9',
      '--card': '#fffafc',
      '--ink': '#3a3340',
      '--muted': '#8a7f8f',
      '--line': '#6d5f73',
      '--soft-line': '#eadde6',
      '--red': '#c4578d',
      '--red-hover': '#a84375',
      '--sunday': '#fbe3ee',
      '--out': '#f5eef2',
      '--hover': '#fff0f7',
    },
    categoryColors: {
      academic: '#ffc994',
      english: '#bdeca0',
      finance: '#ffb3d6',
      birthday: '#ffe28a',
      project: '#b8d8ff',
    },
  },
  {
    id: 'ocean',
    name: 'Océano',
    description: 'Azules y turquesas frescos.',
    tokens: {
      ...LIGHT_BASE,
      '--paper': '#f2f7f9',
      '--card': '#fbfdfe',
      '--ink': '#0f2a36',
      '--muted': '#5b7480',
      '--line': '#0f3b4f',
      '--soft-line': '#cfe0e7',
      '--red': '#0b7fab',
      '--red-hover': '#08668a',
      '--sunday': '#dceff6',
      '--out': '#e8eff2',
      '--hover': '#e3f5fb',
    },
    categoryColors: {
      academic: '#ffb562',
      english: '#5fd3b5',
      finance: '#f78fb3',
      birthday: '#ffd166',
      project: '#7aa7ff',
    },
  },
  {
    id: 'forest',
    name: 'Bosque',
    description: 'Verdes y tonos tierra.',
    tokens: {
      ...LIGHT_BASE,
      '--on-line': '#f4f1e6',
      '--paper': '#f6f4ec',
      '--card': '#fcfbf6',
      '--ink': '#22301f',
      '--muted': '#6a7363',
      '--line': '#2f4a2c',
      '--soft-line': '#d8dccb',
      '--red': '#3f7d3a',
      '--red-hover': '#2f6229',
      '--sunday': '#e6efd9',
      '--out': '#eeede3',
      '--hover': '#f1f6e4',
    },
    categoryColors: {
      academic: '#e9a35b',
      english: '#a3d977',
      finance: '#e58fa8',
      birthday: '#f0cf5a',
      project: '#8fb8de',
    },
  },
  {
    id: 'colombian',
    name: 'Colombiano',
    description: 'Cada mes se ambienta con una fiesta o tradición de Colombia.',
    tokens: {
      ...LIGHT_BASE,
      '--paper': '#fbf8f1',
      '--card': '#fffdf8',
      '--ink': '#1d1b19',
      '--muted': '#6b645b',
      '--line': '#0b2a5b',
      '--soft-line': '#d6d6dc',
      '--red': '#ce1126',
      '--red-hover': '#a50d1e',
      '--sunday': '#fff3c4',
      '--out': '#f0eee6',
      '--hover': '#fff6d6',
    },
    categoryColors: {
      academic: '#ffa94d',
      english: '#8ce563',
      finance: '#ff6fb5',
      birthday: '#fcd116',
      project: '#6cb4ff',
    },
    monthly: COLOMBIAN_MONTHS,
  },
  {
    id: 'night',
    name: 'Nocturno',
    description: 'Fondo oscuro con marcadores neón.',
    dark: true,
    tokens: {
      '--on-line': '#ece8e1',
      '--on-accent': '#ffffff',
      '--input-bg': '#262a31',
      '--ink-blend': 'normal',
      '--ink-on-highlight': '#111214',
      '--paper': '#17191d',
      '--card': '#1f2228',
      '--ink': '#ece8e1',
      '--muted': '#a29d95',
      '--line': '#4a4f59',
      '--soft-line': '#343943',
      '--red': '#ff5c7a',
      '--red-hover': '#ff7a92',
      '--sunday': '#2b2026',
      '--out': '#1b1d21',
      '--hover': '#272b33',
    },
    categoryColors: {
      academic: '#ff9f43',
      english: '#7bed6f',
      finance: '#ff5fae',
      birthday: '#ffd23f',
      project: '#4fb3ff',
    },
  },
];

const THEME_KEY = 'paper-planner:theme';

/** Tema elegido en este dispositivo; se aplica como variables CSS en :root. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themes = THEMES;
  readonly themeId = signal(readThemeId());
  readonly theme = computed(() => THEMES.find((t) => t.id === this.themeId()) ?? THEMES[0]);

  /** Mes que se está viendo (0 = enero), o null fuera del calendario o en la vista anual. */
  readonly ambienceMonth = signal<number | null>(null);
  /** Ambientación del mes visible, solo si el tema la tiene (p. ej. "Colombiano"). */
  readonly ambience = computed(() => {
    const month = this.ambienceMonth();
    return month === null ? null : (this.theme().monthly?.[month] ?? null);
  });

  constructor() {
    effect(() => {
      const theme = this.theme();
      const root = document.documentElement;
      const tokens = { ...theme.tokens, ...(this.ambience()?.tokens ?? {}) };
      for (const [name, value] of Object.entries(tokens)) root.style.setProperty(name, value);
      root.dataset['theme'] = theme.id;
      root.style.setProperty('--done', theme.categoryColors['english'] ?? '#8ce563');
      root.style.colorScheme = theme.dark ? 'dark' : 'light';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tokens['--red']);
      try {
        localStorage.setItem(THEME_KEY, theme.id);
      } catch {
        // Sin almacenamiento, el tema dura hasta recargar.
      }
    });
  }

  select(id: string): void {
    this.themeId.set(id);
  }
}

function readThemeId(): string {
  try {
    return localStorage.getItem(THEME_KEY) ?? 'standard';
  } catch {
    return 'standard';
  }
}
