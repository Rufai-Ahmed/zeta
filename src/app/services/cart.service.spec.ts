import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { StorageService } from './storage.service';
import { Product } from '../models/product.interface';
import { take } from 'rxjs/operators';

describe('CartService', () => {
  let service: CartService;
  let storageService: jasmine.SpyObj<StorageService>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test Description',
    price: 99.99,
    image: 'test-image.jpg',
    category: 'Test Category',
    inStock: true,
    rating: 4.5,
    reviews: 10,
    features: ['Feature 1', 'Feature 2']
  };

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);
    storageServiceSpy.getItem.and.returnValue(null); // Default to empty cart

    TestBed.configureTestingModule({
      providers: [CartService, { provide: StorageService, useValue: storageServiceSpy }]
    });

    service = TestBed.inject(CartService);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', done => {
    storageService.getItem.and.returnValue(null);
    service.addToCart(mockProduct, 2);
    service.cart$.pipe(take(1)).subscribe(cart => {
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].product).toEqual(mockProduct);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.total).toBe(199.98);
      done();
    });
  });

  it('should update quantity when adding existing product', done => {
    // Initialize cart with product
    storageService.getItem.and.returnValue(null);
    service.addToCart(mockProduct, 1);
    // Now add again
    service.addToCart(mockProduct, 1);
    service.cart$.pipe(take(1)).subscribe(cart => {
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(2);
      done();
    });
  });

  it('should remove product from cart', done => {
    storageService.getItem.and.returnValue([{ product: mockProduct, quantity: 1 }]);
    service.removeFromCart(mockProduct.id);
    service.cart$.pipe(take(1)).subscribe(cart => {
      expect(cart.items.length).toBe(0);
      expect(cart.total).toBe(0);
      done();
    });
  });

  it('should update product quantity', done => {
    // Initialize cart with product
    storageService.getItem.and.returnValue(null);
    service.addToCart(mockProduct, 2);
    service.updateQuantity(mockProduct.id, 3);
    service.cart$.pipe(take(1)).subscribe(cart => {
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(3);
      expect(cart.total).toBeCloseTo(299.97, 2);
      done();
    });
  });

  it('should clear cart', done => {
    storageService.getItem.and.returnValue([{ product: mockProduct, quantity: 1 }]);
    service.clearCart();
    service.cart$.pipe(take(1)).subscribe(cart => {
      expect(cart.items.length).toBe(0);
      expect(cart.total).toBe(0);
      done();
    });
  });
});
