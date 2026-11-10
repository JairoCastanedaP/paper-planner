import { Component, ElementRef, computed, inject, input, output, signal } from '@angular/core';
import { formatTime } from '../../core/dates';
import { Occurrence } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';

/** Distancia mínima (px) para que un toque se considere trazo de marcador. */
const DRAG_THRESHOLD = 10;
/** Fracción del ancho que hay que recorrer para completar el trazo. */
const STROKE_LENGTH = 0.6;

/**
 * Una actividad dentro del calendario. Pasar el dedo, el lápiz o el mouse
 * de lado a lado la resalta con el color de su categoría; repetir el trazo
 * sobre una ya resaltada la borra. Un toque normal abre el día.
 */
@Component({
  selector: 'app-event-chip',
  templateUrl: './event-chip.html',
  styleUrl: './event-chip.scss',
  host: {
    '[class.highlighted]': 'occurrence().highlighted',
    '[class.large]': 'size() === "large"',
    '[style.--cat]': 'color()',
    '[attr.title]': 'tooltip()',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp()',
    '(pointercancel)': 'reset()',
    '(click)': 'onClick($event)',
  },
})
export class EventChip {
  readonly occurrence = input.required<Occurrence>();
  readonly size = input<'small' | 'large'>('small');
  readonly highlightChange = output<boolean>();

  private readonly store = inject(PlannerStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly category = computed(() =>
    this.store.categoryMap().get(this.occurrence().event.categoryId),
  );
  protected readonly color = computed(() => this.category()?.color ?? '#bbb');
  protected readonly time = computed(() => formatTime(this.occurrence().event.time));
  protected readonly amount = computed(() => {
    const { amount, currency } = this.occurrence().event;
    return amount ? `${amount.toLocaleString('es-CO')} ${currency ?? ''}`.trim() : '';
  });
  protected readonly tooltip = computed(() =>
    [this.time(), this.occurrence().event.title, this.amount()].filter(Boolean).join(' · '),
  );

  /** Fracción pintada mientras se arrastra (null = sin trazo en curso). */
  private readonly preview = signal<number | null>(null);
  protected readonly painting = computed(() => this.preview() !== null);
  protected readonly paint = computed(
    () => this.preview() ?? (this.occurrence().highlighted ? 1 : 0),
  );

  private startX: number | null = null;
  private dragging = false;
  private suppressClick = false;

  protected onPointerDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.startX = e.clientX;
    this.dragging = false;
  }

  protected onPointerMove(e: PointerEvent): void {
    if (this.startX === null) return;
    const dx = Math.abs(e.clientX - this.startX);
    if (!this.dragging) {
      if (dx < DRAG_THRESHOLD) return;
      this.dragging = true;
      try {
        this.host.nativeElement.setPointerCapture(e.pointerId);
      } catch {
        // El puntero ya se soltó; no pasa nada.
      }
    }
    const width = this.host.nativeElement.getBoundingClientRect().width || 1;
    const progress = Math.min(1, dx / (width * STROKE_LENGTH));
    this.preview.set(this.occurrence().highlighted ? 1 - progress : progress);
  }

  protected onPointerUp(): void {
    if (this.startX === null) return;
    if (this.dragging) {
      const highlighted = (this.preview() ?? 0) >= 0.5;
      if (highlighted !== this.occurrence().highlighted) this.highlightChange.emit(highlighted);
      // El navegador puede disparar un click al soltar: no debe abrir el día.
      // Si no lo dispara (puntero capturado), el bloqueo se libera solo.
      this.suppressClick = true;
      setTimeout(() => (this.suppressClick = false), 250);
    }
    this.reset();
  }

  protected onClick(e: MouseEvent): void {
    if (this.suppressClick) {
      e.stopPropagation();
      this.suppressClick = false;
    }
  }

  protected reset(): void {
    this.startX = null;
    this.dragging = false;
    this.preview.set(null);
  }
}
