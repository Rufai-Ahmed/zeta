import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../services/cart.service';
import { ROUTE_URLS } from '../../../shared/route-paths';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { ThemeToggleComponent } from '../../ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'zt-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    AsyncPipe,
    ThemeToggleComponent
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  cartItemCount$: Observable<number> = new Observable();
  readonly ROUTE_URLS = ROUTE_URLS;

  isMobileMenuOpen = false;

  private cartService = inject(CartService);

  ngOnInit(): void {
    this.cartItemCount$ = this.cartService.cart$.pipe(map(cart => cart.itemCount));
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
