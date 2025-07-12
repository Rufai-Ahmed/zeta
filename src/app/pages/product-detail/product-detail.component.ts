import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../components/ui/toast/toast.service';
import { LoadingSpinnerComponent } from '../../components/ui/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../components/ui/error-message/error-message.component';
import { ROUTE_URLS } from '../../shared/route-paths';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'zt-product-detail',
  standalone: true,
  imports: [
    ButtonComponent,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    AsyncPipe
  ],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product | null> = new Observable();
  quantity = 1;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.product$ = this.productService.getProductBySlug(slug);
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: Product): void {
    if (!product.inStock) {
      this.toastService.showToast('Product is out of stock', 'error');
      return;
    }
    this.cartService.addToCart(product, this.quantity);
    this.toastService.showToast(`${product.name} added to cart!`, 'success');
  }

  goBack(): void {
    this.router.navigate([ROUTE_URLS.CATALOGUE]);
  }
}
