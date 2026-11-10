import { Component, computed, inject, input, signal } from '@angular/core';
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
}

const emptyDraft = (): GoalDraft => ({ title: '', target: null, categoryId: '', match: '' });

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

  protected readonly adding = signal(false);
  protected draft: GoalDraft = emptyDraft();

  protected progress(goal: MonthGoal): number {
    return goalProgress(goal, this.occurrences());
  }

  protected percent(goal: MonthGoal): number {
    return goal.target ? Math.min(100, (this.progress(goal) / goal.target) * 100) : 0;
  }

  protected goalColor(goal: MonthGoal): string | null {
    return goal.categoryId ? (this.store.categoryMap().get(goal.categoryId)?.color ?? null) : null;
  }

  protected toggleDone(goal: MonthGoal): void {
    this.store.saveGoal({ ...goal, done: !goal.done });
  }

  protected remove(goal: MonthGoal): void {
    if (confirm(`¿Eliminar el objetivo "${goal.title}"?`)) this.store.deleteGoal(goal.id);
  }

  protected copyPrevious(): void {
    this.store.copyGoals(this.previousMonth(), this.month());
  }

  protected startAdding(): void {
    this.draft = emptyDraft();
    this.adding.set(true);
  }

  protected saveDraft(): void {
    const title = this.draft.title.trim();
    if (!title) return;
    const target = this.draft.target && this.draft.target > 0 ? this.draft.target : undefined;
    this.store.saveGoal({
      id: newId(),
      month: this.month(),
      title,
      target,
      categoryId: target ? this.draft.categoryId || undefined : undefined,
      match: target ? this.draft.match.trim() || undefined : undefined,
      done: false,
    });
    this.adding.set(false);
  }
}
