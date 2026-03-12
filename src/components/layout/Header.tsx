"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-15 h-15 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
            <img
              src="/logonew.jpeg"
              alt="Gigazen Logo"
              className="w-15 h-15 rounded-xl object-contain"
            />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Gigazen
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/subscriptions" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Auth Button */}
        <div>
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden sm:block">
                Welcome, {session.user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="px-5 py-2 rounded-full border border-white/10 glass hover:bg-white/10 transition-all text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5) cursor-pointer]"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
