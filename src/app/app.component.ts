import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ThemeService } from './services/theme.service';
import { ToastComponent } from './components/ui/toast/toast.component';

@Component({
  selector: 'zt-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Zeta Commerce';
  private themeService = inject(ThemeService);

}
