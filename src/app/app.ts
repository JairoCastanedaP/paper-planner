import { Component, computed, inject, signal } from '@angular/core';
import { MONTHS, monthGrid, monthKeyOf, todayKey } from './core/dates';
import { Occurrence } from './core/models';
import { PlannerStore } from './core/planner-store';
import { DayPanel } from './features/day-panel/day-panel';
import { MonthGoals } from './features/month-goals/month-goals';
import { HighlightChange, MonthGrid } from './features/month-grid/month-grid';

@Component({
  selector: 'app-root',
  imports: [MonthGrid, MonthGoals, DayPanel],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '(document:keydown.arrowleft)': 'onArrow($event, -1)',
    '(document:keydown.arrowright)': 'onArrow($event, 1)',
  },
})
export class App {
  private readonly store = inject(PlannerStore);

  protected readonly today = signal(todayKey());
  protected readonly year = signal(new Date().getFullYear());
  protected readonly month = signal(new Date().getMonth());
  protected readonly selectedDate = signal<string | null>(null);

  protected readonly monthKey = computed(() => monthKeyOf(this.year(), this.month()));
  protected readonly monthName = computed(() => MONTHS[this.month()]);
  protected readonly weeks = computed(() => monthGrid(this.year(), this.month()));

  protected readonly occurrencesByDay = computed(() => {
    const map = new Map<string, Occurrence[]>();
    for (const week of this.weeks()) {
      for (const day of week) map.set(day, this.store.occurrencesOn(day));
    }
    return map;
  });

  /** Solo los días del mes visible (sin los vecinos), para metas y totales. */
  protected readonly monthOccurrences = computed(() =>
    [...this.occurrencesByDay()]
      .filter(([day]) => day.startsWith(this.monthKey()))
      .flatMap(([, occurrences]) => occurrences),
  );

  protected move(delta: number): void {
    const d = new Date(this.year(), this.month() + delta, 1);
    this.year.set(d.getFullYear());
    this.month.set(d.getMonth());
  }

  protected goToday(): void {
    const now = new Date();
    this.today.set(todayKey());
    this.year.set(now.getFullYear());
    this.month.set(now.getMonth());
  }

  protected onHighlight(change: HighlightChange): void {
    this.store.setHighlighted(change.key, change.on);
  }

  protected onArrow(e: Event, delta: number): void {
    const target = e.target as HTMLElement | null;
    const typing = target?.closest('input, textarea, select, [contenteditable]');
    if (!typing && !this.selectedDate()) this.move(delta);
  }
}
