import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-cq-border bg-cq-bg">
      <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Left -->
          <div class="flex items-center gap-2 text-sm text-cq-muted">
            <span class="font-semibold text-cq-text">CodeQuest</span>
            <span>&copy; 2026</span>
            <span class="hidden sm:inline">·</span>
            <span class="hidden sm:inline">Hackathon DevTalles</span>
          </div>

          <!-- Right -->
          <div class="flex items-center gap-4 text-sm">
            <a href="https://cursos.devtalles.com" target="_blank" rel="noopener noreferrer"
               class="text-cq-muted hover:text-cq-primary transition-colors">
              DevTalles
            </a>
            <span class="text-cq-border">·</span>
            <span class="text-cq-muted text-xs">
              Docker Compose · Kaddo KDD · MIT
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
