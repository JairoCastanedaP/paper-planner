import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/themes';
import { UpdateBanner } from './features/update-banner/update-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UpdateBanner],
  template: '<router-outlet /><app-update-banner />',
})
export class App {
  // Se crea al inicio para aplicar el tema guardado también en el login.
  private readonly theme = inject(ThemeService);
}
