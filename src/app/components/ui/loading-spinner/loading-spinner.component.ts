import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'zt-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex justify-center items-center p-8">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `
})
export class LoadingSpinnerComponent {}
