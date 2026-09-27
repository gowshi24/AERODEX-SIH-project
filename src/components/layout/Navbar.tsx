'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Search, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Search Flights', href: '/search' },
    { name: 'Price Trends', href: '/trends' },
    { name: 'Airfare Index', href: '/airfare-index' },
    { name: 'Anomalies', href: '/anomalies' },
    { name: 'CPI Insights', href: '/cpi-insights' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: BRAND LOGO + AVIATION ICON */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-xl font-black tracking-wider text-slate-900 font-sans">
                  AERO<span className="text-blue-600">DEX</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              </div>
              <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase hidden sm:inline-block">
                Track. Compare. Understand Airfare.
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center space-x-1 font-semibold text-xs text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/search"
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Search Flights"
            >
              <Search className="w-4.5 h-4.5" />
            </Link>

            <Link href="/login">
              <Button variant="outline" size="sm" className="font-bold border-slate-300">
                Sign In
              </Button>
            </Link>

            <Link href="/book">
              <Button variant="primary" size="sm" className="shadow-xs font-bold">
                Book Now
              </Button>
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link href="/book">
              <Button variant="primary" size="sm" className="px-2.5 py-1 text-xs">
                Book Now
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SLIDE-OUT MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-bold ${
                isActive(link.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
