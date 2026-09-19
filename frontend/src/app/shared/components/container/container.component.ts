import { Component } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: true,
  template: `
    <div class="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <ng-content></ng-content>
    </div>
  `,
})
export class ContainerComponent {}
