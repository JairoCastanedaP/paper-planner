import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { TourService } from '../../core/tour';

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 6;
const CARD_WIDTH = 340;
const GAP = 12;

/** Guía paso a paso: oscurece la pantalla y resalta el elemento que se explica. */
@Component({
  selector: 'app-tour-overlay',
  templateUrl: './tour-overlay.html',
  styleUrl: './tour-overlay.scss',
  host: {
    '(window:resize)': 'measure()',
    '(window:scroll)': 'measure()',
    '(document:keydown.escape)': 'tour.finish()',
  },
})
export class TourOverlay {
  protected readonly tour = inject(TourService);
  protected readonly box = signal<Box | null>(null);
  private readonly viewport = signal({ w: window.innerWidth, h: window.innerHeight });
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly isLast = computed(() => this.tour.index() === this.tour.steps.length - 1);

  /** Dónde va la tarjeta: debajo del elemento si cabe, si no encima; en celular, abajo. */
  protected readonly cardStyle = computed(() => {
    const { w, h } = this.viewport();
    const box = this.box();
    if (w < 640) return { left: '12px', right: '12px', bottom: '12px' };
    if (!box) return { left: `${(w - CARD_WIDTH) / 2}px`, top: `${h * 0.3}px`, width: `${CARD_WIDTH}px` };
    const left = Math.min(Math.max(12, box.left), w - CARD_WIDTH - 12);
    const below = box.top + box.height + GAP;
    return below + 220 < h
      ? { left: `${left}px`, top: `${below}px`, width: `${CARD_WIDTH}px` }
      : { left: `${left}px`, bottom: `${h - box.top + GAP}px`, width: `${CARD_WIDTH}px` };
  });

  constructor() {
    // En cada paso: llevar el elemento a la vista y medirlo cuando termine el desplazamiento.
    effect(() => {
      const step = this.tour.step();
      this.box.set(null);
      if (!step?.target) return;
      const el = this.target();
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.measure(), 380);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected measure(): void {
    this.viewport.set({ w: window.innerWidth, h: window.innerHeight });
    const el = this.target();
    if (!el) {
      this.box.set(null);
      return;
    }
    const r = el.getBoundingClientRect();
    this.box.set({
      top: r.top - PAD,
      left: r.left - PAD,
      width: r.width + PAD * 2,
      height: r.height + PAD * 2,
    });
  }

  private target(): HTMLElement | null {
    const name = this.tour.step()?.target;
    return name ? document.querySelector<HTMLElement>(`[data-tour="${name}"]`) : null;
  }
}
