import { Component, inject, output } from '@angular/core';
import { ThemeService } from '../../core/themes';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.html',
  styleUrl: './theme-picker.scss',
  host: { '(document:keydown.escape)': 'closed.emit()' },
})
export class ThemePicker {
  readonly closed = output<void>();
  protected readonly themes = inject(ThemeService);
  protected readonly swatchOrder = ['academic', 'english', 'finance', 'birthday', 'project'];
}
