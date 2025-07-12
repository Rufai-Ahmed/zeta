export const ROUTE_PATHS = {
  HOME: '',
  CATALOGUE: '',
  PRODUCT_DETAIL: 'product/:slug',
  CART: 'cart',
  CHECKOUT: 'checkout',
  SUCCESS: 'success',
  WILDCARD: '**'
} as const;

export const ROUTE_URLS = {
  HOME: '/',
  CATALOGUE: '/',
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  SUCCESS: '/success'
} as const;