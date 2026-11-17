import { Injectable, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { isEn } from './i18n';

/** Títulos de las rutas (app.routes.ts) en inglés. */
const EN: Record<string, string> = {
  'Paper Planner · Tu calendario de papel, ahora digital': 'Paper Planner · Your paper calendar, now digital',
  'Iniciar sesión · Paper Planner': 'Sign in · Paper Planner',
  'Crear cuenta · Paper Planner': 'Create account · Paper Planner',
  'Verifica tu correo · Paper Planner': 'Verify your email · Paper Planner',
  'Recuperar contraseña · Paper Planner': 'Reset password · Paper Planner',
  'Política de datos · Paper Planner': 'Data policy · Paper Planner',
  'Términos y condiciones · Paper Planner': 'Terms and conditions · Paper Planner',
};

/** Pone el título de la pestaña en el idioma de la app, y lo cambia si cambia el idioma. */
@Injectable({ providedIn: 'root' })
export class I18nTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly current = signal<string | undefined>(undefined);

  constructor() {
    super();
    effect(() => {
      const t = this.current();
      if (t) this.title.setTitle(isEn() ? (EN[t] ?? t) : t);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.current.set(this.buildTitle(snapshot));
  }
}
