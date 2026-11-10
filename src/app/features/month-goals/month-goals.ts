import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { pad } from '../../core/dates';
import { newId } from '../../core/ids';
import { MonthGoal, Occurrence } from '../../core/models';
import { PlannerStore, goalProgress } from '../../core/planner-store';

interface GoalDraft {
  title: string;
  target: number | null;
  categoryId: string;
  match: string;
  detail: string;
}

/** Qué hace el editor: crear un objetivo nuevo o editar uno existente. */
type Editor = { mode: 'new' } | { mode: 'edit'; id: string };

/** La franja de "NOTAS" del calendario: objetivos, contadores y total de pagos. */
@Component({
  selector: 'app-month-goals',
  imports: [FormsModule],
  templateUrl: './month-goals.html',
  styleUrl: './month-goals.scss',
})
export class MonthGoals {
  readonly month = input.required<string>();
  readonly occurrences = input.required<Occurrence[]>();

  protected readonly store = inject(PlannerStore);
  private readonly injector = inject(Injector);
  private readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput');
  private readonly detailInput = viewChild<ElementRef<HTMLTextAreaElement>>('detailInput');

  protected readonly goals = computed(() =>
    this.store.goals().filter((g) => g.month === this.month()),
  );

  protected readonly previousMonth = computed(() => {
    const [y, m] = this.month().split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  });

  protected readonly canCopyPrevious = computed(
    () =>
      this.goals().length === 0 &&
      this.store.goals().some((g) => g.month === this.previousMonth()),
  );

  /** Total comprometido en el mes, separado por moneda. */
  protected readonly totals = computed(() => {
    const sums = new Map<string, number>();
    for (const o of this.occurrences()) {
      const { amount, currency } = o.event;
      if (!amount) continue;
      const cur = currency ?? 'USD';
      sums.set(cur, (sums.get(cur) ?? 0) + amount);
    }
    return [...sums].map(([cur, total]) => `${total.toLocaleString('es-CO')} ${cur}`);
  });

  protected readonly editor = signal<Editor | null>(null);
  protected readonly editingGoal = computed(() => {
    const e = this.editor();
    return e?.mode === 'edit' ? (this.goals().find((g) => g.id === e.id) ?? null) : null;
  });
  protected draft: GoalDraft = toDraft();

  protected progress(goal: MonthGoal): number {
    return goalProgress(goal, this.occurrences());
  }

  protected percent(goal: MonthGoal): number {
    return goal.target ? Math.min(100, (this.progress(goal) / goal.target) * 100) : 0;
  }

  protected goalColor(goal: MonthGoal): string | null {
    return goal.categoryId ? (this.store.categoryMap().get(goal.categoryId)?.color ?? null) : null;
  }

  protected isEditing(goal: MonthGoal): boolean {
    const e = this.editor();
    return e?.mode === 'edit' && e.id === goal.id;
  }

  protected toggleDone(goal: MonthGoal): void {
    this.store.saveGoal({ ...goal, done: !goal.done });
  }

  /** Clic en el nombre: abre el editor (o lo cierra si ya estaba abierto). */
  protected openEditor(goal: MonthGoal): void {
    if (this.isEditing(goal)) {
      this.editor.set(null);
      return;
    }
    this.draft = toDraft(goal);
    this.editor.set({ mode: 'edit', id: goal.id });
    // Se enfoca el detalle: es lo que más se agrega después de crear el objetivo.
    afterNextRender(() => this.detailInput()?.nativeElement.focus(), { injector: this.injector });
  }

  protected startAdding(): void {
    this.draft = toDraft();
    this.editor.set({ mode: 'new' });
    afterNextRender(() => this.titleInput()?.nativeElement.focus(), { injector: this.injector });
  }

  protected save(): void {
    const d = this.draft;
    const title = d.title.trim();
    if (!title) return;
    const target = d.target && d.target > 0 ? Number(d.target) : undefined;
    const editing = this.editingGoal();
    this.store.saveGoal({
      id: editing?.id ?? newId(),
      month: editing?.month ?? this.month(),
      title,
      target,
      categoryId: target ? d.categoryId || undefined : undefined,
      match: target ? d.match.trim() || undefined : undefined,
      detail: d.detail.trim() || undefined,
      done: editing?.done ?? false,
    });
    this.editor.set(null);
  }

  protected remove(goal: MonthGoal): void {
    // Sin confirmación: el aviso inferior permite deshacer.
    if (this.isEditing(goal)) this.editor.set(null);
    this.store.deleteGoal(goal.id);
  }

  protected copyPrevious(): void {
    this.store.copyGoals(this.previousMonth(), this.month());
  }
}

function toDraft(goal?: MonthGoal): GoalDraft {
  return {
    title: goal?.title ?? '',
    target: goal?.target ?? null,
    categoryId: goal?.categoryId ?? '',
    match: goal?.match ?? '',
    detail: goal?.detail ?? '',
  };
}
