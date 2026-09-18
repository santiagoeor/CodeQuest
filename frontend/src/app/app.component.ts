import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="main-layout">
      <h1>CodeQuest 2026</h1>
      <p>Bienvenido al generador de rutas de aprendizaje de DevTalles.</p>
    </main>
  `,
  styles: [`
    .main-layout {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class AppComponent {
  title = 'codequest-frontend';
}
