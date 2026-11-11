import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { deleteAccount } from '../../core/account';
import { AuthService } from '../../core/auth';
import { PlannerStore } from '../../core/planner-store';

/** Mi cuenta: datos de la cuenta, documentos legales, descargar mis datos y eliminar la cuenta. */
@Component({
  selector: 'app-account-dialog',
  imports: [FormsModule, RouterLink],
  templateUrl: './account-dialog.html',
  styleUrl: './account-dialog.scss',
  host: { '(document:keydown.escape)': 'close()' },
})
export class AccountDialog {
  readonly closed = output<void>();
  protected readonly auth = inject(AuthService);
  private readonly store = inject(PlannerStore);
  private readonly router = inject(Router);

  protected readonly confirmingDelete = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected password = '';

  protected close(): void {
    if (!this.busy()) this.closed.emit();
  }

  /** Descarga todo el calendario en un archivo .json (derecho de acceso y respaldo propio). */
  protected download(): void {
    const user = this.auth.user();
    const content = {
      app: 'Paper Planner',
      exportedAt: new Date().toISOString(),
      account: user && !user.guest ? { name: user.name, email: user.email } : null,
      calendar: this.store.snapshot(),
    };
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `paper-planner-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  protected async remove(): Promise<void> {
    this.error.set('');
    if (!this.password) {
      this.error.set('Escribe tu contraseña para confirmar.');
      return;
    }
    this.busy.set(true);
    this.store.detach();
    const error = await deleteAccount(this.password);
    this.busy.set(false);
    if (error) {
      this.error.set(error);
      this.password = '';
      return;
    }
    await this.auth.logout();
    this.router.navigate(['/'], { state: { accountDeleted: true } });
  }
}
