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
  protected readonly error = signal('');
  protected readonly busy = signal(false);

  protected get mismatch(): boolean {
    return !!this.confirm && this.password !== this.confirm;
  }

  protected async submit(): Promise<void> {
    if (this.mismatch) return;
    this.busy.set(true);
    const error = await this.auth.register(this.name, this.email, this.password);
    this.busy.set(false);
    if (error) this.error.set(error);
    else this.router.navigate(['/calendario']);
  }
}
