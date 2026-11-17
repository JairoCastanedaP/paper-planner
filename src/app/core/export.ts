import { fromKey, toKey, weekdays } from './dates';
import { tx } from './i18n';
import { Category, Occurrence, PlannerEvent } from './models';
import { describeRecurrence, occursOn } from './recurrence';

/** Días (YYYY-MM-DD) entre dos fechas, ambas incluidas. */
export function daysBetween(from: string, to: string): string[] {
  const days: string[] = [];
  const d = fromKey(from);
  for (let key = from; key <= to; key = toKey(d)) {
    days.push(key);
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// ── Excel (.csv) ─────────────────────────────────────────────

/**
 * Tabla con una fila por actividad y día, con BOM UTF-8 para que Excel respete las tildes.
 * En español usa ";" y coma decimal (Excel en español); en inglés, "," y punto decimal.
 */
export function toCsv(occurrences: Occurrence[], categories: Map<string, Category>): string {
  const header = tx(
    'Fecha;Día;Hora;Actividad;Categoría;Importante;Resaltada;Valor;Moneda;Repetición;Notas',
    'Date;Day;Time;Activity;Category;Important;Highlighted;Amount;Currency;Repeats;Notes',
  ).split(';');
  const yes = tx('Sí', 'Yes');
  const no = 'No';
  const rows = occurrences.map(({ event: ev, date, highlighted }) => [
    date,
    weekdays()[fromKey(date).getDay()],
    ev.time ?? '',
    ev.title,
    categories.get(ev.categoryId)?.name ?? '',
    ev.important ? yes : no,
    highlighted ? yes : no,
    ev.amount ? tx(String(ev.amount).replace('.', ','), String(ev.amount)) : '',
    ev.amount ? (ev.currency ?? '') : '',
    describeRecurrence(ev),
    ev.notes ?? '',
  ]);
  const sep = tx(';', ',');
  const cell = (v: string) => (/[;,"\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return '\uFEFF' + [header, ...rows].map((r) => r.map(cell).join(sep)).join('\r\n') + '\r\n';
}

// ── Calendario (.ics) ────────────────────────────────────────

const compact = (key: string) => key.replace(/-/g, '');

/** Escapa texto según iCalendar (RFC 5545). */
const icsText = (v: string) => v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Parte las líneas largas en trozos de 75 bytes como pide el estándar, sin cortar tildes ni emojis. */
function fold(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = '';
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    if (bytes + size > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = '';
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

/** Hora final: una hora después de la de inicio (sin pasar de medianoche). */
function endTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return h >= 23 ? '235900' : `${String(h + 1).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
}

/** Inicio y fin de una actividad en un día: con hora, una hora; sin hora, todo el día. */
function timing(ev: PlannerEvent, date: string): string[] {
  if (ev.time) {
    const start = `${compact(date)}T${ev.time.replace(':', '')}00`;
    return [`DTSTART:${start}`, `DTEND:${compact(date)}T${endTime(ev.time)}`];
  }
  const next = fromKey(date);
  next.setDate(next.getDate() + 1);
  return [`DTSTART;VALUE=DATE:${compact(date)}`, `DTEND;VALUE=DATE:${compact(toKey(next))}`];
}

/** Regla de repetición en formato iCalendar. */
function rrule(ev: PlannerEvent): string | null {
  const r = ev.recurrence;
  const codes = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  let rule: string;
  switch (r.type) {
    case 'none':
      return null;
    case 'weekly':
      rule = `FREQ=WEEKLY;BYDAY=${(r.weekdays ?? []).map((d) => codes[d]).join(',')}`;
      break;
    case 'monthly': {
      // Del 29 en adelante cae el último día en los meses más cortos, como en la app.
      const day = Number(ev.date.slice(8));
      rule =
        day <= 28
          ? `FREQ=MONTHLY;BYMONTHDAY=${day}`
          : `FREQ=MONTHLY;BYMONTHDAY=${Array.from({ length: day - 27 }, (_, i) => 28 + i).join(',')};BYSETPOS=-1`;
      break;
    }
    case 'yearly':
      rule = 'FREQ=YEARLY';
      break;
  }
  if (r.until) rule += `;UNTIL=${compact(r.until)}${ev.time ? 'T235959' : ''}`;
  return `RRULE:${rule}`;
}

/** Primer día real de una serie (p. ej. si empieza un martes pero solo se repite lunes). */
function firstDay(ev: PlannerEvent): string | null {
  const probe = { ...ev, exceptions: undefined };
  const d = fromKey(ev.date);
  for (let i = 0; i < 400; i++) {
    const key = toKey(d);
    if (occursOn(probe, key)) return key;
    d.setDate(d.getDate() + 1);
  }
  return null;
}

function eventLines(ev: PlannerEvent, date: string, uid: string, stamp: string, categories: Map<string, Category>, series: boolean): string[] {
  const description = [
    ev.notes,
    ev.amount ? `${tx('Valor', 'Amount')}: ${ev.amount} ${ev.currency ?? ''}`.trim() : '',
  ].filter(Boolean).join('\n');
  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    ...timing(ev, date),
    `SUMMARY:${icsText(ev.title)}`,
  ];
  if (series) {
    const rule = rrule(ev);
    if (rule) lines.push(rule);
    for (const ex of ev.exceptions ?? []) {
      lines.push(ev.time ? `EXDATE:${compact(ex)}T${ev.time.replace(':', '')}00` : `EXDATE;VALUE=DATE:${compact(ex)}`);
    }
  }
  if (description) lines.push(`DESCRIPTION:${icsText(description)}`);
  const category = categories.get(ev.categoryId)?.name;
  if (category) lines.push(`CATEGORIES:${icsText(category)}`);
  if (ev.important) {
    lines.push('PRIORITY:1');
    lines.push(
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${icsText(ev.title)}`,
      `TRIGGER:-PT${ev.reminderMinutes ?? 0}M`,
      'END:VALARM',
    );
  }
  lines.push('END:VEVENT');
  return lines;
}

/**
 * Archivo para Google Calendar, Outlook o el calendario del celular.
 * - `series`: cada actividad una sola vez, con su regla de repetición, fecha de fin y días quitados.
 * - `occurrences`: solo los días del periodo elegido, cada uno como actividad suelta.
 */
export function toIcs(
  source: { series: PlannerEvent[] } | { occurrences: Occurrence[] },
  categories: Map<string, Category>,
): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const body: string[] = [];
  if ('series' in source) {
    for (const ev of source.series) {
      const start = ev.recurrence.type === 'none' ? ev.date : firstDay(ev);
      if (start) body.push(...eventLines(ev, start, `${ev.id}@paper-planner`, stamp, categories, true));
    }
  } else {
    for (const { event, date } of source.occurrences) {
      body.push(...eventLines(event, date, `${event.id}-${compact(date)}@paper-planner`, stamp, categories, false));
    }
  }
  return (
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Paper Planner//ES',
      'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:Paper Planner',
      ...body,
      'END:VCALENDAR',
    ]
      .map(fold)
      .join('\r\n') + '\r\n'
  );
}

/** Descarga un texto como archivo. */
export function downloadText(content: string, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
