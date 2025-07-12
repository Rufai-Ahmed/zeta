import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../services/theme.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'zt-theme-toggle',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, AsyncPipe],
  templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  public theme$ = this.themeService.theme$;

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
