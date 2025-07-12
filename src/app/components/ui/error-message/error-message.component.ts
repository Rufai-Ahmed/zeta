import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'zt-error-message',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './error-message.component.html'
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
  @Input() retryAction?: () => void;
}
