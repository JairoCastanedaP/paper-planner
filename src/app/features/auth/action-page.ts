import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { PASSWORD_RULES, passwordIsValid } from '../../core/password';

type State =
  | { kind: 'loading' }
  | { kind: 'reset'; email: string }
  | { kind: 'reset-done'; email: string }
  | { kind: 'verified' }
  | { kind: 'error'; message: string; retry?: 'reset' | 'verify' };

/**
 * Destino de los enlaces que envía Firebase por correo (cambiar contraseña y verificar
 * correo), en lugar de la página genérica de Firebase. Firebase agrega `mode` y `oobCode`.
 * Se configura en Firebase → Authentication → Plantillas → URL de acción.
 */
@Component({
  selector: 'app-action-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './action-page.html',
  styleUrl: './auth-page.scss',
})
export class ActionPage {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly params = inject(ActivatedRoute).snapshot.queryParamMap;
  private readonly code = this.params.get('oobCode') ?? '';

  protected readonly state = signal<State>({ kind: 'loading' });
  protected readonly rules = PASSWORD_RULES;
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected password = '';
  protected confirm = '';
  protected show = false;

  constructor() {
    void this.start(this.params.get('mode'));
  }

  private async start(mode: string | null): Promise<void> {
    if (!this.code) {
      this.state.set({ kind: 'error', message: 'El enlace está incompleto. Ábrelo de nuevo desde el correo.' });
      return;
    }
    if (mode === 'resetPassword') {
      const result = await this.auth.checkResetCode(this.code);
      this.state.set(
        'email' in result
          ? { kind: 'reset', email: result.email }
          : { kind: 'error', message: result.error, retry: 'reset' },
      );
    } else if (mode === 'verifyEmail') {
      const error = await this.auth.applyVerification(this.code);
      this.state.set(error ? { kind: 'error', message: error, retry: 'verify' } : { kind: 'verified' });
    } else {
      this.state.set({ kind: 'error', message: 'Este enlace no es para Paper Planner o ya no se puede usar.' });
    }
  }

  protected get mismatch(): boolean {
    return !!this.confirm && this.password !== this.confirm;
  }

  protected async savePassword(email: string): Promise<void> {
    this.error.set('');
    if (!passwordIsValid(this.password)) {
      this.error.set('La contraseña todavía no cumple los requisitos.');
      return;
    }
    if (this.password !== this.confirm) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.busy.set(true);
    const error = await this.auth.confirmNewPassword(this.code, this.password);
    this.busy.set(false);
    if (error) this.error.set(error);
    else this.state.set({ kind: 'reset-done', email });
  }

  protected continueAfterVerify(): void {
    this.router.navigate([this.auth.user() ? '/calendario' : '/login']);
  }
}
