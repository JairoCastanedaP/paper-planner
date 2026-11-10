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

  protected username = '';
  protected password = '';
  protected readonly error = signal('');

  protected submit(): void {
    // Se valida al enviar (y no deshabilitando el botón) para que funcione también con autocompletar.
    if (!this.username.trim() || !this.password) {
      this.error.set('Escribe tu usuario y tu contraseña.');
      return;
    }
    if (this.auth.login(this.username, this.password)) {
      this.router.navigate(['/calendario']);
    } else {
      this.error.set('Usuario o contraseña incorrectos.');
      this.password = '';
    }
  }
}
