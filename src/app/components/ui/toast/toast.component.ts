import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { DestroyAbleComponent } from '../../../shared/destroy-able.component';
import { Toast, ToastService } from './toast.service';

@Component({
  selector: 'zt-toast',
  standalone: true,
  imports: [],
  template: ''
})
export class ToastComponent extends DestroyAbleComponent implements OnInit {
  private toastService = inject(ToastService);
  private snackBar = inject(MatSnackBar);

 

  ngOnInit(): void {
    this.toastService.toasts$
      .pipe(takeUntil(this.dead$))
      .subscribe(toasts => {
        toasts.forEach(toast => {
          this.showMaterialToast(toast);
        });
      });
  }

  private showMaterialToast(toast: Toast): void {
    const config = {
      duration: toast.duration || 3000,
      panelClass: [`toast-${toast.type}`]
    };

    this.snackBar.open(toast.message, 'Close', config);
  }
}
