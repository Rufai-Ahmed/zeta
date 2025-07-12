import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Cart } from '../models/cart.interface';
import { Product } from '../models/product.interface';
import { StorageService } from './storage.service';
import { StorageKeys } from '../shared/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageService = inject(StorageService);
  private cartSubject = new BehaviorSubject<Cart>(this.getInitialCart());
  cart$ = this.cartSubject.asObservable();

  private getInitialCart(): Cart {
    const savedCart = this.storageService.getItem<CartItem[]>(StorageKeys.CART);
    return this.calculateCart(savedCart || []);
  }

  private calculateCart(items: CartItem[]): Cart {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return {
      items,
      subtotal,
      total: subtotal,
      itemCount
    };
  }

  private updateCart(items: CartItem[]): void {
    const cart = this.calculateCart(items);
    this.cartSubject.next(cart);
    this.storageService.setItem(StorageKeys.CART, items);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);

    let newItems: CartItem[];
    if (existingItemIndex > -1) {
      newItems = [...currentCart.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity
      };
    } else {
      newItems = [...currentCart.items, { product, quantity }];
    }

    this.updateCart(newItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const newItems = currentCart.items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    this.updateCart(newItems);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const newItems = currentCart.items.filter(item => item.product.id !== productId);
    this.updateCart(newItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }
}
