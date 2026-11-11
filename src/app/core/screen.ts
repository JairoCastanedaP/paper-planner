import { DestroyRef, Injectable, inject, signal } from '@angular/core';

/**
 * "Computador": pantalla ancha y mouse o touchpad como entrada principal.
 * Una tablet (aunque tenga teclado) tiene la pantalla táctil como entrada principal
 * (`pointer: coarse`), así que conserva su diseño compacto.
 * La misma consulta se usa en los estilos (`month-grid.scss`, `calendar-page.scss`).
 */
export const DESKTOP_QUERY = '(min-width: 1200px) and (pointer: fine)';

@Injectable({ providedIn: 'root' })
export class ScreenService {
  private readonly query = window.matchMedia(DESKTOP_QUERY);
  readonly isDesktop = signal(this.query.matches);

  constructor() {
    // Algunos navegadores no avisan el cambio de la consulta al redimensionar o girar:
    // por eso también se revisa en cada cambio de tamaño de la ventana.
    const update = () => this.isDesktop.set(this.query.matches);
    this.query.addEventListener('change', update);
    window.addEventListener('resize', update);
    inject(DestroyRef).onDestroy(() => {
      this.query.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    });
  }
}
