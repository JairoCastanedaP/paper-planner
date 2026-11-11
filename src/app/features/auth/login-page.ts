import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  protected email = '';
  protected password = '';
  protected readonly error = signal('');
  protected readonly info = signal('');
  protected readonly busy = signal(false);

  protected async submit(): Promise<void> {
    // Se valida al enviar (y no deshabilitando el botón) para que funcione también con autocompletar.
    this.info.set('');
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
      this.router.navigate(['/calendario']);
    }
  }

  protected async forgot(): Promise<void> {
    this.error.set('');
    this.info.set('');
    if (!this.email.trim()) {
      this.error.set('Escribe tu correo y vuelve a pulsar "¿Olvidaste tu contraseña?".');
      return;
    }
    this.busy.set(true);
    const error = await this.auth.resetPassword(this.email);
    this.busy.set(false);
    if (error) this.error.set(error);
    else this.info.set(`Si existe una cuenta con ${this.email.trim()}, te enviamos un correo para cambiar la contraseña.`);
  }

  protected demo(): void {
    this.auth.enterAsGuest();
    this.router.navigate(['/calendario']);
  }
}
