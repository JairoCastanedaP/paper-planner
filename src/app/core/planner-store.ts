import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { newId } from './ids';
import { Category, MonthGoal, Occurrence, PlannerData, PlannerEvent } from './models';
import { PlannerStorage } from './planner-storage';
import { ThemeService } from './themes';
import { compareOccurrences, occurrenceKey, occursOn } from './recurrence';
import { createSeedData } from './seed-data';

/** Última eliminación, para poder deshacerla desde el aviso. */
export interface UndoEntry {
  id: number;
  message: string;
  previous: PlannerData;
}

/** Estado único de la app. Cada cambio se guarda automáticamente. */
@Injectable({ providedIn: 'root' })
export class PlannerStore {
  private readonly storage = inject(PlannerStorage);
  private readonly theme = inject(ThemeService);
  private readonly state = signal<PlannerData>(this.storage.load() ?? createSeedData());
  private undoSeq = 0;

  /** Disponible solo hasta el siguiente cambio: deshacer restaura el estado anterior completo. */
  readonly undo = signal<UndoEntry | null>(null);

  /**
   * Categorías con su color final: el del tema elegido, salvo que el usuario
   * haya escogido uno propio (`customColor`) o que el tema no la conozca.
   */
  readonly categories = computed(() => {
    const colors = this.theme.theme().categoryColors;
    return this.state().categories.map((c) => ({
      ...c,
      color: c.customColor ? c.color : (colors[c.id] ?? c.color),
    }));
  });
  readonly categoryMap = computed(() => new Map(this.categories().map((c) => [c.id, c])));
  readonly events = computed(() => this.state().events);
  readonly goals = computed(() => this.state().goals);

  constructor() {
    effect(() => this.storage.save(this.state()));
  }

  /** Aplica un cambio. Con `undoMessage` se puede deshacer; cualquier otro cambio cierra esa opción. */
  private commit(change: (s: PlannerData) => PlannerData, undoMessage?: string): void {
    const previous = this.state();
    const next = change(previous);
    if (next === previous) return;
    this.state.set(next);
    this.undo.set(undoMessage ? { id: ++this.undoSeq, message: undoMessage, previous } : null);
  }

  undoLast(): void {
    const entry = this.undo();
    if (!entry) return;
    this.state.set(entry.previous);
    this.undo.set(null);
  }

  dismissUndo(id: number): void {
    if (this.undo()?.id === id) this.undo.set(null);
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

  isHighlighted(key: string): boolean {
    return !!this.state().highlights[key];
  }

  // ── Actividades ──────────────────────────────────────────

  saveEvent(ev: PlannerEvent): void {
    this.commit((s) => ({ ...s, events: upsert(s.events, ev) }));
  }

  /** Elimina la actividad completa (todas sus repeticiones). */
  deleteEvent(id: string): void {
    const title = this.events().find((e) => e.id === id)?.title ?? 'Actividad';
    this.commit(
      (s) => ({
        ...s,
        events: s.events.filter((e) => e.id !== id),
        highlights: withoutKeys(s.highlights, (key) => key.startsWith(`${id}@`)),
      }),
      `Se eliminó "${title}"`,
    );
  }

  /** Quita solo un día de una actividad que se repite. */
  skipOccurrence(id: string, date: string): void {
    const title = this.events().find((e) => e.id === id)?.title ?? 'Actividad';
    const key = occurrenceKey(id, date);
    this.commit(
      (s) => ({
        ...s,
        events: s.events.map((e) =>
          e.id === id ? { ...e, exceptions: [...(e.exceptions ?? []), date] } : e,
        ),
        highlights: withoutKeys(s.highlights, (k) => k === key),
      }),
      `Se quitó "${title}" de ese día`,
    );
  }

  // ── Marcador ─────────────────────────────────────────────

  setHighlighted(key: string, on: boolean): void {
    this.commit((s) => {
      if (!!s.highlights[key] === on) return s;
      const highlights = { ...s.highlights };
      if (on) highlights[key] = true;
      else delete highlights[key];
      return { ...s, highlights };
    });
  }

  // ── Objetivos del mes ────────────────────────────────────

  saveGoal(goal: MonthGoal): void {
    this.commit((s) => ({ ...s, goals: upsert(s.goals, goal) }));
  }

  deleteGoal(id: string): void {
    const title = this.goals().find((g) => g.id === id)?.title ?? 'Objetivo';
    this.commit((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }), `Se eliminó "${title}"`);
  }

  copyGoals(fromMonth: string, toMonth: string): void {
    const copies = this.goals()
      .filter((g) => g.month === fromMonth)
      .map((g) => ({ ...g, id: newId(), month: toMonth, done: false }));
    this.commit((s) => ({ ...s, goals: [...s.goals, ...copies] }));
  }

  // ── Categorías ───────────────────────────────────────────

  /** Guarda la categoría tal como la definió el usuario (sin el color del tema). */
  saveCategory(category: Category): void {
    this.commit((s) => ({ ...s, categories: upsert(s.categories, category) }));
  }

  /** Cuántas actividades y objetivos usan la categoría. */
  usageOf(categoryId: string): { events: number; goals: number } {
    return {
      events: this.events().filter((e) => e.categoryId === categoryId).length,
      goals: this.goals().filter((g) => g.categoryId === categoryId).length,
    };
  }

  /** Elimina la categoría; sus actividades y objetivos pasan a `moveTo`. */
  deleteCategory(id: string, moveTo: string): void {
    const name = this.state().categories.find((c) => c.id === id)?.name ?? 'Categoría';
    this.commit(
      (s) => ({
        ...s,
        categories: s.categories.filter((c) => c.id !== id),
        events: s.events.map((e) => (e.categoryId === id ? { ...e, categoryId: moveTo } : e)),
        goals: s.goals.map((g) => (g.categoryId === id ? { ...g, categoryId: moveTo } : g)),
      }),
      `Se eliminó la categoría "${name}"`,
    );
  }

  /** La categoría tal como está guardada (color propio, no el del tema). */
  rawCategory(id: string): Category | undefined {
    return this.state().categories.find((c) => c.id === id);
  }
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id)
    ? list.map((x) => (x.id === item.id ? item : x))
    : [...list, item];
}

function withoutKeys(map: Record<string, true>, drop: (key: string) => boolean): Record<string, true> {
  return Object.fromEntries(Object.entries(map).filter(([key]) => !drop(key))) as Record<string, true>;
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
