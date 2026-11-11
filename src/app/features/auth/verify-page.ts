import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';

/** Después de registrarse: hay que abrir el enlace que llegó al correo antes de guardar datos. */
@Component({
  selector: 'app-verify-page',
  templateUrl: './verify-page.html',
  styleUrl: './auth-page.scss',
})
export class VerifyPage {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly info = signal('');
  protected readonly busy = signal(false);

  protected async check(): Promise<void> {
    this.error.set('');
    this.info.set('');
    this.busy.set(true);
    const verified = await this.auth.refreshVerification().catch(() => false);
    this.busy.set(false);
    if (verified) this.router.navigate(['/calendario']);
    else this.error.set('Todavía no vemos tu correo verificado. Abre el enlace del correo y vuelve a intentarlo.');
  }

  protected async resend(): Promise<void> {
    this.error.set('');
    this.info.set('');
    this.busy.set(true);
    const error = await this.auth.resendVerification();
    this.busy.set(false);
    if (error) this.error.set(error);
    else this.info.set('Te enviamos un correo nuevo. Revisa también la carpeta de spam.');
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/']);
  }
}
