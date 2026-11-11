import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';

/** "¿Olvidaste tu contraseña?": pide el enlace para crear una nueva. */
@Component({
  selector: 'app-forgot-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-page.html',
  styleUrl: './auth-page.scss',
})
export class ForgotPage {
  private readonly auth = inject(AuthService);

  /** Si se llega desde el login con el correo ya escrito, se reutiliza. */
  protected email = inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? '';
  protected readonly error = signal('');
  protected readonly sentTo = signal('');
  protected readonly busy = signal(false);

  protected async submit(): Promise<void> {
    this.error.set('');
    const email = this.email.trim();
    if (!email) {
      this.error.set('Escribe el correo de tu cuenta.');
      return;
    }
    this.busy.set(true);
    const error = await this.auth.resetPassword(email);
    this.busy.set(false);
    if (error) this.error.set(error);
    else this.sentTo.set(email);
  }
}
