import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart.interface';
import { CartService } from '../../services/cart.service';
import { SeoService } from '../../services/seo.service';
import { ToastService } from '../../components/ui/toast/toast.service';
import { ROUTE_URLS } from '../../shared/route-paths';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'zt-cart',
  standalone: true,
  imports: [RouterLink, ButtonComponent, MatIconModule, MatCardModule, MatDividerModule, AsyncPipe],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart> = new Observable();
  readonly ROUTE_URLS = ROUTE_URLS;

  private cartService = inject(CartService);
  private seoService = inject(SeoService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.seoService.setCartSEO();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.toastService.showToast('Item removed from cart', 'success');
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.toastService.showToast('Cart cleared', 'success');
  }
}
