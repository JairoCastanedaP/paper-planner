import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';
import { MONTHS, monthGrid, monthKeyOf, todayKey } from '../../core/dates';
import { Occurrence } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';
import { ReminderService } from '../../core/reminders';
import { DayPanel } from '../day-panel/day-panel';
import { MonthGoals } from '../month-goals/month-goals';
import { HighlightChange, MonthGrid } from '../month-grid/month-grid';
import { ReminderModal } from '../reminder-modal/reminder-modal';
import { ThemePicker } from '../theme-picker/theme-picker';
import { YearView } from '../year-view/year-view';

type View = 'month' | 'year';

@Component({
  selector: 'app-calendar-page',
  imports: [MonthGrid, MonthGoals, DayPanel, YearView, ThemePicker, ReminderModal],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.scss',
  host: {
    '(document:keydown.arrowleft)': 'onArrow($event, -1)',
    '(document:keydown.arrowright)': 'onArrow($event, 1)',
  },
})
export class CalendarPage {
  private readonly store = inject(PlannerStore);
  private readonly router = inject(Router);
  private readonly reminders = inject(ReminderService);
  protected readonly auth = inject(AuthService);

  protected readonly view = signal<View>('month');
  protected readonly today = signal(todayKey());
  protected readonly year = signal(new Date().getFullYear());
  protected readonly month = signal(new Date().getMonth());
  protected readonly selectedDate = signal<string | null>(null);
  protected readonly themesOpen = signal(false);

  protected readonly monthKey = computed(() => monthKeyOf(this.year(), this.month()));
  protected readonly title = computed(() =>
    this.view() === 'month' ? MONTHS[this.month()] : String(this.year()),
  );
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
    if (this.view() === 'year') {
      this.year.update((y) => y + delta);
      return;
    }
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

  protected openMonth(index: number): void {
    this.month.set(index);
    this.view.set('month');
  }

  protected onHighlight(change: HighlightChange): void {
    this.store.setHighlighted(change.key, change.on);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  protected onArrow(e: Event, delta: number): void {
    const target = e.target as HTMLElement | null;
    const typing = target?.closest('input, textarea, select, [contenteditable]');
    const overlayOpen = this.selectedDate() || this.themesOpen() || this.reminders.due().length;
    if (!typing && !overlayOpen) this.move(delta);
  }
}
