import { signal } from '@angular/core';

/**
 * Idioma de la app (español o inglés). Es una señal global: todo lo que la lee
 * (plantillas, computed, fechas) se actualiza al instante al cambiar de idioma.
 * Se guarda por dispositivo; por defecto la app está en español.
 */
export type Lang = 'es' | 'en';

const KEY = 'paper-planner:lang';

function initial(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // Sin almacenamiento: español.
  }
  return 'es';
}

export const lang = signal<Lang>(initial());
if (typeof document !== 'undefined') document.documentElement.lang = lang();

export function setLang(value: Lang): void {
  lang.set(value);
  document.documentElement.lang = value;
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Sin almacenamiento el idioma dura hasta recargar.
  }
}

/** El texto en el idioma actual: `tx('Mi cuenta', 'My account')`. */
export const tx = (es: string, en: string): string => (lang() === 'en' ? en : es);

/** ¿La app está en inglés? */
export const isEn = (): boolean => lang() === 'en';

/** Configuración regional para números y horas: '1.500.000' / '1,500,000'. */
export const locale = (): string => (isEn() ? 'en-US' : 'es-CO');
