import { DEFAULT_CATEGORIES } from './categories';
import { fromKey, pad, toKey } from './dates';
import { Category, MonthGoal, PlannerData, PlannerEvent, SpecialDay } from './models';
import { occurrenceKey, occursOn } from './recurrence';

/**
 * Datos de ejemplo para conocer la app (p. ej. en la demo para un cliente).
 * Todo se calcula a partir de la fecha actual, así el mes en curso siempre
 * se ve "a medio camino": hay cosas hechas, pendientes y por venir.
 */
const DEMO_CATEGORIES: Category[] = [
  ...DEFAULT_CATEGORIES,
  { id: 'gym', name: 'Gimnasio', color: '#4dd0e1', icon: '🏋️', customColor: true },
  { id: 'health', name: 'Salud', color: '#b39ddb', icon: '🩺', customColor: true },
];

export function createDemoData(now = new Date()): PlannerData {
  const y = now.getFullYear();
  const m = now.getMonth();
  const today = toKey(now);

  /** Fecha a `offset` días de hoy. */
  const day = (offset: number) => toKey(new Date(y, m, now.getDate() + offset));
  /** Día `d` del mes actual (+ `monthOffset`), sin pasarse del último día. */
  const dayOfMonth = (d: number, monthOffset = 0) => {
    const last = new Date(y, m + monthOffset + 1, 0).getDate();
    return toKey(new Date(y, m + monthOffset, Math.min(d, last)));
  };
  /** La misma fecha un año antes: así una fecha "cada año" ya aplica este año. */
  const yearBefore = (key: string) => {
    const d = fromKey(key);
    return toKey(new Date(d.getFullYear() - 1, d.getMonth(), d.getDate()));
  };
  const monthKey = (offset = 0) => {
    const d = new Date(y, m + offset, 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  };
  const seriesStart = dayOfMonth(1, -2);

  const events: PlannerEvent[] = [
    // Rutina semanal
    {
      id: 'demo-gym',
      title: 'Gimnasio',
      categoryId: 'gym',
      date: seriesStart,
      time: '06:30',
      notes: 'Pierna, espalda y 20 minutos de cardio. ¡No faltar!',
      recurrence: { type: 'weekly', weekdays: [1, 3, 5] },
    },
    {
      id: 'demo-english',
      title: 'Clase de inglés',
      categoryId: 'english',
      date: seriesStart,
      time: '19:00',
      notes: 'Nivel B2: conversación y listening.',
      recurrence: { type: 'weekly', weekdays: [2, 4] },
    },
    {
      id: 'demo-course',
      title: 'Curso de Angular',
      categoryId: 'academic',
      date: seriesStart,
      time: '09:00',
      notes: 'Módulo actual: signals, rutas y formularios.',
      recurrence: { type: 'weekly', weekdays: [6] },
    },
    {
      id: 'demo-standup',
      title: 'Reunión de equipo',
      categoryId: 'project',
      date: seriesStart,
      time: '09:00',
      notes: 'Revisar avances de la semana y bloqueos.',
      recurrence: { type: 'weekly', weekdays: [1] },
    },

    // Pagos del mes
    {
      id: 'demo-rent',
      title: 'Arriendo',
      categoryId: 'finance',
      date: dayOfMonth(5, -2),
      amount: 1_200_000,
      currency: 'COP',
      recurrence: { type: 'monthly' },
    },
    {
      id: 'demo-gym-fee',
      title: 'Mensualidad gimnasio',
      categoryId: 'finance',
      date: dayOfMonth(1, -2),
      amount: 120_000,
      currency: 'COP',
      recurrence: { type: 'monthly' },
    },
    {
      id: 'demo-courses-fee',
      title: 'Plataforma de cursos',
      categoryId: 'finance',
      date: dayOfMonth(18, -2),
      amount: 15,
      currency: 'USD',
      recurrence: { type: 'monthly' },
    },
    {
      id: 'demo-enrollment',
      title: 'Matrícula del diplomado',
      categoryId: 'finance',
      date: day(12),
      amount: 65,
      currency: 'USD',
      notes: 'Pagar antes del mediodía para conservar el descuento.',
      recurrence: { type: 'none' },
    },

    // Compromisos puntuales
    {
      id: 'demo-workshop',
      title: 'Taller de diseño',
      categoryId: 'academic',
      date: day(-3),
      time: '15:00',
      notes: 'Traer portátil y los bocetos impresos.',
      recurrence: { type: 'none' },
    },
    {
      id: 'demo-client',
      title: 'Demo con el cliente',
      categoryId: 'project',
      date: day(2),
      time: '16:00',
      notes: 'Mostrar la vista anual, el filtro y los recordatorios.',
      recurrence: { type: 'none' },
    },
    {
      id: 'demo-delivery',
      title: 'Entrega del proyecto',
      categoryId: 'project',
      date: day(5),
      time: '10:00',
      notes: 'Revisar pruebas, actualizar el README y preparar la presentación.',
      important: true,
      reminderMinutes: 1440,
      recurrence: { type: 'none' },
    },
    {
      id: 'demo-doctor',
      title: 'Cita médica',
      categoryId: 'health',
      date: day(9),
      time: '07:30',
      notes: 'Llevar los exámenes de laboratorio. Ir en ayunas.',
      important: true,
      reminderMinutes: 180,
      recurrence: { type: 'none' },
    },
    {
      id: 'demo-exam',
      title: 'Examen de inglés',
      categoryId: 'english',
      date: day(16),
      time: '08:00',
      important: true,
      reminderMinutes: 1440,
      recurrence: { type: 'none' },
    },

    // Cumpleaños (se repiten cada año)
    { id: 'demo-bday-mom', title: 'Mamá', categoryId: 'birthday', date: yearBefore(day(6)), notes: 'Reservar el almuerzo y comprar flores 💐', recurrence: { type: 'yearly' } },
    { id: 'demo-bday-andres', title: 'Andrés', categoryId: 'birthday', date: yearBefore(day(-5)), recurrence: { type: 'yearly' } },
    { id: 'demo-bday-laura', title: 'Laura', categoryId: 'birthday', date: yearBefore(dayOfMonth(3, 1)), recurrence: { type: 'yearly' } },
    { id: 'demo-bday-grandma', title: 'Abuela Rosa', categoryId: 'birthday', date: yearBefore(dayOfMonth(22, -1)), recurrence: { type: 'yearly' } },
  ];

  const goals: MonthGoal[] = [
    { id: 'demo-goal-gym', month: monthKey(), title: '10 días de gimnasio', target: 10, categoryId: 'gym', done: false },
    { id: 'demo-goal-english', month: monthKey(), title: 'Clases de inglés', target: 8, categoryId: 'english', match: 'Clase', done: false },
    { id: 'demo-goal-read', month: monthKey(), title: 'Leer 2 libros', done: false, detail: 'Voy en la mitad del primero 📖' },
    { id: 'demo-goal-save', month: monthKey(), title: 'Ahorrar 500.000 COP', done: true, detail: 'Transferido a la cuenta de ahorros el día 5.' },
    { id: 'demo-goal-course', month: monthKey(), title: 'Terminar el curso de Angular', done: false, detail: 'Faltan los módulos 7 y 8 y el proyecto final.' },
    { id: 'demo-goal-gym-prev', month: monthKey(-1), title: '10 días de gimnasio', target: 10, categoryId: 'gym', done: true },
    { id: 'demo-goal-read-prev', month: monthKey(-1), title: 'Leer 1 libro', done: true },
    { id: 'demo-goal-bills-prev', month: monthKey(-1), title: 'Ponerme al día con las cuentas', done: true },
  ];

  const specialDays: SpecialDay[] = [
    { id: 'demo-anniversary', date: yearBefore(day(10)), emoji: '💍', name: 'Aniversario', yearly: true },
  ];

  // ── Lo que ya se resaltó (hecho) ─────────────────────────
  const highlights: Record<string, true> = {};
  const byId = new Map(events.map((e) => [e.id, e]));
  const datesOf = (id: string, from: string, to: string) => {
    const ev = byId.get(id)!;
    const result: string[] = [];
    for (let d = fromKey(from); toKey(d) <= to; d.setDate(d.getDate() + 1)) {
      if (occursOn(ev, toKey(d))) result.push(toKey(d));
    }
    return result;
  };
  const mark = (id: string, dates: string[]) => {
    for (const date of dates) highlights[occurrenceKey(id, date)] = true;
  };

  const yesterday = day(-1);
  const prevStart = dayOfMonth(1, -2);
  const monthStart = dayOfMonth(1);
  const prevMonthEnd = day(-now.getDate());

  // Meses anteriores: casi todo hecho (el mes pasado se cumplió la meta de gimnasio).
  mark('demo-gym', datesOf('demo-gym', prevStart, prevMonthEnd).slice(-10));
  for (const id of ['demo-english', 'demo-course', 'demo-standup', 'demo-rent', 'demo-gym-fee', 'demo-courses-fee']) {
    mark(id, datesOf(id, prevStart, prevMonthEnd));
  }

  // Este mes: exactamente 4 días de gimnasio (si aún no han pasado 4, los primeros del mes).
  const gymThisMonth = datesOf('demo-gym', monthStart, dayOfMonth(31));
  const gymPast = gymThisMonth.filter((d) => d < today);
  mark('demo-gym', (gymPast.length >= 4 ? gymPast : gymThisMonth).slice(0, 4));

  // Lo demás del mes que ya pasó, quedó hecho.
  mark('demo-english', datesOf('demo-english', monthStart, yesterday).slice(0, 3));
  for (const id of ['demo-course', 'demo-standup', 'demo-rent', 'demo-gym-fee', 'demo-courses-fee', 'demo-workshop']) {
    mark(id, datesOf(id, monthStart, yesterday));
  }

  return {
    version: 1,
    demo: true,
    categories: DEMO_CATEGORIES,
    events,
    highlights,
    goals,
    specialDays,
    // El cumpleaños de mamá con fondo de confeti.
    dayImages: { [day(6)]: confettiImage() },
  };
}

/** Fondo de confeti dibujado en SVG (no necesita archivos de imagen). */
function confettiImage(): string {
  const colors = ['#ff6fb5', '#ffd166', '#6cb4ff', '#8ce563', '#ffa94d', '#b39ddb'];
  let pieces = '';
  for (let i = 0; i < 70; i++) {
    // Posiciones "aleatorias" pero siempre iguales (no cambian en cada carga).
    const x = (i * 137) % 600;
    const yy = (i * 89) % 400;
    const r = (i * 47) % 360;
    const c = colors[i % colors.length];
    pieces +=
      i % 3 === 0
        ? `<circle cx="${x}" cy="${yy}" r="${4 + (i % 4)}" fill="${c}"/>`
        : `<rect x="${x}" y="${yy}" width="14" height="6" rx="2" fill="${c}" transform="rotate(${r} ${x} ${yy})"/>`;
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#ffe3f1"/><stop offset="1" stop-color="#fff4c2"/></linearGradient></defs>` +
    `<rect width="600" height="400" fill="url(#g)"/>${pieces}</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
