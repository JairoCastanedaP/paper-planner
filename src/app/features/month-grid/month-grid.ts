import { Component, input, output } from '@angular/core';
import { WEEKDAYS } from '../../core/dates';
import { holidayOn } from '../../core/holidays';
import { Occurrence } from '../../core/models';
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

  protected readonly weekdays = WEEKDAYS;
  protected readonly holidayOn = holidayOn;
  protected readonly maxVisible = 4;

  protected dayNumber(date: string): number {
    return Number(date.slice(8));
  }

  protected inMonth(date: string): boolean {
    return date.startsWith(this.month());
  }
}
