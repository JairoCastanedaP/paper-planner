import { Component, inject } from '@angular/core';
import { formatLong, formatTime, todayKey } from '../../core/dates';
import { PlannerStore } from '../../core/planner-store';
import { Reminder, ReminderService } from '../../core/reminders';
import { tx } from '../../core/i18n';

/** Ventana de aviso para las actividades "muy importantes" que se acercan. */
@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.html',
  styleUrl: './reminder-modal.scss',
})
export class ReminderModal {
  protected readonly tx = tx;
  protected readonly reminders = inject(ReminderService);
  private readonly store = inject(PlannerStore);

  protected color(r: Reminder): string {
    return this.store.categoryMap().get(r.occurrence.event.categoryId)?.color ?? 'var(--red)';
  }

  protected when(r: Reminder): string {
    const { date, event } = r.occurrence;
    const day = date === todayKey() ? tx('Hoy', 'Today') : formatLong(date).replace(/(,| de) \d{4}$/, '');
    if (r.allDay) return `${day} · ${tx('todo el día', 'all day')}`;
    const minutes = Math.round((r.startsAt - Date.now()) / 60_000);
    const relative =
      minutes > 0
        ? `${tx('en', 'in')} ${minutes < 60 ? `${minutes} min` : `${Math.round(minutes / 60)} h`}`
        : tx('ya empezó', 'already started');
    return `${day} · ${formatTime(event.time)} (${relative})`;
  }
}
