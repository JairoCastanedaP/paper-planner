import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/themes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  // Se crea al inicio para aplicar el tema guardado también en el login.
  private readonly theme = inject(ThemeService);
}
