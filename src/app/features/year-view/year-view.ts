import { Component, computed, inject, input, output } from '@angular/core';
import { MONTHS, WEEKDAY_INITIALS, monthGrid, monthKeyOf } from '../../core/dates';
import { holidayOn } from '../../core/holidays';
import { Occurrence } from '../../core/models';
import { PlannerStore, goalProgress } from '../../core/planner-store';

interface MiniDay {
  date: string;
  num: number;
  inMonth: boolean;
  holiday?: string;
  /** Colores de las categorías del día (máximo 3 puntos). */
  dots: string[];
  important: boolean;
}

interface Note {
  icon: string;
  text: string;
  color?: string;
}

interface MonthSummary {
  index: number;
  name: string;
  weeks: MiniDay[][];
  notes: Note[];
  hidden: number;
}

/** Cuántas notas se muestran por mes antes de "+n más". */
const MAX_NOTES = 5;

/** Los 12 meses del año con lo más relevante de cada uno. */
@Component({
  selector: 'app-year-view',
  templateUrl: './year-view.html',
  styleUrl: './year-view.scss',
})
export class YearView {
  readonly year = input.required<number>();
  readonly today = input.required<string>();
  readonly monthOpened = output<number>();
  readonly daySelected = output<string>();

  private readonly store = inject(PlannerStore);
  protected readonly initials = WEEKDAY_INITIALS;

  protected readonly months = computed<MonthSummary[]>(() =>
    MONTHS.map((name, index) => this.summarize(this.year(), index, name)),
  );

  private summarize(year: number, index: number, name: string): MonthSummary {
    const key = monthKeyOf(year, index);
    const colors = this.store.categoryMap();
    const monthOccurrences: Occurrence[] = [];

    const weeks = monthGrid(year, index).map((week) =>
      week.map((date): MiniDay => {
        const inMonth = date.startsWith(key);
        const occurrences = inMonth ? this.store.occurrencesOn(date) : [];
        monthOccurrences.push(...occurrences);
        const dots = [...new Set(occurrences.map((o) => colors.get(o.event.categoryId)?.color ?? '#bbb'))];
        return {
          date,
          num: Number(date.slice(8)),
          inMonth,
          holiday: inMonth ? holidayOn(date) : undefined,
          dots: dots.slice(0, 3),
          important: occurrences.some((o) => o.event.important),
        };
      }),
    );

    const notes: Note[] = [];

    for (const goal of this.store.goals().filter((g) => g.month === key)) {
      const status = goal.target
        ? ` ${goalProgress(goal, monthOccurrences)}/${goal.target}`
        : goal.done
          ? ' ✓'
          : '';
      notes.push({ icon: '🎯', text: goal.title.toUpperCase() + status });
    }

    const day = (o: Occurrence) => Number(o.date.slice(8));
    for (const o of monthOccurrences.filter((o) => o.event.important)) {
      notes.push({ icon: '⭐', text: `${day(o)} · ${o.event.title}`, color: colors.get(o.event.categoryId)?.color });
    }
    for (const o of monthOccurrences.filter((o) => o.event.categoryId === 'birthday')) {
      notes.push({ icon: '👑', text: `${day(o)} · ${o.event.title}` });
    }

    const totals = new Map<string, number>();
    for (const o of monthOccurrences) {
      if (!o.event.amount) continue;
      const cur = o.event.currency ?? 'USD';
      totals.set(cur, (totals.get(cur) ?? 0) + o.event.amount);
    }
    if (totals.size) {
      notes.push({
        icon: '💸',
        text: [...totals].map(([cur, total]) => `${total.toLocaleString('es-CO')} ${cur}`).join(' · '),
      });
    }

    return {
      index,
      name,
      weeks,
      notes: notes.slice(0, MAX_NOTES),
      hidden: Math.max(0, notes.length - MAX_NOTES),
    };
  }

  protected isCurrent(index: number): boolean {
    return this.today().startsWith(monthKeyOf(this.year(), index));
  }
}
