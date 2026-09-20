import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-cq-surface border border-cq-border rounded-2xl p-8 text-center shadow-xl">
        @if (isLoading()) {
          <!-- Loading State -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-cq-primary/20 border-t-cq-primary rounded-full animate-spin"></div>
            <h2 class="text-xl font-bold text-cq-text">Procesando autenticación...</h2>
            <p class="text-sm text-cq-muted">Estamos validando tu sesión con Discord, un momento por favor.</p>
          </div>
        } @else if (errorMessage()) {
          <!-- Error State -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-cq-text">Error de Autenticación</h2>
            <p class="text-sm text-red-400 bg-red-950/30 border border-red-800/40 p-3 rounded-lg w-full text-left">
              {{ errorMessage() }}
            </p>
            <div class="flex gap-3 mt-2 w-full">
              <a routerLink="/" class="btn-secondary flex-1 text-center justify-center text-sm py-2">
                Volver al inicio
              </a>
              <button (click)="retryLogin()" class="btn-primary flex-1 text-center justify-center text-sm py-2">
                Reintentar
              </button>
            </div>
          </div>
        } @else {
          <!-- Success State -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-cq-text">¡Bienvenido a CodeQuest!</h2>
            <p class="text-sm text-cq-muted">Sesión iniciada correctamente. Redirigiendo a la plataforma...</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const error = params['error'] || params['error_description'];

      if (error) {
        this.isLoading.set(false);
        this.errorMessage.set(decodeURIComponent(error));
        return;
      }

      if (token) {
        this.authService.handleAuthCallback(token).subscribe({
          next: (user) => {
            this.isLoading.set(false);
            if (user) {
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1200);
            } else {
              this.errorMessage.set('No se pudo cargar el perfil del usuario autenticado.');
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorMessage.set(err?.error?.message || 'Error al validar el token de acceso.');
          },
        });
      } else {
        this.isLoading.set(false);
        this.errorMessage.set('No se recibió el token de autenticación en la respuesta de Discord.');
      }
    });
  }

  retryLogin(): void {
    this.authService.loginWithDiscord();
  }
}
