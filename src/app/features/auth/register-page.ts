import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './auth-page.scss',
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected name = '';
  protected email = '';
  protected password = '';
  protected confirm = '';
  /** Autorización de tratamiento de datos: casilla sin marcar por defecto (Ley 1581). */
  protected accepted = false;
  protected readonly error = signal('');
  protected readonly busy = signal(false);

  protected get mismatch(): boolean {
    return !!this.confirm && this.password !== this.confirm;
  }

  protected async submit(): Promise<void> {
    if (this.mismatch || !this.accepted) return;
    this.busy.set(true);
    const error = await this.auth.register(this.name, this.email, this.password);
    if (error) {
      this.busy.set(false);
      this.error.set(error);
      return;
    }
    // Prueba de la autorización. Si falla, el calendario la vuelve a pedir al entrar.
    const uid = this.auth.user()?.uid;
    if (uid) {
      await import('../../core/account')
        .then((m) => m.saveConsent(uid))
        .catch((e) => console.error(e));
    }
    this.busy.set(false);
    this.router.navigate(['/verificar']);
  }
}
