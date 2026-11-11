export const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const WEEKDAY_INITIALS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

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

/** '30 de noviembre de 2026' */
export function formatDate(key: string): string {
  const d = fromKey(key);
  return `${d.getDate()} de ${MONTHS[d.getMonth()].toLowerCase()} de ${d.getFullYear()}`;
}

/** 'Martes 10 de noviembre de 2026' */
export function formatLong(key: string): string {
  const d = fromKey(key);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()].toLowerCase()} de ${d.getFullYear()}`;
}

/** '21:00' → '9:00pm', como se escribe en el calendario de papel. */
export function formatTime(time?: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)}${suffix}`;
}
