import { toKey } from './dates';

/** Algo que se celebra o se recuerda ese día, con su dibujo. */
export interface Commemoration {
  emoji: string;
  name: string;
  /** Solo los días especiales propios tienen id (se pueden editar o borrar). */
  id?: string;
}

/** Fechas fijas (mes, día). */
const FIXED: [month: number, day: number, emoji: string, name: string][] = [
  [1, 1, '🎆', 'Año Nuevo'],
  [2, 14, '💘', 'San Valentín'],
  [3, 8, '💐', 'Día de la Mujer'],
  [4, 23, '📚', 'Día del Idioma'],
  [10, 31, '🎃', 'Halloween'],
  [12, 7, '🕯️', 'Día de las Velitas'],
  [12, 16, '⭐', 'Inicia la Novena de Aguinaldos'],
  [12, 24, '🎄', 'Nochebuena'],
  [12, 25, '🎁', 'Navidad'],
  [12, 28, '🤡', 'Día de los Inocentes'],
  [12, 31, '🥂', 'Fin de año'],
];

/** Fechas que caen en "el n-ésimo <día de la semana> del mes" (Colombia). */
const NTH_WEEKDAY: [month: number, weekday: number, nth: number, emoji: string, name: string][] = [
  [5, 0, 2, '💐', 'Día de la Madre'],
  [6, 0, 3, '👔', 'Día del Padre'],
  [9, 6, 3, '💛', 'Amor y Amistad'],
];

function nthWeekday(year: number, month: number, weekday: number, nth: number): Date {
  const first = new Date(year, month - 1, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month - 1, 1 + offset + (nth - 1) * 7);
}

const cache = new Map<number, Map<string, Commemoration[]>>();

function computeYear(year: number): Map<string, Commemoration[]> {
  const map = new Map<string, Commemoration[]>();
  const add = (d: Date, emoji: string, name: string) => {
    const key = toKey(d);
    map.set(key, [...(map.get(key) ?? []), { emoji, name }]);
  };
  for (const [m, d, emoji, name] of FIXED) add(new Date(year, m - 1, d), emoji, name);
  for (const [m, wd, nth, emoji, name] of NTH_WEEKDAY) add(nthWeekday(year, m, wd, nth), emoji, name);
  return map;
}

/** Fechas conmemorativas incluidas en la app para ese día ('YYYY-MM-DD'). */
export function builtInCommemorationsOn(date: string): Commemoration[] {
  const year = Number(date.slice(0, 4));
  let days = cache.get(year);
  if (!days) {
    days = computeYear(year);
    cache.set(year, days);
  }
  return days.get(date) ?? [];
}
