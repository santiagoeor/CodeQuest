import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../../shared/components/container/container.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContainerComponent, RouterLink],
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
            <a routerLink="/assessment" class="btn-primary text-base px-8 py-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Comenzar Diagnóstico
            </a>
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
