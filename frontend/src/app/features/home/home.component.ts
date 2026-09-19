import { Component } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContainerComponent],
  template: `
    <div class="py-12 sm:py-20">
      <app-container>
        <!-- Hero -->
        <div class="text-center mb-16">
          <span class="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6
                       bg-cq-primary/15 text-cq-primary border border-cq-primary/30">
            Hackathon DevTalles 2026
          </span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            <span class="bg-gradient-to-r from-cq-text to-cq-muted bg-clip-text text-transparent">
              CodeQuest
            </span>
            <br>
            <span class="text-2xl sm:text-3xl lg:text-4xl font-bold text-cq-muted">
              Rutas Dinámicas de Aprendizaje
            </span>
          </h1>
          <p class="text-cq-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Plataforma interactiva para descubrir y trazar rutas de aprendizaje personalizadas
            con los cursos del ecosistema DevTalles.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button class="btn-primary text-base px-8 py-3" disabled>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Comenzar con Discord
            </button>
            <a href="https://cursos.devtalles.com" target="_blank" rel="noopener noreferrer"
               class="btn-outline text-base px-8 py-3">
              Explorar cursos
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Features grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <!-- Feature 1 -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-cq-primary/15 flex items-center justify-center">
                <svg class="w-5 h-5 text-cq-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <h3 class="text-base font-semibold text-cq-text">Diagnóstico Inteligente</h3>
            </div>
            <p class="text-sm text-cq-muted leading-relaxed">
              Cuestionario interactivo que evalúa tu nivel y metas para crear una ruta personalizada.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-cq-accent/15 flex items-center justify-center">
                <svg class="w-5 h-5 text-cq-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </div>
              <h3 class="text-base font-semibold text-cq-text">Rutas Dinámicas</h3>
            </div>
            <p class="text-sm text-cq-muted leading-relaxed">
              Motor de recomendación que genera rutas de estudio optimizadas con cursos de DevTalles.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card-hover">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-cq-warning/15 flex items-center justify-center">
                <svg class="w-5 h-5 text-cq-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <h3 class="text-base font-semibold text-cq-text">Seguimiento de Progreso</h3>
            </div>
            <p class="text-sm text-cq-muted leading-relaxed">
              Visualiza tu avance, marca cursos completados y mide tu progreso hacia tus metas.
            </p>
          </div>
        </div>

        <!-- Tech stack info -->
        <div class="text-center">
          <p class="text-xs text-cq-muted">
            Construido con Angular · Laravel · MySQL · Docker Compose
          </p>
        </div>
      </app-container>
    </div>
  `,
})
export class HomeComponent {}
