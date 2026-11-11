import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth';

export interface TourStep {
  /** Elemento a resaltar (`[data-tour="…"]`); sin él, el paso va centrado. */
  target?: string;
  title: string;
  text: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    title: '¡Bienvenido a Paper Planner! 👋',
    text: 'Tu calendario de papel, ahora digital. Te muestro lo principal en un minuto; puedes omitir la guía cuando quieras.',
  },
  {
    target: 'views',
    title: 'Día, mes o año',
    text: 'Cambia entre la agenda de un día, la vista del mes y la del año completo con lo más importante de cada mes.',
  },
  {
    target: 'nav',
    title: 'Moverte en el tiempo',
    text: 'Usa las flechas (o las del teclado) para ir al periodo anterior o siguiente. "Hoy" te devuelve al día actual.',
  },
  {
    target: 'goals',
    title: 'Notas del mes',
    text: 'Tus objetivos del mes. Marca la casilla cuando los cumplas y toca el nombre para editarlos o agregar un detalle.',
  },
  {
    target: 'grid',
    title: 'Tu mes, como en papel',
    text: 'Toca un día para ver sus notas, agregar actividades o personalizarlo con una imagen. Desliza el dedo o el lápiz sobre una actividad para resaltarla.',
  },
  {
    target: 'filter',
    title: 'Filtrar por categoría',
    text: 'Elige una o varias categorías para ver solo esas actividades y cuántas hiciste en el periodo.',
  },
  {
    target: 'search',
    title: 'Buscar',
    text: 'Encuentra cualquier actividad u objetivo y cuándo fue la última vez. Atajo: tecla "/".',
  },
  {
    target: 'menu',
    title: 'Hazlo tuyo',
    text: 'En este menú creas tus categorías, eliges los colores, administras tu cuenta y puedes volver a ver esta guía.',
  },
  {
    title: '¡Listo!',
    text: 'Ya puedes organizar tu mes. Al bajar, el encabezado se compacta y tus objetivos siguen a la vista.',
  },
];

/** Guía de uso: se muestra la primera vez que cada usuario entra. */
@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly auth = inject(AuthService);

  readonly steps = TOUR_STEPS;
  /** Paso actual; null = guía cerrada. */
  readonly index = signal<number | null>(null);
  readonly step = computed(() => {
    const i = this.index();
    return i === null ? null : this.steps[i];
  });

  private get key(): string {
    return `paper-planner:tour-done:${this.auth.user()?.uid ?? 'anon'}`;
  }

  /** Inicia la guía si este usuario todavía no la ha visto. */
  startIfFirstTime(): void {
    try {
      if (localStorage.getItem(this.key)) return;
    } catch {
      return;
    }
    this.start();
  }

  start(): void {
    this.index.set(0);
  }

  next(): void {
    const i = this.index();
    if (i === null) return;
    if (i >= this.steps.length - 1) this.finish();
    else this.index.set(i + 1);
  }

  previous(): void {
    const i = this.index();
    if (i) this.index.set(i - 1);
  }

  /** Terminar u omitir: no se vuelve a mostrar sola. */
  finish(): void {
    this.index.set(null);
    try {
      localStorage.setItem(this.key, new Date().toISOString());
    } catch {
      // Sin almacenamiento, la guía volverá a salir la próxima vez.
    }
  }
}
