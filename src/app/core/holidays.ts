import { toKey } from './dates';

/**
 * Festivos de Colombia (Ley 51 de 1983, "Ley Emiliani").
 * - Fijos: se celebran el día exacto.
 * - Trasladables: si no caen en lunes, pasan al lunes siguiente.
 * - Religiosos móviles: dependen de la fecha de Pascua.
 */
const FIXED: [month: number, day: number, name: string][] = [
  [1, 1, 'Año Nuevo'],
  [5, 1, 'Día del Trabajo'],
  [7, 20, 'Día de la Independencia'],
  [8, 7, 'Batalla de Boyacá'],
  [12, 8, 'Inmaculada Concepción'],
  [12, 25, 'Navidad'],
];

const MOVED_TO_MONDAY: [month: number, day: number, name: string][] = [
  [1, 6, 'Día de los Reyes Magos'],
  [3, 19, 'Día de San José'],
  [6, 29, 'San Pedro y San Pablo'],
  [8, 15, 'Asunción de la Virgen'],
  [10, 12, 'Día de la Raza'],
  [11, 1, 'Todos los Santos'],
  [11, 11, 'Independencia de Cartagena'],
];

/** Días después del domingo de Pascua; `monday` indica si se traslada al lunes. */
const EASTER_BASED: [offset: number, monday: boolean, name: string][] = [
  [-3, false, 'Jueves Santo'],
  [-2, false, 'Viernes Santo'],
  [39, true, 'Ascensión del Señor'],
  [60, true, 'Corpus Christi'],
  [68, true, 'Sagrado Corazón de Jesús'],
];

/** Domingo de Pascua (algoritmo gregoriano anónimo / Meeus). */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function nextMonday(d: Date): Date {
  const shift = (8 - d.getDay()) % 7; // lunes → 0, martes → 6, domingo → 1
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + shift);
}

function computeYear(year: number): Map<string, string> {
  const map = new Map<string, string>();
  const add = (d: Date, name: string) => {
    const key = toKey(d);
    map.set(key, map.has(key) ? `${map.get(key)} · ${name}` : name);
  };

  for (const [m, d, name] of FIXED) add(new Date(year, m - 1, d), name);
  for (const [m, d, name] of MOVED_TO_MONDAY) add(nextMonday(new Date(year, m - 1, d)), name);

  const easter = easterSunday(year);
  for (const [offset, monday, name] of EASTER_BASED) {
    const d = new Date(year, easter.getMonth(), easter.getDate() + offset);
    add(monday ? nextMonday(d) : d, name);
  }
  return map;
}

const cache = new Map<number, Map<string, string>>();

/** Nombre del festivo de ese día ('YYYY-MM-DD'), o undefined si no es festivo. */
export function holidayOn(date: string): string | undefined {
  const year = Number(date.slice(0, 4));
  let holidays = cache.get(year);
  if (!holidays) {
    holidays = computeYear(year);
    cache.set(year, holidays);
  }
  return holidays.get(date);
}
