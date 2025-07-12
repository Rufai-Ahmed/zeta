import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Product } from '../models/product.interface';
import { StorageService } from './storage.service';
import { StorageKeys } from '../shared/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public products$ = this.productsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    const cachedProducts = this.storageService.getItem<Product[]>(StorageKeys.PRODUCTS);

    if (cachedProducts && cachedProducts.length > 0) {
      this.productsSubject.next(cachedProducts);
      return;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http
      .get<Product[]>('assets/data/products.json')
      .pipe(
        tap(products => {
          this.storageService.setItem(StorageKeys.PRODUCTS, products);
          this.productsSubject.next(products);
        }),
        catchError(error => {
          const errorMessage = 'Failed to load products. Please try again later.';
          this.errorSubject.next(errorMessage);
          console.error('Failed to load products:', error);
          return of([]);
        })
      )
      .subscribe({
        complete: () => this.loadingSubject.next(false)
      });
  }

  public getProductBySlug(slug: string): Observable<Product | null> {
    return this.products$.pipe(
      map(products => products.find(product => product.slug === slug) || null)
    );
  }

  public getProductsByCategory(category: string): Observable<Product[]> {
    return this.products$.pipe(map(products => products.filter(p => p.category === category)));
  }

  public searchProducts(query: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products =>
        products.filter(
          p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }
}
