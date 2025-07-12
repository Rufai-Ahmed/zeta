import { Component } from '@angular/core';

@Component({
  selector: 'zt-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
