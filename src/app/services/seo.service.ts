import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Product } from '../models/product.interface';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: StructuredData;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export interface ProductStructuredData extends StructuredData {
  '@type': 'Product';
  name: string;
  description: string;
  image: string;
  category: string;
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
}

export interface OrganizationStructuredData extends StructuredData {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    '@type': 'PostalAddress';
    addressCountry: string;
  };
  contactPoint: {
    '@type': 'ContactPoint';
    contactType: string;
    availableLanguage: string;
  };
  sameAs: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  private defaultSEO: SEOData = {
    title: 'Zeta Commerce - Quality Products Online',
    description:
      'Discover our carefully curated selection of quality products including electronics, accessories, and lifestyle items. Fast shipping and secure payments.',
    keywords: 'ecommerce, shopping, products, electronics, accessories, lifestyle, online store',
    author: 'Zeta Commerce',
    ogTitle: 'Zeta Commerce - Quality Products Online',
    ogDescription:
      'Discover our carefully curated selection of quality products including electronics, accessories, and lifestyle items.',
    ogImage: '/assets/logo.png',
    ogUrl: 'https://zeta-one.vercel.app',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Zeta Commerce - Quality Products Online',
    twitterDescription:
      'Discover our carefully curated selection of quality products including electronics, accessories, and lifestyle items.',
    twitterImage: '/assets/logo.png'
  };

  constructor() {
    this.setDefaultSEO();
  }

  private setDefaultSEO(): void {
    this.updateSEO(this.defaultSEO);
  }

  updateSEO(data: SEOData): void {
    if (data.title) {
      this.titleService.setTitle(data.title);
    }

    if (data.description) {
      this.metaService.updateTag({ name: 'description', content: data.description });
    }

    if (data.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: data.keywords });
    }

    if (data.author) {
      this.metaService.updateTag({ name: 'author', content: data.author });
    }

    if (data.ogTitle) {
      this.metaService.updateTag({ property: 'og:title', content: data.ogTitle });
    }

    if (data.ogDescription) {
      this.metaService.updateTag({ property: 'og:description', content: data.ogDescription });
    }

    if (data.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: data.ogImage });
    }

    if (data.ogUrl) {
      this.metaService.updateTag({ property: 'og:url', content: data.ogUrl });
    }

    if (data.ogType) {
      this.metaService.updateTag({ property: 'og:type', content: data.ogType });
    }

    if (data.twitterCard) {
      this.metaService.updateTag({ name: 'twitter:card', content: data.twitterCard });
    }

    if (data.twitterTitle) {
      this.metaService.updateTag({ name: 'twitter:title', content: data.twitterTitle });
    }

    if (data.twitterDescription) {
      this.metaService.updateTag({ name: 'twitter:description', content: data.twitterDescription });
    }

    if (data.twitterImage) {
      this.metaService.updateTag({ name: 'twitter:image', content: data.twitterImage });
    }

    if (data.canonicalUrl) {
      this.updateCanonicalUrl(data.canonicalUrl);
    }

    if (data.structuredData) {
      this.addStructuredData(data.structuredData);
    }
  }

  private updateCanonicalUrl(url: string): void {
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = url;
    document.head.appendChild(link);
  }

  private addStructuredData(data: StructuredData): void {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  setProductSEO(product: Product): void {
    const seoData: SEOData = {
      title: `${product.name} - ₦${(product.price / 100).toLocaleString()} | Zeta Commerce`,
      description: `${product.description} Buy ${product.name} for ₦${(
        product.price / 100
      ).toLocaleString()}. ${product.features?.slice(0, 3).join(', ')}`,
      keywords: `${product.name}, ${product.category}, ${product.features?.join(', ')}, buy online`,
      ogTitle: `${product.name} - ₦${(product.price / 100).toLocaleString()}`,
      ogDescription: product.description,
      ogImage: product.image,
      ogType: 'product',
      twitterTitle: `${product.name} - ₦${(product.price / 100).toLocaleString()}`,
      twitterDescription: product.description,
      twitterImage: product.image,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        brand: {
          '@type': 'Brand',
          name: 'Zeta Commerce'
        },
        offers: {
          '@type': 'Offer',
          price: (product.price / 100).toFixed(2),
          priceCurrency: 'NGN',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `https://zeta-one.vercel.app/product/${product.slug}`
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviews
        }
      } as ProductStructuredData
    };

    this.updateSEO(seoData);
  }

  setCategorySEO(category: string): void {
    const seoData: SEOData = {
      title: `${category} Products - Zeta Commerce`,
      description: `Browse our collection of ${category.toLowerCase()} products. Quality items with fast shipping and secure payments.`,
      keywords: `${category.toLowerCase()}, products, ${category.toLowerCase()} items, online shopping`,
      ogTitle: `${category} Products - Zeta Commerce`,
      ogDescription: `Browse our collection of ${category.toLowerCase()} products. Quality items with fast shipping.`,
      ogType: 'website',
      twitterTitle: `${category} Products - Zeta Commerce`,
      twitterDescription: `Browse our collection of ${category.toLowerCase()} products. Quality items with fast shipping.`
    };

    this.updateSEO(seoData);
  }

  setCartSEO(): void {
    const seoData: SEOData = {
      title: 'Shopping Cart - Zeta Commerce',
      description:
        'Review your shopping cart items. Secure checkout with multiple payment options including Paystack.',
      keywords: 'shopping cart, checkout, payment, secure checkout',
      ogTitle: 'Shopping Cart - Zeta Commerce',
      ogDescription:
        'Review your shopping cart items. Secure checkout with multiple payment options.',
      ogType: 'website',
      twitterTitle: 'Shopping Cart - Zeta Commerce',
      twitterDescription:
        'Review your shopping cart items. Secure checkout with multiple payment options.'
    };

    this.updateSEO(seoData);
  }

  setCheckoutSEO(): void {
    const seoData: SEOData = {
      title: 'Checkout - Secure Payment - Zeta Commerce',
      description:
        'Complete your purchase securely with Paystack. Fast and secure payment processing.',
      keywords: 'checkout, payment, secure payment, paystack, online payment',
      ogTitle: 'Checkout - Secure Payment - Zeta Commerce',
      ogDescription:
        'Complete your purchase securely with Paystack. Fast and secure payment processing.',
      ogType: 'website',
      twitterTitle: 'Checkout - Secure Payment - Zeta Commerce',
      twitterDescription:
        'Complete your purchase securely with Paystack. Fast and secure payment processing.'
    };

    this.updateSEO(seoData);
  }

  resetSEO(): void {
    this.setDefaultSEO();
  }
}
