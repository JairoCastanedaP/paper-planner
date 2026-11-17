import { Component } from '@angular/core';
import { lang, setLang, tx } from '../../core/i18n';

/** Selector de idioma ES | EN para las páginas sin sesión (bienvenida, ingreso, registro…). */
@Component({
  selector: 'app-lang-switch',
  template: `
    <div class="switch" role="group" [attr.aria-label]="tx('Idioma', 'Language')">
      <button type="button" [class.on]="lang() === 'es'" [attr.aria-pressed]="lang() === 'es'" (click)="setLang('es')" lang="es">ES</button>
      <button type="button" [class.on]="lang() === 'en'" [attr.aria-pressed]="lang() === 'en'" (click)="setLang('en')" lang="en">EN</button>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      z-index: 5;
      top: 12px;
      right: 16px;
    }
    .switch {
      display: inline-flex;
      overflow: hidden;
      border: 2px solid var(--line);
      border-radius: 999px;
      background: var(--card);
    }
    button {
      padding: 3px 10px;
      border: 0;
      border-radius: 0;
      background: none;
      font-size: 0.8rem;
      font-weight: 700;
    }
    button.on {
      background: var(--line);
      color: var(--on-line);
    }
  `,
})
export class LangSwitch {
  protected readonly lang = lang;
  protected readonly setLang = setLang;
  protected readonly tx = tx;
}
