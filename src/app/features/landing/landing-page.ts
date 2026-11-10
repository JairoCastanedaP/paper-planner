import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PreviewDay {
  n: number;
  sunday?: boolean;
  today?: boolean;
  chips?: { c: string; t: string; hl?: boolean }[];
}

interface Feature {
  icon: string;
  title: string;
  text: string;
}

/** Pantalla de bienvenida: lo primero que ve quien entra al sitio sin sesión. */
@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  protected readonly year = new Date().getFullYear();

  protected readonly features: Feature[] = [
    {
      icon: '🖍',
      title: 'Resalta como en papel',
      text: 'Pasa el dedo o el lápiz sobre una actividad y queda pintada con el color de su categoría.',
    },
    {
      icon: '🗓',
      title: 'Mes, año y día',
      text: 'Todo el mes de un vistazo, el año con lo más importante de cada mes y la agenda de cada día.',
    },
    {
      icon: '🎯',
      title: 'Objetivos del mes',
      text: 'Metas con casilla y contadores que avanzan solos a medida que resaltas tus actividades.',
    },
    {
      icon: '⏰',
      title: 'Recordatorios',
      text: 'Las actividades muy importantes te avisan antes de que lleguen.',
    },
    {
      icon: '🎨',
      title: 'A tu manera',
      text: 'Tus propias categorías, cinco temas de color, fondos e íconos para los días especiales.',
    },
    {
      icon: '📱',
      title: 'Celular, tablet y computador',
      text: 'Se instala como app y funciona incluso sin conexión.',
    },
  ];

  /** Mini calendario decorativo del encabezado: semanas de muestra con algunas actividades. */
  protected readonly preview: PreviewDay[][] = [
    [
      { n: 1, sunday: true },
      { n: 2, chips: [{ c: 'english', t: 'Inglés', hl: true }] },
      { n: 3, chips: [{ c: 'academic', t: 'Curso web', hl: true }] },
      { n: 4, chips: [{ c: 'english', t: 'Inglés', hl: true }] },
      { n: 5, chips: [{ c: 'academic', t: 'Taller' }] },
      { n: 6, chips: [{ c: 'finance', t: 'Pago 65 USD' }] },
      { n: 7, chips: [{ c: 'project', t: 'Proyecto' }] },
    ],
    [
      { n: 8, sunday: true, chips: [{ c: 'birthday', t: '👑 Cumple' }] },
      { n: 9, chips: [{ c: 'english', t: 'Inglés' }] },
      { n: 10, today: true, chips: [{ c: 'academic', t: '⭐ Entrega' }] },
      { n: 11, chips: [{ c: 'english', t: 'Inglés' }] },
      { n: 12, chips: [{ c: 'academic', t: 'Curso web' }] },
      { n: 13 },
      { n: 14, chips: [{ c: 'english', t: 'Conversación' }] },
    ],
  ];
}
