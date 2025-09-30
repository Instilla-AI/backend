'use client';

import PricingTable from '@/components/autumn/pricing-table';
import StaticPricingTable from '@/components/static-pricing-table';
import { useSession } from '@/lib/auth-client';

// Static product details
const staticProducts = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out our service",
    price: {
      primaryText: "Free",
      secondaryText: "100 credits included"
    },
    items: [
      { 
        primaryText: "100 credits per month",
        secondaryText: "For AI chat and brand monitoring"
      },
      {
        primaryText: "Community support",
        secondaryText: "Get help from our community"
      },
      {
        primaryText: "Basic features",
        secondaryText: "Essential tools to get started"
      }
    ]
  },
  {
    id: "pro",
    name: "Pro",
    description: "Coming soon - Contact us for enterprise pricing",
    recommendText: "Most Popular",
    price: {
      primaryText: "Contact Us",
      secondaryText: "Custom pricing"
    },
    items: [
      { 
        primaryText: "Unlimited credits",
        secondaryText: "No limits on usage"
      },
      {
        primaryText: "Priority support",
        secondaryText: "Get help from our team"
      },
      {
        primaryText: "Advanced features",
        secondaryText: "Access to all features"
      }
    ]
  }
];

export default function PricingPage() {
  const { data: session } = useSession();
  const autumnEnabled = process.env.NEXT_PUBLIC_AUTUMN_ENABLED === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-[3rem] lg:text-[4.5rem] font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-tr from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Simple, transparent pricing
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            {session 
              ? "You're currently on the Free plan with 100 credits. Check your dashboard for usage details."
              : "Choose the perfect plan for your needs. Always flexible to scale up or down."
            }
          </p>
          {session && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-zinc-500">
                Logged in as: {session.user?.email}
              </p>
              <p className="text-sm text-green-600 font-medium">
                ✓ Free Plan Active - 100 Credits Available
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[20px] shadow-xl p-8 border border-zinc-200">
          {/* Use Autumn pricing table only if enabled and user is logged in */}
          {session && autumnEnabled ? (
            <PricingTable />
          ) : (
            <StaticPricingTable products={staticProducts} />
          )}
        </div>
      </div>
    </div>
  );
}