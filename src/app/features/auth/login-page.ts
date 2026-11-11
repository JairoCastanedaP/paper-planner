import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './auth-page.scss',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Al volver de cambiar la contraseña, el correo llega ya escrito. */
  protected email = inject(ActivatedRoute).snapshot.queryParamMap.get('email') ?? '';
  protected password = '';
  protected readonly error = signal('');
  protected readonly busy = signal(false);

  protected async submit(): Promise<void> {
    // Se valida al enviar (y no deshabilitando el botón) para que funcione también con autocompletar.
    if (!this.email.trim() || !this.password) {
      this.error.set('Escribe tu correo y tu contraseña.');
      return;
    }
    this.busy.set(true);
    const error = await this.auth.login(this.email, this.password);
    this.busy.set(false);
    if (error) {
      this.error.set(error);
      this.password = '';
    } else {
      // Si el correo no está verificado, el guard lo lleva a /verificar.
      this.router.navigate(['/calendario']);
    }
  }

  protected demo(): void {
    this.auth.enterAsGuest();
    this.router.navigate(['/calendario']);
  }
}
