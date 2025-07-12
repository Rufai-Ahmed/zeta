import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { LoadingSpinnerComponent } from '../../components/ui/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../components/ui/error-message/error-message.component';
import { SearchFilterComponent } from '../../components/ui/search-filter/search-filter.component';
import { ROUTE_URLS } from '../../shared/route-paths';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'zt-catalogue',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatGridListModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SearchFilterComponent,
    AsyncPipe,
    MatIconModule
  ],
  templateUrl: './catalogue.component.html'
})
export class CatalogueComponent implements OnInit {
  products$: Observable<Product[]> = new Observable();
  filteredProducts$: Observable<Product[]> = new Observable();
  loading$: Observable<boolean> = new Observable();
  error$: Observable<string | null> = new Observable();
  readonly ROUTE_URLS = ROUTE_URLS;

  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.filteredProducts$ = this.getFilteredProducts();
    this.loading$ = this.productService.loading$;
    this.error$ = this.productService.error$;
  }

  private getFilteredProducts(): Observable<Product[]> {
    return combineLatest([
      this.products$,
      this.route.queryParams.pipe(debounceTime(300), distinctUntilChanged())
    ]).pipe(map(([products, params]) => this.applyFilters(products, params)));
  }

  private applyFilters(products: Product[], params: any): Product[] {
    let filteredProducts = [...products];

    if (params['search']) {
      const query = params['search'].toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    if (params['category']) {
      filteredProducts = filteredProducts.filter(
        product => product.category === params['category']
      );
    }

    if (params['minPrice']) {
      filteredProducts = filteredProducts.filter(product => product.price >= +params['minPrice']);
    }

    if (params['maxPrice']) {
      filteredProducts = filteredProducts.filter(product => product.price <= +params['maxPrice']);
    }

    if (params['inStock'] === 'true') {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    const sortBy = params['sortBy'] || 'name';
    const sortOrder = params['sortOrder'] || 'asc';

    filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'reviews':
          aValue = a.reviews;
          bValue = b.reviews;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredProducts;
  }

  getProductUrl(slug: string): string {
    return ROUTE_URLS.PRODUCT_DETAIL(slug);
  }

  updateFilters(filters: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filters,
      queryParamsHandling: 'merge'
    });
  }

  clearFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }
}
