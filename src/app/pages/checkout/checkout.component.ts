import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cart } from '../../models/cart.interface';
import { CartService } from '../../services/cart.service';
import { StorageService } from '../../services/storage.service';
import { SeoService } from '../../services/seo.service';
import { ToastService } from '../../components/ui/toast/toast.service';
import { ROUTE_URLS } from '../../shared/route-paths';
import { AsyncPipe } from '@angular/common';
import { InputComponent } from '../../components/ui/input/input.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { environment } from '../../../environments/environment';
import { StorageKeys } from '../../shared/storage-keys.enum';
import { DestroyAbleComponent } from '../../shared/destroy-able.component';

interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value?: string | null;
}

interface PaystackMetadata {
  custom_fields: PaystackCustomField[];
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  metadata: PaystackMetadata;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackResponse {
  reference: string;
  status: string;
  [key: string]: unknown;
}

declare var PaystackPop: {
  setup(options: PaystackSetupOptions): PaystackHandler;
};

@Component({
  selector: 'zt-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent extends DestroyAbleComponent implements OnInit {
  private cartService = inject(CartService);
  private storageService = inject(StorageService);
  private seoService = inject(SeoService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  cart$: Observable<Cart> = new Observable();
  isProcessing = false;
  checkoutForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', Validators.required],
    country: ['']
  });

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.seoService.setCheckoutSEO();
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.toastService.showToast('Please fill in all required fields', 'error');
      return;
    }

    this.isProcessing = true;
    const formData = this.checkoutForm.value;

    this.cart$.pipe(takeUntil(this.dead$)).subscribe(cart => {
      if (cart.total <= 0) {
        this.isProcessing = false;
        this.toastService.showToast('Cart is empty', 'error');
        return;
      }

      const amount = Math.round(cart.total * 100);
      if (!Number.isInteger(amount) || amount <= 0) {
        this.isProcessing = false;
        this.toastService.showToast('Invalid amount for payment', 'error');
        return;
      }

      const handler = PaystackPop.setup({
        key: environment.paystackPublicKey,
        email: formData.email!,
        amount: amount,
        currency: 'NGN',
        metadata: {
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: `${formData.firstName} ${formData.lastName}`
            },
            {
              display_name: 'Phone',
              variable_name: 'phone',
              value: formData.phone || 'N/A'
            },
            {
              display_name: 'Address',
              variable_name: 'address',
              value: formData.address
            }
          ]
        },
        callback: (response: PaystackResponse) => {
          this.onPaymentSuccess(response, cart);
        },
        onClose: () => {
          this.isProcessing = false;
          this.toastService.showToast('Payment cancelled', 'error');
        }
      });

      handler.openIframe();
    });
  }

  private onPaymentSuccess(response: PaystackResponse, cart: Cart): void {
    const orderId = this.generateOrderId();
    this.storageService.setItem(StorageKeys.LAST_ORDER_ID, orderId);
    this.cartService.clearCart();
    this.isProcessing = false;
    this.toastService.showToast('Payment successful! Order placed.', 'success');
    this.router.navigate([ROUTE_URLS.SUCCESS]);
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
  }
}
