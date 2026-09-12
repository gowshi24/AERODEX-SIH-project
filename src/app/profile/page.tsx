'use client';

import React from 'react';
import Link from 'next/link';
import { User, Bell, Heart, History, Settings, ShieldCheck, Mail, Plane } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* PROFILE HEADER CARD */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-2xl text-white shadow-lg">
            RS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-white">Rahul Sharma</h1>
              <Badge variant="cyan" size="sm">
                Pro Analyst
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1 flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1" />
              rahul.sharma@example.com
            </p>
          </div>
        </div>

        <Link href="/settings">
          <Button variant="outline" size="sm" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-800">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
        </Link>
      </div>

      {/* SECTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SAVED ROUTES & FARE ALERTS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-extrabold text-slate-900">Active Price Alerts</h2>
            </div>
            <Badge variant="blue" size="sm">
              2 Active
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">DEL → BOM</span>
                <span className="text-slate-500 font-medium">Alert when fare &lt; ₹4,800</span>
              </div>
              <Badge variant="emerald" size="sm">
                Monitoring
              </Badge>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">DEL → BLR</span>
                <span className="text-slate-500 font-medium">Alert on &gt;10% price drop</span>
              </div>
              <Badge variant="emerald" size="sm">
                Monitoring
              </Badge>
            </div>
          </div>
        </div>

        {/* SEARCH HISTORY */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-cyan-600" />
              <h2 className="text-base font-extrabold text-slate-900">Recent Searches</h2>
            </div>
            <Link href="/search" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              New Search
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <Link href="/results?from=DEL&to=BOM" className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-blue-300 block">
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">New Delhi (DEL) → Mumbai (BOM)</span>
                <span className="text-slate-500 font-medium">Searched 2 hours ago</span>
              </div>
              <Plane className="w-4 h-4 text-blue-600 transform -rotate-45" />
            </Link>

            <Link href="/results?from=BOM&to=BLR" className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-blue-300 block">
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">Mumbai (BOM) → Bengaluru (BLR)</span>
                <span className="text-slate-500 font-medium">Searched Yesterday</span>
              </div>
              <Plane className="w-4 h-4 text-blue-600 transform -rotate-45" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
