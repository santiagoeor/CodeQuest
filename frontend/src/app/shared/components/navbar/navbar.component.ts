import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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

          <!-- Desktop nav links -->
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/"
               routerLinkActive="text-cq-primary bg-cq-primary/10"
               [routerLinkActiveOptions]="{ exact: true }"
               class="px-4 py-2 rounded-lg text-sm font-medium text-cq-muted hover:text-cq-text
                      hover:bg-cq-surface-hover transition-colors">
              Inicio
            </a>

            <a routerLink="/assessment"
               routerLinkActive="text-cq-primary bg-cq-primary/10"
               class="px-4 py-2 rounded-lg text-sm font-medium text-cq-muted hover:text-cq-text
                      hover:bg-cq-surface-hover transition-colors">
              Diagnóstico
            </a>

            <a routerLink="/courses"
               routerLinkActive="text-cq-primary bg-cq-primary/10"
               class="px-4 py-2 rounded-lg text-sm font-medium text-cq-muted hover:text-cq-text
                      hover:bg-cq-surface-hover transition-colors">
              Cursos
            </a>

            @if (isAuthenticated()) {
              <a routerLink="/paths"
                 routerLinkActive="text-cq-primary bg-cq-primary/10"
                 class="px-4 py-2 rounded-lg text-sm font-medium text-cq-muted hover:text-cq-text
                        hover:bg-cq-surface-hover transition-colors">
                Mis Rutas
              </a>

              <a routerLink="/profile"
                 routerLinkActive="text-cq-primary bg-cq-primary/10"
                 class="px-4 py-2 rounded-lg text-sm font-medium text-cq-muted hover:text-cq-text
                        hover:bg-cq-surface-hover transition-colors">
                Mi Perfil
              </a>
            }
          </div>

          <!-- Auth Actions & Profile + Hamburger -->
          <div class="flex items-center gap-3">

            <!-- Desktop Auth -->
            <div class="hidden md:flex items-center gap-2">
              @if (isLoading()) {
                <div class="flex items-center gap-2 text-xs text-cq-muted px-3 py-2">
                  <div class="w-4 h-4 border-2 border-cq-primary/30 border-t-cq-primary rounded-full animate-spin"></div>
                  Cargando...
                </div>
              } @else if (isAuthenticated()) {
                <!-- User Profile Dropdown / Info -->
                <div class="relative">
                  <button
                    (click)="toggleUserDropdown()"
                    class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-cq-surface-hover/80
                           border border-cq-border hover:border-cq-primary/40 transition-colors">
                    @if (user()?.avatar) {
                      <img [src]="user()?.avatar" [alt]="user()?.name"
                           class="w-7 h-7 rounded-full object-cover border border-cq-primary/30" />
                    } @else {
                      <div class="w-7 h-7 rounded-full bg-cq-primary/20 text-cq-primary flex items-center justify-center font-bold text-xs">
                        {{ user()?.name?.charAt(0)?.toUpperCase() || 'U' }}
                      </div>
                    }
                    <span class="text-sm font-medium text-cq-text max-w-[120px] truncate">
                      {{ user()?.name }}
                    </span>
                    <svg class="w-4 h-4 text-cq-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  @if (userDropdownOpen()) {
                    <div class="absolute right-0 mt-2 w-56 bg-cq-surface border border-cq-border rounded-xl shadow-2xl py-1 z-50">
                      <div class="px-4 py-2 border-b border-cq-border/60">
                        <p class="text-xs text-cq-muted truncate">{{ user()?.email }}</p>
                        <div class="flex items-center justify-between gap-1.5 mt-1.5">
                          <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                                [ngClass]="user()?.role === 'admin' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-cq-primary/20 text-cq-primary border border-cq-primary/30'">
                            {{ user()?.role === 'admin' ? 'Admin' : 'Estudiante' }}
                          </span>
                          <button
                            (click)="toggleRole()"
                            class="text-[11px] text-cq-primary hover:underline font-medium">
                            Cambiar a {{ user()?.role === 'admin' ? 'Estudiante' : 'Admin' }}
                          </button>
                        </div>
                      </div>
                      <a routerLink="/courses"
                         (click)="closeUserDropdown()"
                         class="block px-4 py-2 text-sm text-cq-muted hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
                        Catálogo Cursos
                      </a>
                      <a routerLink="/paths"
                         (click)="closeUserDropdown()"
                         class="block px-4 py-2 text-sm text-cq-muted hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
                        Mis Rutas
                      </a>
                      <a routerLink="/profile"
                         (click)="closeUserDropdown()"
                         class="block px-4 py-2 text-sm text-cq-muted hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
                        Ver Perfil
                      </a>
                      <button
                        (click)="logout()"
                        class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-cq-border/60">
                        Cerrar Sesión
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <!-- Login with Email/Password Button (WI-020) -->
                <button
                  (click)="openLoginModal()"
                  class="px-3.5 py-2 rounded-xl text-sm font-semibold bg-cq-primary/15 text-cq-primary hover:bg-cq-primary/25 border border-cq-primary/30 inline-flex items-center gap-1.5 transition-all shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  <span>Iniciar Sesión</span>
                </button>

                <!-- Login with Google Button (WI-016) -->
                <button
                  (click)="loginWithGoogle()"
                  class="px-3 py-2 rounded-xl text-sm font-semibold bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-sm inline-flex items-center gap-2 transition-all">
                  <svg class="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Google
                </button>

                <!-- Login with Discord Button (AC-1) -->
                <button
                  (click)="loginWithDiscord()"
                  class="btn-primary text-sm bg-[#5865F2] hover:bg-[#4752C4] border-none text-white shadow-md inline-flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                  Discord
                </button>
              }
            </div>

            <!-- Mobile Hamburger -->
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

      <!-- Mobile dropdown menu -->
      @if (menuOpen()) {
        <div class="md:hidden border-t border-cq-border bg-cq-surface">
          <div class="px-4 py-3 space-y-2">
            <a routerLink="/"
               routerLinkActive="text-cq-primary bg-cq-primary/10"
               [routerLinkActiveOptions]="{ exact: true }"
               (click)="closeMenu()"
               class="block px-4 py-2.5 rounded-lg text-sm font-medium text-cq-muted
                      hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
              Inicio
            </a>

            <a routerLink="/assessment"
               routerLinkActive="text-cq-primary bg-cq-primary/10"
               (click)="closeMenu()"
               class="block px-4 py-2.5 rounded-lg text-sm font-medium text-cq-muted
                      hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
              Diagnóstico
            </a>

            <a routerLink="/courses"
               routerLinkActive="text-cq-primary bg-cq-primary/10"
               (click)="closeMenu()"
               class="block px-4 py-2.5 rounded-lg text-sm font-medium text-cq-muted
                      hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
              Cursos
            </a>

            @if (isAuthenticated()) {
              <a routerLink="/paths"
                 routerLinkActive="text-cq-primary bg-cq-primary/10"
                 (click)="closeMenu()"
                 class="block px-4 py-2.5 rounded-lg text-sm font-medium text-cq-muted
                        hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
                Mis Rutas
              </a>

              <a routerLink="/profile"
                 (click)="closeMenu()"
                 class="block px-4 py-2.5 rounded-lg text-sm font-medium text-cq-muted
                        hover:text-cq-text hover:bg-cq-surface-hover transition-colors">
                Mi Perfil ({{ user()?.name }})
              </a>

              <div class="flex items-center justify-between px-4 py-2 mb-1 rounded-xl bg-cq-surface-hover/50 border border-cq-border/40">
                <span class="text-xs text-cq-muted">Rol activo:</span>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                        [ngClass]="user()?.role === 'admin' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-cq-primary/20 text-cq-primary border border-cq-primary/30'">
                    {{ user()?.role === 'admin' ? 'Admin' : 'Estudiante' }}
                  </span>
                  <button
                    (click)="toggleRole()"
                    class="text-xs text-cq-primary font-medium hover:underline">
                    Cambiar
                  </button>
                </div>
              </div>

              <button
                (click)="logout(); closeMenu()"
                class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                Cerrar Sesión
              </button>
            } @else {
              <div class="pt-2 space-y-2 border-t border-cq-border">
                <button
                  (click)="openLoginModal(); closeMenu()"
                  class="w-full text-sm font-semibold justify-center bg-cq-primary/15 text-cq-primary border border-cq-primary/30 inline-flex items-center gap-2 py-2.5 rounded-xl transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  Iniciar Sesión con Correo
                </button>

                <button
                  (click)="loginWithGoogle(); closeMenu()"
                  class="w-full text-sm font-semibold justify-center bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-sm inline-flex items-center gap-2 py-2.5 rounded-xl transition-all">
                  <svg class="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Iniciar con Google
                </button>

                <button
                  (click)="loginWithDiscord(); closeMenu()"
                  class="btn-primary w-full text-sm justify-center bg-[#5865F2] hover:bg-[#4752C4] border-none text-white shadow-md inline-flex items-center gap-2 py-2.5">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                  Iniciar con Discord
                </button>
              </div>
            }
          </div>
        </div>
      }
    </nav>

    <!-- Email/Password Login Modal (WI-020) -->
    @if (loginModalOpen()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
           (click)="closeLoginModal()">
        <div class="relative w-full max-w-sm sm:max-w-md bg-cq-surface border border-cq-border rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
             (click)="$event.stopPropagation()">
          <!-- Close Button -->
          <button
            (click)="closeLoginModal()"
            class="absolute top-4 right-4 p-2 rounded-lg text-cq-muted hover:text-cq-text hover:bg-cq-surface-hover transition-colors"
            aria-label="Cerrar modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-12 h-12 rounded-2xl bg-cq-primary/15 text-cq-primary flex items-center justify-center mx-auto mb-3 border border-cq-primary/25">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-cq-text">Iniciar Sesión</h3>
            <p class="text-xs text-cq-muted mt-1">Ingresa con tu correo y contraseña</p>
          </div>

          <!-- Error Banner -->
          @if (loginError()) {
            <div class="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ loginError() }}</span>
            </div>
          }

          <!-- Form -->
          <form (submit)="$event.preventDefault(); submitCredentialsLogin()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                #emailInput
                [value]="loginEmail()"
                (input)="loginEmail.set(emailInput.value); loginError.set(null)"
                placeholder="ejemplo@codequest.dev"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-cq-text uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  #passwordInput
                  [value]="loginPassword()"
                  (input)="loginPassword.set(passwordInput.value); loginError.set(null)"
                  placeholder="Tu contraseña"
                  required
                  class="w-full px-4 py-2.5 pr-10 rounded-xl bg-cq-surface-hover/60 border border-cq-border text-cq-text placeholder-cq-muted/50 focus:outline-none focus:border-cq-primary focus:ring-1 focus:ring-cq-primary transition-all text-sm" />
                <button
                  type="button"
                  (click)="toggleShowPassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-cq-muted hover:text-cq-text">
                  @if (showPassword()) {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="isSubmitting() || !loginEmail() || !loginPassword()"
              class="w-full py-2.5 mt-2 rounded-xl bg-cq-primary text-cq-dark font-bold text-sm hover:bg-cq-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
              @if (isSubmitting()) {
                <div class="w-4 h-4 border-2 border-cq-dark/30 border-t-cq-dark rounded-full animate-spin"></div>
                <span>Iniciando sesión...</span>
              } @else {
                <span>Entrar</span>
              }
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-5">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-cq-border"></div></div>
            <div class="relative flex justify-center text-xs uppercase"><span class="bg-cq-surface px-2 text-cq-muted">O continúa con</span></div>
          </div>

          <!-- External OAuth Buttons inside modal -->
          <div class="grid grid-cols-2 gap-3">
            <button
              (click)="loginWithGoogle(); closeLoginModal()"
              class="px-3 py-2 rounded-xl text-xs font-semibold bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-sm inline-flex items-center justify-center gap-2 transition-all">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              Google
            </button>
            <button
              (click)="loginWithDiscord(); closeLoginModal()"
              class="px-3 py-2 rounded-xl text-xs font-semibold bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-sm inline-flex items-center justify-center gap-2 transition-all">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              Discord
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isLoading = this.authService.isLoading;

  readonly menuOpen = signal(false);
  readonly userDropdownOpen = signal(false);

  // Email/Password login modal state (WI-020)
  readonly loginModalOpen = signal(false);
  readonly loginEmail = signal('');
  readonly loginPassword = signal('');
  readonly loginError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen.update((v) => !v);
  }

  closeUserDropdown(): void {
    this.userDropdownOpen.set(false);
  }

  openLoginModal(): void {
    this.loginModalOpen.set(true);
    this.loginError.set(null);
  }

  closeLoginModal(): void {
    this.loginModalOpen.set(false);
    this.loginError.set(null);
    this.isSubmitting.set(false);
  }

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }

  submitCredentialsLogin(): void {
    const email = this.loginEmail().trim();
    const password = this.loginPassword();

    if (!email || !password) {
      this.loginError.set('Por favor completa todos los campos.');
      return;
    }

    this.isSubmitting.set(true);
    this.loginError.set(null);

    this.authService.loginWithCredentials(email, password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeLoginModal();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.loginError.set(err?.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      },
    });
  }

  loginWithDiscord(): void {
    this.authService.loginWithDiscord();
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  mockLogin(role: 'student' | 'admin' = 'student'): void {
    this.authService.mockLogin(undefined, role).subscribe();
  }

  mockGoogleLogin(role: 'student' | 'admin' = 'student'): void {
    this.authService.mockGoogleLogin(undefined, undefined, role).subscribe();
  }

  toggleRole(): void {
    const newRole = this.user()?.role === 'admin' ? 'student' : 'admin';
    this.authService.switchRole(newRole);
    this.closeUserDropdown();
  }

  logout(): void {
    this.closeUserDropdown();
    this.authService.logout();
  }
}
