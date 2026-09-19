import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-cq-surface/95 backdrop-blur-sm border-b border-cq-border">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <span class="text-xl font-bold text-cq-text group-hover:text-cq-primary transition-colors">
              CodeQuest
            </span>
            <span class="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full
                         bg-cq-primary/15 text-cq-primary border border-cq-primary/30">
              DevTalles 2026
            </span>
          </a>

          <!-- Desktop nav -->
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/"
               routerLinkActive="text-cq-primary bg-cq-primary/10"
               [routerLinkActiveOptions]="{ exact: true }"
               class="px-4 py-2 rounded-lg text-sm font-medium text-cq-muted hover:text-cq-text
                      hover:bg-cq-surface-hover transition-colors">
              Inicio
            </a>
          </div>

          <!-- Auth placeholder + hamburger -->
          <div class="flex items-center gap-3">
            <!-- Auth placeholder (WI-006 conectará aquí) -->
            <div class="hidden md:block">
              <button class="btn-primary text-sm" disabled>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Iniciar sesión
              </button>
            </div>

            <!-- Mobile hamburger -->
            <button
              (click)="toggleMenu()"
              class="md:hidden p-2 rounded-lg text-cq-muted hover:text-cq-text hover:bg-cq-surface-hover transition-colors"
              [attr.aria-expanded]="menuOpen()"
              aria-label="Abrir menú de navegación">
              @if (!menuOpen()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (menuOpen()) {
        <div class="md:hidden border-t border-cq-border bg-cq-surface">
          <div class="px-4 py-3 space-y-1">
            <a routerLink="/"
               routerLinkActive="text-cq-primary bg-cq-primary/10"
               [routerLinkActiveOptions]="{ exact: true }"
               (click)="closeMenu()"
               class="block px-4 py-2.5 rounded-lg text-sm font-medium text-cq-muted
                      hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
              Inicio
            </a>
            <div class="pt-2 border-t border-cq-border">
              <button class="btn-primary w-full text-sm justify-center" disabled>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent {
  menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
