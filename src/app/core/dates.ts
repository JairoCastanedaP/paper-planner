import { isEn } from './i18n';

const WEEKDAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Nombres de los días (0 = domingo) en el idioma actual. */
export const weekdays = (): string[] => (isEn() ? WEEKDAYS_EN : WEEKDAYS_ES);
/** Iniciales de los días: D L M M J V S / S M T W T F S. */
export const weekdayInitials = (): string[] => weekdays().map((d) => d[0]);
/** Abreviatura de un día: 'lun' / 'Mon'. */
export const weekdayShort = (day: number): string =>
  isEn() ? WEEKDAYS_EN[day].slice(0, 3) : WEEKDAYS_ES[day].slice(0, 3).toLowerCase();
/** Nombres de los meses (0 = enero) en el idioma actual. */
export const months = (): string[] => (isEn() ? MONTHS_EN : MONTHS_ES);
/** Mes dentro de una frase: 'noviembre' / 'November'. */
export const monthInText = (month: number): string => (isEn() ? MONTHS_EN[month] : MONTHS_ES[month].toLowerCase());

export const pad = (n: number) => String(n).padStart(2, '0');

/** Fecha local → 'YYYY-MM-DD' (sin zonas horarias de por medio). */
export function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const todayKey = () => toKey(new Date());

export const monthKeyOf = (year: number, month: number) => `${year}-${pad(month + 1)}`;

/** Semanas (domingo a sábado) que cubren el mes, incluyendo días de los meses vecinos. */
export function monthGrid(year: number, month: number): string[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const cursor = new Date(year, month, 1 - first.getDay());
  const end = new Date(year, month, last.getDate() + (6 - last.getDay()));
  const weeks: string[][] = [];
  while (cursor <= end) {
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(toKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/** Último día del mes de la fecha: '2026-11-10' → '2026-11-30'. */
export function endOfMonthKey(key: string): string {
  const d = fromKey(key);
  return toKey(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

/** '30 de noviembre de 2026' / 'November 30, 2026' */
export function formatDate(key: string): string {
  const d = fromKey(key);
  return isEn()
    ? `${MONTHS_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    : `${d.getDate()} de ${MONTHS_ES[d.getMonth()].toLowerCase()} de ${d.getFullYear()}`;
}

/** 'Martes 10 de noviembre de 2026' / 'Tuesday, November 10, 2026' */
export function formatLong(key: string): string {
  const d = fromKey(key);
  return isEn() ? `${WEEKDAYS_EN[d.getDay()]}, ${formatDate(key)}` : `${WEEKDAYS_ES[d.getDay()]} ${formatDate(key)}`;
}

/** 'Mes día': 'Martes 10' / 'Tuesday 10'. */
export function weekdayAndDay(key: string): string {
  const d = fromKey(key);
  return `${weekdays()[d.getDay()]} ${d.getDate()}`;
}

/** '21:00' → '9:00pm', como se escribe en el calendario de papel. */
export function formatTime(time?: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)}${suffix}`;
}
