import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

/** Registro solo visual: el alta real llegará con Firebase Auth. */
@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './auth-page.scss',
})
export class RegisterPage {
  protected name = '';
  protected email = '';
  protected password = '';
  protected confirm = '';
  protected readonly sent = signal(false);

  protected get mismatch(): boolean {
    return !!this.confirm && this.password !== this.confirm;
  }

  protected submit(): void {
    if (this.mismatch) return;
    this.sent.set(true);
  }
}
