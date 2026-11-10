import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { newId } from '../../core/ids';
import { compressImage } from '../../core/images';
import { Occurrence, PlannerEvent } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';
import { describeRecurrence } from '../../core/recurrence';
import { EventChip } from '../event-chip/event-chip';
import { EventForm } from '../event-form/event-form';

type Mode = { kind: 'list' } | { kind: 'new' } | { kind: 'edit'; event: PlannerEvent };

/** Emojis sugeridos para días especiales propios. */
const EMOJI_SUGGESTIONS = ['🎉', '🎂', '💍', '🎓', '✈️', '🏆', '❤️', '🌟', '🕯️', '🎃', '🎄', '🙏'];

/** Contenido de un día: actividades, formulario y personalización (fondo y día especial). */
@Component({
  selector: 'app-day-detail',
  imports: [EventChip, EventForm, FormsModule],
  templateUrl: './day-detail.html',
  styleUrl: './day-detail.scss',
})
export class DayDetail {
  readonly date = input.required<string>();

  private readonly store = inject(PlannerStore);

  protected readonly occurrences = computed(() => this.store.occurrencesOn(this.date()));
  protected readonly image = computed(() => this.store.dayImage(this.date()));
  protected readonly specialDays = computed(() => this.store.customSpecialDaysOn(this.date()));
  protected readonly mode = signal<Mode>({ kind: 'list' });
  /** Ocurrencia cuyo borrado espera confirmación (series repetidas). */
  protected readonly confirmingDelete = signal<string | null>(null);
  protected readonly imageError = signal('');
  protected readonly loadingImage = signal(false);

  protected readonly describe = describeRecurrence;
  protected readonly emojiSuggestions = EMOJI_SUGGESTIONS;
  protected special = { emoji: '🎉', name: '', yearly: true };

  protected setHighlight(o: Occurrence, on: boolean): void {
    this.store.setHighlighted(o.key, on);
  }

  protected save(ev: PlannerEvent): void {
    this.store.saveEvent(ev);
    this.mode.set({ kind: 'list' });
  }

  protected askDelete(o: Occurrence): void {
    if (o.event.recurrence.type === 'none') {
      // Sin confirmación: el aviso inferior permite deshacer.
      this.store.deleteEvent(o.event.id);
    } else {
      this.confirmingDelete.set(o.key);
    }
  }

  protected deleteOne(o: Occurrence): void {
    this.store.skipOccurrence(o.event.id, o.date);
    this.confirmingDelete.set(null);
  }

  protected deleteSeries(o: Occurrence): void {
    this.store.deleteEvent(o.event.id);
    this.confirmingDelete.set(null);
  }

  // ── Imagen de fondo ──────────────────────────────────────

  protected async onImageSelected(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.imageError.set('');
    this.loadingImage.set(true);
    try {
      this.store.setDayImage(this.date(), await compressImage(file));
    } catch (err) {
      this.imageError.set(err instanceof Error ? err.message : 'No se pudo usar la imagen.');
    } finally {
      this.loadingImage.set(false);
    }
  }

  protected removeImage(): void {
    this.store.setDayImage(this.date(), null);
  }

  // ── Día especial propio ──────────────────────────────────

  protected addSpecialDay(): void {
    const name = this.special.name.trim();
    if (!name) return;
    this.store.saveSpecialDay({
      id: newId(),
      date: this.date(),
      emoji: this.special.emoji || '🎉',
      name,
      yearly: this.special.yearly,
    });
    this.special = { emoji: '🎉', name: '', yearly: true };
  }

  protected removeSpecialDay(id: string): void {
    this.store.deleteSpecialDay(id);
  }
}
