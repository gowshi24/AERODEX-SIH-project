import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'AERODEX — Track. Compare. Understand Airfare | Real-Time Airfare Intelligence Platform',
  description:
    'AERODEX is an Indian airfare price index and flight analytics platform. Monitor price movements, compare fares across airlines & OTAs, and explore CPI-oriented airfare insights.',
  keywords: [
    'AERODEX',
    'Airfare Price Index',
    'India Flights',
    'Flight Analytics',
    'IndiGo',
    'Air India',
    'CPI Airfare',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
