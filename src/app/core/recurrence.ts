import { WEEKDAYS, formatDate, fromKey } from './dates';
import { Occurrence, PlannerEvent } from './models';

export const occurrenceKey = (eventId: string, date: string) => `${eventId}@${date}`;

/** ¿La actividad aparece en este día? Las claves YYYY-MM-DD se comparan como texto. */
export function occursOn(ev: PlannerEvent, date: string): boolean {
  if (date < ev.date) return false;
  const r = ev.recurrence;
  if (r.until && date > r.until) return false;
  if (ev.exceptions?.includes(date)) return false;

  switch (r.type) {
    case 'none':
      return date === ev.date;
    case 'weekly':
      return (r.weekdays ?? []).includes(fromKey(date).getDay());
    case 'monthly': {
      const day = Number(date.slice(8));
      const startDay = Number(ev.date.slice(8));
      if (day === startDay) return true;
      // Una actividad del día 31 cae el último día en los meses más cortos.
      const d = fromKey(date);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      return startDay > lastDay && day === lastDay;
    }
    case 'yearly':
      return date.slice(5) === ev.date.slice(5);
  }
}

/** Sin hora primero (cumpleaños, todo el día), luego por hora. */
export function compareOccurrences(a: Occurrence, b: Occurrence): number {
  const ta = a.event.time ?? '';
  const tb = b.event.time ?? '';
  return ta === tb ? a.event.title.localeCompare(b.event.title) : ta.localeCompare(tb);
}

export function describeRecurrence(ev: PlannerEvent): string {
  const r = ev.recurrence;
  let text: string;
  switch (r.type) {
    case 'none':
      return '';
    case 'weekly':
      text = 'Cada ' + (r.weekdays ?? []).map((d) => WEEKDAYS[d].slice(0, 3).toLowerCase()).join(', ');
      break;
    case 'monthly':
      text = `Cada mes, el día ${Number(ev.date.slice(8))}`;
      break;
    case 'yearly':
      text = 'Cada año';
      break;
  }
  return r.until ? `${text}, hasta el ${formatDate(r.until)}` : text;
}
