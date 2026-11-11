import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { AuthService } from './auth';
import { newId } from './ids';
import { createEmptyData } from './categories';
import { Commemoration, builtInCommemorationsOn } from './commemorations';
import { Category, MonthGoal, Occurrence, PlannerData, PlannerEvent, SpecialDay } from './models';
import { CloudPlannerStorage, LocalPlannerStorage } from './planner-storage';
import { createDemoData } from './demo-data';
import { ThemeService } from './themes';
import { compareOccurrences, occurrenceKey, occursOn } from './recurrence';
import { createSeedData } from './seed-data';

/** Última eliminación, para poder deshacerla desde el aviso. */
export interface UndoEntry {
  id: number;
  message: string;
  previous: PlannerData;
}

/** Espera antes de subir los cambios: agrupa varios seguidos (p. ej. un trazo del marcador). */
const SAVE_DELAY = 500;

/**
 * Estado único de la app. Cada cambio se guarda automáticamente:
 * con cuenta, en Firestore (sincronizado entre dispositivos); en modo invitado, en el navegador.
 */
@Injectable({ providedIn: 'root' })
export class PlannerStore {
  private readonly auth = inject(AuthService);
  private readonly local = inject(LocalPlannerStorage);
  private readonly cloud = inject(CloudPlannerStorage);
  private readonly theme = inject(ThemeService);
  private readonly state = signal<PlannerData>(createEmptyData());
  private undoSeq = 0;

  /** Cuenta cuyos datos se muestran: uid, 'guest' (invitado) o null (sin sesión o sin verificar el correo). */
  private readonly owner = computed(() => {
    const user = this.auth.user();
    if (!user || !user.verified) return null;
    return user.guest ? 'guest' : user.uid;
  });
  /** uid de la cuenta en la nube (null en modo invitado). */
  private uid: string | null = null;
  /** Lo último que se guardó en la nube (para subir solo las imágenes que cambiaron). */
  private saved: PlannerData | null = null;
  private pendingSave: ReturnType<typeof setTimeout> | undefined;
  private inFlight = 0;
  private stopWatching: (() => void) | undefined;

  /** true mientras llegan los datos de la cuenta. */
  readonly loading = signal(true);
  /** true si no se pudieron leer los datos de la cuenta. */
  readonly loadFailed = signal(false);
  /** Calendario guardado en este navegador que se puede subir a la cuenta nueva. */
  readonly importable = signal<PlannerData | null>(null);

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
  /** Se están viendo los datos de ejemplo. */
  readonly isDemo = computed(() => !!this.state().demo);

  /** true si el último guardado falló. */
  readonly saveFailed = signal(false);

  constructor() {
    effect(() => {
      const owner = this.owner();
      untracked(() => this.open(owner));
    });
  }

  /** Carga los datos de quien inició sesión (y deja de escuchar los de la cuenta anterior). */
  private open(owner: string | null): void {
    this.stopWatching?.();
    this.stopWatching = undefined;
    clearTimeout(this.pendingSave);
    this.pendingSave = undefined;
    this.uid = null;
    this.saved = null;
    this.undo.set(null);
    this.importable.set(null);
    this.saveFailed.set(false);
    this.loadFailed.set(false);

    if (owner === null) {
      this.loading.set(true);
      return;
    }
    if (owner === 'guest') {
      this.state.set(initialData(this.local.load()));
      this.loading.set(false);
      return;
    }

    this.uid = owner;
    this.loading.set(true);
    this.stopWatching = this.cloud.watch(
      owner,
      (data) => {
        // Mientras haya cambios propios sin confirmar, manda lo que hay en pantalla.
        if (this.uid !== owner || this.pendingSave !== undefined || this.inFlight > 0) return;
        if (data) {
          this.saved = data;
          this.state.set(data);
          this.importable.set(null);
        } else if (this.loading()) {
          // Cuenta nueva: datos de ejemplo (no se guardan hasta el primer cambio).
          this.state.set(createDemoData());
          this.importable.set(browserCalendar(this.local.load()));
        }
        this.loading.set(false);
      },
      (error) => {
        console.error(error);
        this.loadFailed.set(true);
        this.loading.set(false);
      },
    );
  }

  private persist(): void {
    if (this.uid === null) {
      this.saveFailed.set(!this.local.save(this.state()));
      return;
    }
    clearTimeout(this.pendingSave);
    this.pendingSave = setTimeout(() => this.saveNow(), SAVE_DELAY);
  }

  private saveNow(): Promise<void> {
    clearTimeout(this.pendingSave);
    this.pendingSave = undefined;
    const uid = this.uid;
    if (uid === null) return Promise.resolve();
    const data = this.state();
    const previous = this.saved;
    this.saved = data;
    this.inFlight++;
    return this.cloud
      .save(uid, data, previous)
      .then(
        () => this.saveFailed.set(false),
        (error) => {
          console.error(error);
          this.saved = previous;
          this.saveFailed.set(true);
        },
      )
      .finally(() => this.inFlight--);
  }

  /** Sube ya los cambios pendientes (antes de cerrar sesión). Sin internet no espera más de 3 s. */
  async flush(): Promise<void> {
    if (this.pendingSave === undefined) return;
    await Promise.race([this.saveNow(), new Promise((r) => setTimeout(r, 3000))]);
  }

  /** Sube a la cuenta el calendario que había en este navegador. */
  importBrowserCalendar(): void {
    const data = this.importable();
    if (!data) return;
    this.importable.set(null);
    this.commit(() => ({ ...data, demo: false }), 'Se subió el calendario de este navegador');
  }

  dismissImport(): void {
    this.importable.set(null);
  }

  /** Aplica un cambio. Con `undoMessage` se puede deshacer; cualquier otro cambio cierra esa opción. */
  private commit(change: (s: PlannerData) => PlannerData, undoMessage?: string): void {
    const previous = this.state();
    const next = change(previous);
    if (next === previous) return;
    this.state.set(next);
    this.undo.set(undoMessage ? { id: ++this.undoSeq, message: undoMessage, previous } : null);
    this.persist();
  }

  /** Borra los datos de ejemplo y deja el calendario en blanco (se puede deshacer). */
  clearDemo(): void {
    // demo: false = el usuario eligió empezar en blanco (no se vuelven a cargar los ejemplos).
    this.commit(() => ({ ...createEmptyData(), demo: false }), 'Se borraron los datos de ejemplo');
  }

  /** Conserva los datos de ejemplo como propios y oculta el aviso. */
  keepDemo(): void {
    this.commit((s) => ({ ...s, demo: false }));
  }

  undoLast(): void {
    const entry = this.undo();
    if (!entry) return;
    this.state.set(entry.previous);
    this.undo.set(null);
    this.persist();
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

  // ── Personalización de días ──────────────────────────────

  dayImage(date: string): string | undefined {
    return this.state().dayImages?.[date];
  }

  setDayImage(date: string, image: string | null): void {
    this.commit(
      (s) => {
        const dayImages = { ...(s.dayImages ?? {}) };
        if (image) dayImages[date] = image;
        else delete dayImages[date];
        return { ...s, dayImages };
      },
      image ? undefined : 'Se quitó la imagen de fondo',
    );
  }

  /** Días especiales propios que aplican a esa fecha (exacta o cada año). */
  customSpecialDaysOn(date: string): SpecialDay[] {
    return (this.state().specialDays ?? []).filter((d) =>
      d.yearly ? d.date.slice(5) === date.slice(5) && date >= d.date : d.date === date,
    );
  }

  /** Lo que se conmemora ese día: fechas incluidas en la app y días especiales propios. */
  commemorationsOn(date: string): Commemoration[] {
    const custom = this.customSpecialDaysOn(date).map(({ id, emoji, name }) => ({ id, emoji, name }));
    return [...builtInCommemorationsOn(date), ...custom];
  }

  saveSpecialDay(day: SpecialDay): void {
    this.commit((s) => ({ ...s, specialDays: upsert(s.specialDays ?? [], day) }));
  }

  deleteSpecialDay(id: string): void {
    const name = this.state().specialDays?.find((d) => d.id === id)?.name ?? 'Día especial';
    this.commit(
      (s) => ({ ...s, specialDays: (s.specialDays ?? []).filter((d) => d.id !== id) }),
      `Se eliminó "${name}"`,
    );
  }

  /** La categoría tal como está guardada (color propio, no el del tema). */
  rawCategory(id: string): Category | undefined {
    return this.state().categories.find((c) => c.id === id);
  }
}

/**
 * Datos con los que arranca la app. Un calendario vacío que nadie tocó (lo guardaban
 * las versiones anteriores a los datos de ejemplo) se reemplaza por los datos de ejemplo.
 */
function initialData(stored: PlannerData | null): PlannerData {
  if (!stored) return createSeedData();
  const untouched =
    stored.demo === undefined &&
    stored.events.length === 0 &&
    stored.goals.length === 0 &&
    !stored.specialDays?.length &&
    !Object.keys(stored.dayImages ?? {}).length;
  return untouched ? createSeedData() : stored;
}

/**
 * El calendario guardado en el navegador, si tiene datos propios (no los de ejemplo).
 * En `npm run start:local` incluye los datos personales de `seed-data.local.ts`.
 */
function browserCalendar(stored: PlannerData | null): PlannerData | null {
  const data = initialData(stored);
  const hasContent =
    data.events.length > 0 ||
    data.goals.length > 0 ||
    !!data.specialDays?.length ||
    Object.keys(data.dayImages ?? {}).length > 0;
  return !data.demo && hasContent ? data : null;
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
