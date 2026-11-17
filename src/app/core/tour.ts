import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth';
import { tx } from './i18n';

export interface TourStep {
  /** Elemento a resaltar (`[data-tour="…"]`); sin él, el paso va centrado. */
  target?: string;
  title: string;
  text: string;
  titleEn: string;
  textEn: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    title: '¡Bienvenido a Paper Planner! 👋',
    text: 'Tu calendario de papel, ahora digital. Te muestro lo principal en un minuto; puedes omitir la guía cuando quieras.',
    titleEn: 'Welcome to Paper Planner! 👋',
    textEn: 'Your paper calendar, now digital. Let me show you the essentials in a minute; you can skip the guide at any time.',
  },
  {
    target: 'views',
    title: 'Día, mes o año',
    text: 'Cambia entre la agenda de un día, la vista del mes y la del año completo con lo más importante de cada mes.',
    titleEn: 'Day, month or year',
    textEn: 'Switch between a single day agenda, the month view and the whole year with the highlights of each month.',
  },
  {
    target: 'nav',
    title: 'Moverte en el tiempo',
    text: 'Usa las flechas (o las del teclado) para ir al periodo anterior o siguiente. "Hoy" te devuelve al día actual.',
    titleEn: 'Move through time',
    textEn: 'Use the arrows (or your keyboard arrows) to go to the previous or next period. "Today" brings you back to the current day.',
  },
  {
    target: 'goals',
    title: 'Notas del mes',
    text: 'Tus objetivos del mes. Marca la casilla cuando los cumplas y toca el nombre para editarlos o agregar un detalle.',
    titleEn: 'Notes of the month',
    textEn: 'Your goals for the month. Tick the box when you reach them and tap the name to edit them or add details.',
  },
  {
    target: 'grid',
    title: 'Tu mes, como en papel',
    text: 'Toca un día para ver sus notas, agregar actividades o personalizarlo con una imagen. Desliza el dedo o el lápiz sobre una actividad para resaltarla.',
    titleEn: 'Your month, like on paper',
    textEn: 'Tap a day to see its notes, add activities or personalize it with an image. Swipe your finger or pen across an activity to highlight it.',
  },
  {
    target: 'filter',
    title: 'Filtrar por categoría',
    text: 'Elige una o varias categorías para ver solo esas actividades y cuántas hiciste en el periodo.',
    titleEn: 'Filter by category',
    textEn: 'Pick one or more categories to see only those activities and how many you did in the period.',
  },
  {
    target: 'search',
    title: 'Buscar',
    text: 'Encuentra cualquier actividad u objetivo y cuándo fue la última vez. Atajo: tecla "/".',
    titleEn: 'Search',
    textEn: 'Find any activity or goal and when it last happened. Shortcut: the "/" key.',
  },
  {
    target: 'menu',
    title: 'Hazlo tuyo',
    text: 'En este menú creas tus categorías, eliges el tema, administras tu cuenta y puedes volver a ver esta guía.',
    titleEn: 'Make it yours',
    textEn: 'In this menu you create your categories, choose the theme and language, manage your account and can watch this guide again.',
  },
  {
    title: '¡Listo!',
    text: 'Ya puedes organizar tu mes. Al bajar, el encabezado se compacta y tus objetivos siguen a la vista.',
    titleEn: 'All set!',
    textEn: 'You can now plan your month. When you scroll down, the header gets compact and your goals stay in sight.',
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
    if (i === null) return null;
    const s = this.steps[i];
    return { target: s.target, title: tx(s.title, s.titleEn), text: tx(s.text, s.textEn) };
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
