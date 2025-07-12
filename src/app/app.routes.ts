import { Routes } from '@angular/router';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { SuccessComponent } from './pages/success/success.component';
import { ROUTE_PATHS } from './shared/route-paths';

export const routes: Routes = [
  { path: ROUTE_PATHS.CATALOGUE, component: CatalogueComponent },
  { path: ROUTE_PATHS.PRODUCT_DETAIL, component: ProductDetailComponent },
  { path: ROUTE_PATHS.CART, component: CartComponent },
  { path: ROUTE_PATHS.CHECKOUT, component: CheckoutComponent },
  { path: ROUTE_PATHS.SUCCESS, component: SuccessComponent },
  { path: ROUTE_PATHS.WILDCARD, redirectTo: ROUTE_PATHS.CATALOGUE }
];
