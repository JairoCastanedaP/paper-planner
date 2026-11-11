import { Component, computed, inject, input, output } from '@angular/core';
import { Commemoration } from '../../core/commemorations';
import { WEEKDAYS } from '../../core/dates';
import { holidayOn } from '../../core/holidays';
import { Occurrence } from '../../core/models';
import { MoonPhase, moonPhasesBetween } from '../../core/moon';
import { PlannerStore } from '../../core/planner-store';
import { PreferencesService } from '../../core/preferences';
import { EventChip } from '../event-chip/event-chip';

export interface HighlightChange {
  key: string;
  on: boolean;
}

@Component({
  selector: 'app-month-grid',
  imports: [EventChip],
  templateUrl: './month-grid.html',
  styleUrl: './month-grid.scss',
})
export class MonthGrid {
  readonly weeks = input.required<string[][]>();
  readonly month = input.required<string>();
  readonly today = input.required<string>();
  readonly occurrencesByDay = input.required<Map<string, Occurrence[]>>();

  readonly daySelected = output<string>();
  readonly highlightChange = output<HighlightChange>();

  protected readonly store = inject(PlannerStore);
  protected readonly weekdays = WEEKDAYS;
  protected readonly holidayOn = holidayOn;
  protected readonly maxVisible = 4;
  private readonly prefs = inject(PreferencesService);

  /** Fases de la luna de las semanas visibles (solo si están activadas en el menú). */
  protected readonly moons = computed(() => {
    if (!this.prefs.showMoon()) return null;
    const weeks = this.weeks();
    const last = weeks.at(-1);
    return weeks.length && last ? moonPhasesBetween(weeks[0][0], last[last.length - 1]) : null;
  });

  protected moonLabel(phase: MoonPhase): string {
    return `${phase.name} · ${phase.at.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}`;
  }

  protected dayNumber(date: string): number {
    return Number(date.slice(8));
  }

  protected namesOf(list: Commemoration[]): string {
    return list.map((c) => `${c.emoji} ${c.name}`).join(' · ');
  }

  protected inMonth(date: string): boolean {
    return date.startsWith(this.month());
  }
}
