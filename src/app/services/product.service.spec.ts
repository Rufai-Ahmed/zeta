import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { StorageService } from './storage.service';
import { Product } from '../models/product.interface';
import { StorageKeys } from '../shared/storage-keys.enum';

describe('ProductService', () => {
  let httpMock: HttpTestingController;
  let storageService: jasmine.SpyObj<StorageService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Test Product 1',
      slug: 'test-product-1',
      description: 'Test Description 1',
      price: 99.99,
      image: 'test-image-1.jpg',
      category: 'Electronics',
      inStock: true,
      rating: 4.5,
      reviews: 10,
      features: ['Feature 1', 'Feature 2']
    },
    {
      id: 2,
      name: 'Test Product 2',
      slug: 'test-product-2',
      description: 'Test Description 2',
      price: 149.99,
      image: 'test-image-2.jpg',
      category: 'Clothing',
      inStock: false,
      rating: 4.0,
      reviews: 5,
      features: ['Feature 3']
    }
  ];

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: StorageService, useValue: storageServiceSpy }]
    });
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    storageService.getItem.and.returnValue([]);
    const service = TestBed.runInInjectionContext(() => new ProductService());
    const req = httpMock.expectOne('assets/data/products.json');
    req.flush([]);
    expect(service).toBeTruthy();
  });

  it('should load products from cache if available', () => {
    storageService.getItem.and.returnValue(mockProducts);
    const service = TestBed.runInInjectionContext(() => new ProductService());
    service.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
    httpMock.expectNone('assets/data/products.json');
  });

  it('should load products from HTTP if cache is empty', done => {
    storageService.getItem.and.returnValue(null);
    const service = TestBed.runInInjectionContext(() => new ProductService());
    const req = httpMock.expectOne('assets/data/products.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
    service.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
      expect(storageService.setItem).toHaveBeenCalledWith(StorageKeys.PRODUCTS, mockProducts);
      done();
    });
  });

  it('should handle HTTP error gracefully', done => {
    storageService.getItem.and.returnValue(null);
    const service = TestBed.runInInjectionContext(() => new ProductService());
    const req = httpMock.expectOne('assets/data/products.json');
    req.error(new ErrorEvent('Network error'));
    service.error$.subscribe(error => {
      expect(error).toBe('Failed to load products. Please try again later.');
      done();
    });
  });

  it('should get product by slug', () => {
    storageService.getItem.and.returnValue(mockProducts);
    const service = TestBed.runInInjectionContext(() => new ProductService());
    service.getProductBySlug('test-product-1').subscribe(product => {
      expect(product).toEqual(mockProducts[0]);
    });
    httpMock.expectNone('assets/data/products.json');
  });

  it('should return null for non-existent slug', () => {
    storageService.getItem.and.returnValue(mockProducts);
    const service = TestBed.runInInjectionContext(() => new ProductService());
    service.getProductBySlug('non-existent').subscribe(product => {
      expect(product).toBeNull();
    });
    httpMock.expectNone('assets/data/products.json');
  });

  it('should filter products by category', () => {
    storageService.getItem.and.returnValue(mockProducts);
    const service = TestBed.runInInjectionContext(() => new ProductService());
    service.getProductsByCategory('Electronics').subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].category).toBe('Electronics');
    });
    httpMock.expectNone('assets/data/products.json');
  });

  it('should search products by name and description', done => {
    storageService.getItem.and.returnValue(mockProducts);
    const service = TestBed.runInInjectionContext(() => new ProductService());
    let completed = 0;
    service.products$.subscribe(() => {
      service.searchProducts('Test').subscribe(products => {
        expect(products.length).toBe(2);
        completed++;
        if (completed === 2) done();
      });
      service.searchProducts('Product').subscribe(products => {
        expect(products.length).toBe(2);
        completed++;
        if (completed === 2) done();
      });
    });
    httpMock.expectNone('assets/data/products.json');
  });
});
