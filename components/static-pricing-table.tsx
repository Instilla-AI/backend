'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PriceItem {
  primaryText: string;
  secondaryText: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  recommendText?: string;
  price: {
    primaryText: string;
    secondaryText: string;
  };
  items: PriceItem[];
}

interface StaticPricingTableProps {
  products: Product[];
}

export default function StaticPricingTable({ products }: StaticPricingTableProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {products.map((product) => (
        <div
          key={product.id}
          className={`relative rounded-2xl border p-8 ${
            product.recommendText
              ? 'border-orange-500 shadow-lg'
              : 'border-zinc-200'
          }`}
        >
          {product.recommendText && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                {product.recommendText}
              </span>
            </div>
          )}
          
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <p className="text-zinc-600 text-sm mb-4">{product.description}</p>
            <div className="mb-2">
              <span className="text-4xl font-bold">{product.price.primaryText}</span>
            </div>
            <p className="text-zinc-500 text-sm">{product.price.secondaryText}</p>
          </div>

          <ul className="space-y-4 mb-8">
            {product.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="font-medium">{item.primaryText}</p>
                  <p className="text-sm text-zinc-600">{item.secondaryText}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link href="/sign-up" className="block">
            <Button
              className={`w-full ${
                product.recommendText
                  ? 'bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500'
                  : ''
              }`}
              variant={product.recommendText ? 'default' : 'outline'}
            >
              Get Started
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
