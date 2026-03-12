"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

const tiers = [
  {
    name: "Zen Basic",
    price: 199,
    features: ["3 Games per month", "0 AAA Games", "Standard Support", "Instant delivery"],
    highlight: false,
  },
  {
    name: "Zen Premium",
    price: 499,
    features: ["10 Games per month", "3 AAA Games", "Priority Support", "Instant Delivery"],
    highlight: true,
  },
  {
    name: "Zen Premium+",
    price: 999,
    features: ["20 Games per month", "10 AAA Games", "24/7 Premium Support", "Instant Delivery"],
    highlight: false,
  },
];

export default function Subscriptions() {
  const { data: session } = useSession();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handlePayment = async (tierName: string, amount: number) => {
    if (!session) {
      signIn("google");
      return;
    }

    setLoadingTier(tierName);

    try {
      // 1. Create Order
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { order } = await res.json();

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Gigazen",
        description: `Rent ${tierName}`,
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          setLoadingTier(null);
        },
        prefill: {
          name: session.user?.name || "Player One",
          email: session.user?.email || "player@example.com",
        },
        theme: {
          color: "#8b5cf6",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on("payment.failed", function (response: any) {
        alert("Payment Failed. Please try again.");
        setLoadingTier(null);
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen py-32 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Choose Your <span className="text-primary">Arsenal</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            Unlock the ultimate gaming library. Cancel anytime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                tier.highlight 
                  ? "bg-gradient-to-b from-primary/10 to-transparent border-primary shadow-[0_0_30px_rgba(139,92,246,0.15)] md:-translate-y-4" 
                  : "glass-card hover:bg-white/[0.03] transition-colors"
              } border-2`}
              style={!tier.highlight ? { borderColor: 'rgba(255,255,255,0.08)' } : {}}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-bold rounded-full glow-effect">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold pb-2">₹{tier.price}</span>
                  <span className="text-gray-400 font-medium">/mo</span>
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(tier.name, tier.price)}
                disabled={loadingTier !== null}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${
                  tier.highlight
                    ? "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 glow-effect"
                    : "glass hover:bg-white/10 text-white"
                } disabled:opacity-50`}
              >
                {loadingTier === tier.name ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                ) : (
                  "Rent Now"
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
