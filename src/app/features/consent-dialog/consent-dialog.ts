import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { saveConsent } from '../../core/account';
import { AuthService } from '../../core/auth';
import { isEn, tx } from '../../core/i18n';

/**
 * Pide la autorización de tratamiento de datos a quien aún no aceptó la versión vigente
 * (cuentas creadas antes de existir la política, o cuando la política cambia).
 */
@Component({
  selector: 'app-consent-dialog',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="backdrop"></div>
    <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <h2 id="consent-title">{{ tx('Antes de continuar', 'Before you continue') }}</h2>
      <p>
        {{ tx('Para guardar tu calendario necesitamos tu autorización para tratar tus datos. Léela con calma: explica qué guardamos, dónde y cómo ejercer tus derechos.', 'To save your calendar we need your authorization to process your data. Read it calmly: it explains what we store, where, and how to exercise your rights.') }}
      </p>
      <label class="consent">
        <input type="checkbox" [(ngModel)]="accepted" />
        <span>
          @if (en()) {
            I accept the <a routerLink="/terminos" target="_blank">Terms and Conditions</a> and authorize the
            processing of my data under the
            <a routerLink="/privacidad" target="_blank">Data Processing Policy</a>, including any sensitive
            data I choose to record and its storage on servers outside Colombia.
          } @else {
            Acepto los <a routerLink="/terminos" target="_blank">Términos y Condiciones</a> y autorizo el
            tratamiento de mis datos según la
            <a routerLink="/privacidad" target="_blank">Política de Tratamiento de Datos</a>, incluidos los
            datos sensibles que decida registrar y su almacenamiento en servidores fuera de Colombia.
          }
        </span>
      </label>
      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
      <div class="buttons">
        <button type="button" (click)="declined.emit()" [disabled]="busy()">{{ tx('No acepto, cerrar sesión', 'I do not accept, sign out') }}</button>
        <button type="button" class="primary" (click)="accept()" [disabled]="!accepted || busy()">{{ tx('Aceptar y continuar', 'Accept and continue') }}</button>
      </div>
    </section>
  `,
  styleUrl: './consent-dialog.scss',
})
export class ConsentDialog {
  protected readonly tx = tx;
  protected readonly en = isEn;
  readonly accepted$ = output<void>({ alias: 'accepted' });
  readonly declined = output<void>();
  private readonly auth = inject(AuthService);

  protected accepted = false;
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected async accept(): Promise<void> {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await saveConsent(uid);
      this.accepted$.emit();
    } catch (e) {
      console.error(e);
      this.error.set(tx('No se pudo guardar tu autorización. Revisa tu conexión e inténtalo de nuevo.', 'Your authorization could not be saved. Check your connection and try again.'));
    } finally {
      this.busy.set(false);
    }
  }
}
