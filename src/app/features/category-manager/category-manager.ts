import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { newId } from '../../core/ids';
import { Category } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';
import { ThemeService } from '../../core/themes';

/** Colores sugeridos para categorías nuevas (tonos de marcador). */
const SUGGESTED = ['#ff8a65', '#4dd0e1', '#ba68c8', '#aed581', '#ffd54f', '#90a4ae', '#f06292', '#7986cb'];

interface PendingDelete {
  id: string;
  events: number;
  goals: number;
  moveTo: string;
}

/** Crear, renombrar, cambiar color o icono, y eliminar categorías. */
@Component({
  selector: 'app-category-manager',
  imports: [FormsModule],
  templateUrl: './category-manager.html',
  styleUrl: './category-manager.scss',
  host: { '(document:keydown.escape)': 'closed.emit()' },
})
export class CategoryManager {
  readonly closed = output<void>();

  protected readonly store = inject(PlannerStore);
  private readonly theme = inject(ThemeService);

  protected readonly pending = signal<PendingDelete | null>(null);
  protected newName = '';
  protected newIcon = '';
  protected newColor = this.suggestColor();

  /** Para cada categoría: su color visible y si el tema tiene uno propio para ella. */
  protected readonly rows = computed(() =>
    this.store.categories().map((c) => ({
      category: c,
      raw: this.store.rawCategory(c.id)!,
      themeHasColor: c.id in this.theme.theme().categoryColors,
    })),
  );

  protected rename(raw: Category, name: string): void {
    const trimmed = name.trim();
    if (trimmed && trimmed !== raw.name) this.store.saveCategory({ ...raw, name: trimmed });
  }

  protected setIcon(raw: Category, icon: string): void {
    const trimmed = icon.trim();
    if (trimmed !== (raw.icon ?? '')) this.store.saveCategory({ ...raw, icon: trimmed || undefined });
  }

  protected setColor(raw: Category, color: string): void {
    this.store.saveCategory({ ...raw, color, customColor: true });
  }

  /** Vuelve a usar el color que define el tema para esta categoría. */
  protected useThemeColor(raw: Category): void {
    this.store.saveCategory({ ...raw, customColor: undefined });
  }

  protected askDelete(c: Category): void {
    const usage = this.store.usageOf(c.id);
    if (usage.events === 0 && usage.goals === 0) {
      this.store.deleteCategory(c.id, '');
      return;
    }
    const moveTo = this.store.categories().find((x) => x.id !== c.id)?.id ?? '';
    this.pending.set({ id: c.id, ...usage, moveTo });
  }

  protected usageText(p: PendingDelete): string {
    const parts: string[] = [];
    if (p.events) parts.push(`${p.events} ${p.events === 1 ? 'actividad' : 'actividades'}`);
    if (p.goals) parts.push(`${p.goals} ${p.goals === 1 ? 'objetivo' : 'objetivos'}`);
    return parts.join(' y ');
  }

  protected confirmDelete(): void {
    const p = this.pending();
    if (!p?.moveTo) return;
    this.store.deleteCategory(p.id, p.moveTo);
    this.pending.set(null);
  }

  protected add(): void {
    const name = this.newName.trim();
    if (!name) return;
    this.store.saveCategory({
      id: `${slug(name)}-${newId().slice(-4)}`,
      name,
      icon: this.newIcon.trim() || undefined,
      color: this.newColor,
      customColor: true,
    });
    this.newName = '';
    this.newIcon = '';
    this.newColor = this.suggestColor();
  }

  private suggestColor(): string {
    const used = new Set(this.store.categories().map((c) => c.color.toLowerCase()));
    return SUGGESTED.find((c) => !used.has(c)) ?? SUGGESTED[0];
  }
}

function slug(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'cat'
  );
}
