import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { StorageKeys } from '../../shared/storage-keys.enum';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'zt-success',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './success.component.html'
})
export class SuccessComponent implements OnInit {
  public orderId: string | null = null;

  private storageService = inject(StorageService);

  ngOnInit(): void {
    this.orderId = this.storageService.getItem<string>(StorageKeys.LAST_ORDER_ID);
  }
}
