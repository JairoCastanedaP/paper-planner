import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { newId } from './ids';
import { MonthGoal, Occurrence, PlannerData, PlannerEvent } from './models';
import { PlannerStorage } from './planner-storage';
import { ThemeService } from './themes';
import { compareOccurrences, occurrenceKey, occursOn } from './recurrence';
import { createSeedData } from './seed-data';

/** Estado único de la app. Cada cambio se guarda automáticamente. */
@Injectable({ providedIn: 'root' })
export class PlannerStore {
  private readonly storage = inject(PlannerStorage);
  private readonly theme = inject(ThemeService);
  private readonly state = signal<PlannerData>(this.storage.load() ?? createSeedData());

  /** Categorías con el color del tema elegido (si el tema define uno). */
  readonly categories = computed(() => {
    const colors = this.theme.theme().categoryColors;
    return this.state().categories.map((c) => ({ ...c, color: colors[c.id] ?? c.color }));
  });
  readonly categoryMap = computed(() => new Map(this.categories().map((c) => [c.id, c])));
  readonly events = computed(() => this.state().events);
  readonly goals = computed(() => this.state().goals);

  constructor() {
    effect(() => this.storage.save(this.state()));
  }

  occurrencesOn(date: string): Occurrence[] {
    const highlights = this.state().highlights;
    return this.events()
      .filter((ev) => occursOn(ev, date))
      .map((event) => {
        const key = occurrenceKey(event.id, date);
        return { event, date, key, highlighted: !!highlights[key] };
      })
      .sort(compareOccurrences);
  }

  // ── Actividades ──────────────────────────────────────────

  saveEvent(ev: PlannerEvent): void {
    this.state.update((s) => {
      const exists = s.events.some((e) => e.id === ev.id);
      return {
        ...s,
        events: exists ? s.events.map((e) => (e.id === ev.id ? ev : e)) : [...s.events, ev],
      };
    });
  }

  /** Elimina la actividad completa (todas sus repeticiones). */
  deleteEvent(id: string): void {
    this.state.update((s) => ({
      ...s,
      events: s.events.filter((e) => e.id !== id),
      highlights: Object.fromEntries(
        Object.entries(s.highlights).filter(([key]) => !key.startsWith(`${id}@`)),
      ) as Record<string, true>,
    }));
  }

  /** Quita solo un día de una actividad que se repite. */
  skipOccurrence(id: string, date: string): void {
    this.state.update((s) => ({
      ...s,
      events: s.events.map((e) =>
        e.id === id ? { ...e, exceptions: [...(e.exceptions ?? []), date] } : e,
      ),
    }));
    this.setHighlighted(occurrenceKey(id, date), false);
  }

  // ── Marcador ─────────────────────────────────────────────

  setHighlighted(key: string, on: boolean): void {
    this.state.update((s) => {
      if (!!s.highlights[key] === on) return s;
      const highlights = { ...s.highlights };
      if (on) highlights[key] = true;
      else delete highlights[key];
      return { ...s, highlights };
    });
  }

  // ── Objetivos del mes ────────────────────────────────────

  saveGoal(goal: MonthGoal): void {
    this.state.update((s) => {
      const exists = s.goals.some((g) => g.id === goal.id);
      return {
        ...s,
        goals: exists ? s.goals.map((g) => (g.id === goal.id ? goal : g)) : [...s.goals, goal],
      };
    });
  }

  deleteGoal(id: string): void {
    this.state.update((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));
  }

  copyGoals(fromMonth: string, toMonth: string): void {
    const copies = this.goals()
      .filter((g) => g.month === fromMonth)
      .map((g) => ({ ...g, id: newId(), month: toMonth, done: false }));
    this.state.update((s) => ({ ...s, goals: [...s.goals, ...copies] }));
  }
}

/** Cuántas actividades resaltadas del mes cuentan para el objetivo. */
export function goalProgress(goal: MonthGoal, monthOccurrences: Occurrence[]): number {
  const match = goal.match?.trim().toLowerCase();
  return monthOccurrences.filter(
    (o) =>
      o.highlighted &&
      (!goal.categoryId || o.event.categoryId === goal.categoryId) &&
      (!match || o.event.title.toLowerCase().includes(match)),
  ).length;
}
