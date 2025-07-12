import { Component, OnInit, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { Product } from '../../../models/product.interface';
import { AsyncPipe } from '@angular/common';
import { InputComponent, SelectOption } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DestroyAbleComponent } from '../../../shared/destroy-able.component';

@Component({
  selector: 'zt-search-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatSliderModule,
    MatChipsModule,
    AsyncPipe,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './search-filter.component.html'
})
export class SearchFilterComponent extends DestroyAbleComponent implements OnInit {
  @Input() products$!: Observable<Product[]>;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  filterForm = this.fb.group({
    search: [''],
    category: [''],
    minPrice: [null],
    maxPrice: [null],
    sortBy: ['name'],
    sortOrder: ['asc'],
    inStock: [false]
  });
  categories$: Observable<string[]> = new Observable();
  priceRange$: Observable<{ min: number; max: number }> = new Observable();
  queryParams$: Observable<any> = new Observable();
  categoryOptions: SelectOption[] = [];
  sortByOptions: SelectOption[] = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'reviews', label: 'Reviews' }
  ];
  sortOrderOptions: SelectOption[] = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ];

  ngOnInit(): void {
    this.queryParams$ = this.route.queryParams;

    if (this.products$) {
      this.categories$ = this.products$.pipe(
        map(products => [...new Set(products.map(p => p.category))].sort())
      );
      this.priceRange$ = this.products$.pipe(
        map(products => {
          if (products.length === 0) return { min: 0, max: 0 };
          const prices = products.map(p => p.price);
          return {
            min: Math.min(...prices),
            max: Math.max(...prices)
          };
        })
      );
    }

    this.categories$.pipe(takeUntil(this.dead$)).subscribe(categories => {
      this.categoryOptions = [
        { value: '', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat, label: cat }))
      ];
    });

    this.route.queryParams.pipe(takeUntil(this.dead$)).subscribe(params => {
      this.filterForm.patchValue({
        search: params['search'] || '',
        category: params['category'] || '',
        minPrice: params['minPrice'] || null,
        maxPrice: params['maxPrice'] || null,
        sortBy: params['sortBy'] || 'name',
        sortOrder: params['sortOrder'] || 'asc',
        inStock: params['inStock'] === 'true'
      });
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.dead$))
      .subscribe(values => {
        const queryParams: any = {};

        if (values.search) queryParams.search = values.search;
        if (values.category) queryParams.category = values.category;
        if (values.minPrice) queryParams.minPrice = values.minPrice;
        if (values.maxPrice) queryParams.maxPrice = values.maxPrice;
        if (values.sortBy !== 'name') queryParams.sortBy = values.sortBy;
        if (values.sortOrder !== 'asc') queryParams.sortOrder = values.sortOrder;
        if (values.inStock) queryParams.inStock = values.inStock;

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams
        });
      });
  }

  clearFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  onPriceRangeChange(event: any): void {
    const [minPrice, maxPrice] = event.value;
    this.filterForm.patchValue({ minPrice, maxPrice }, { emitEvent: false });

    const queryParams: any = {};
    if (minPrice) queryParams.minPrice = minPrice;
    if (maxPrice) queryParams.maxPrice = maxPrice;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
