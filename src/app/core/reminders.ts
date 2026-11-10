import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { fromKey, toKey } from './dates';
import { Occurrence } from './models';
import { PlannerStore } from './planner-store';

const STATE_KEY = 'paper-planner:reminders';
const CHECK_EVERY_MS = 30_000;
/** Anticipación por defecto de un recordatorio. */
export const DEFAULT_REMINDER_MINUTES = 60;
/** Una actividad con hora se sigue recordando hasta 30 min después de empezar. */
const GRACE_AFTER_START_MS = 30 * 60_000;

export interface Reminder {
  occurrence: Occurrence;
  /** Inicio de la actividad (para las de todo el día, las 00:00). */
  startsAt: number;
  allDay: boolean;
}

interface ReminderState {
  /** Ocurrencias que el usuario ya dio por vistas. */
  dismissed: Record<string, true>;
  /** Ocurrencias pospuestas hasta un instante (ms). */
  snoozed: Record<string, number>;
}

/**
 * Revisa cada 30 segundos las actividades "muy importantes" de hoy y mañana
 * y expone las que ya entraron en su ventana de aviso.
 */
@Injectable({ providedIn: 'root' })
export class ReminderService {
  private readonly store = inject(PlannerStore);
  private readonly now = signal(Date.now());
  private readonly state = signal<ReminderState>(readState());

  readonly due = computed<Reminder[]>(() => {
    const now = this.now();
    const { dismissed, snoozed } = this.state();
    const today = new Date(now);
    const dates = [toKey(today), toKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))];

    return dates
      .flatMap((date) => this.store.occurrencesOn(date))
      .filter((o) => o.event.important && !o.highlighted && !dismissed[o.key])
      .filter((o) => !(snoozed[o.key] > now))
      .map((o) => toReminder(o))
      .filter((r) => {
        const lead = (r.occurrence.event.reminderMinutes ?? DEFAULT_REMINDER_MINUTES) * 60_000;
        const end = r.allDay ? r.startsAt + 24 * 3_600_000 : r.startsAt + GRACE_AFTER_START_MS;
        return now >= r.startsAt - lead && now < end;
      })
      .sort((a, b) => a.startsAt - b.startsAt);
  });

  constructor() {
    const timer = setInterval(() => this.now.set(Date.now()), CHECK_EVERY_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
    effect(() => saveState(this.state()));
  }

  dismiss(key: string): void {
    this.state.update((s) => ({ ...s, dismissed: { ...s.dismissed, [key]: true } }));
  }

  dismissAll(): void {
    for (const r of this.due()) this.dismiss(r.occurrence.key);
  }

  snooze(key: string, minutes: number): void {
    this.state.update((s) => ({ ...s, snoozed: { ...s.snoozed, [key]: Date.now() + minutes * 60_000 } }));
  }
}

function toReminder(occurrence: Occurrence): Reminder {
  const day = fromKey(occurrence.date);
  const time = occurrence.event.time;
  if (!time) return { occurrence, startsAt: day.getTime(), allDay: true };
  const [h, m] = time.split(':').map(Number);
  day.setHours(h, m, 0, 0);
  return { occurrence, startsAt: day.getTime(), allDay: false };
}

function readState(): ReminderState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    const state: ReminderState = raw ? JSON.parse(raw) : { dismissed: {}, snoozed: {} };
    // Se descartan los avisos de días anteriores para que el registro no crezca sin fin.
    const yesterday = toKey(new Date(Date.now() - 86_400_000));
    const recent = ([key]: [string, unknown]) => key.slice(-10) >= yesterday;
    return {
      dismissed: Object.fromEntries(Object.entries(state.dismissed ?? {}).filter(recent)) as Record<string, true>,
      snoozed: Object.fromEntries(Object.entries(state.snoozed ?? {}).filter(recent)),
    };
  } catch {
    return { dismissed: {}, snoozed: {} };
  }
}

function saveState(state: ReminderState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // Sin almacenamiento, los avisos vistos vuelven a salir al recargar.
  }
}
