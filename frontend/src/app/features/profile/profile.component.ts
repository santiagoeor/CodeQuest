import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto bg-cq-surface border border-cq-border rounded-2xl p-8 shadow-xl">
        <div class="flex items-center gap-6 pb-6 border-b border-cq-border">
          @if (user()?.avatar) {
            <img [src]="user()?.avatar" alt="Avatar" class="w-20 h-20 rounded-full border-2 border-cq-primary/40 object-cover" />
          } @else {
            <div class="w-20 h-20 rounded-full bg-cq-primary/20 text-cq-primary flex items-center justify-center font-bold text-2xl border border-cq-primary/30">
              {{ user()?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
          }
          <div>
            <h1 class="text-2xl font-bold text-cq-text">{{ user()?.name }}</h1>
            <p class="text-sm text-cq-muted">{{ user()?.email }}</p>
            <span class="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Conectado vía Discord
            </span>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-cq-muted">Detalles de la Cuenta</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-cq-surface-hover/50 p-4 rounded-xl border border-cq-border/60">
              <span class="text-xs text-cq-muted block">ID de Usuario</span>
              <span class="text-sm font-mono text-cq-text font-medium">{{ user()?.id }}</span>
            </div>
            <div class="bg-cq-surface-hover/50 p-4 rounded-xl border border-cq-border/60">
              <span class="text-xs text-cq-muted block">Discord ID</span>
              <span class="text-sm font-mono text-cq-text font-medium">{{ user()?.discord_id }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-between items-center pt-6 border-t border-cq-border">
          <a routerLink="/" class="btn-secondary text-sm">
            ← Volver al Inicio
          </a>
          <button (click)="logout()" class="px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
