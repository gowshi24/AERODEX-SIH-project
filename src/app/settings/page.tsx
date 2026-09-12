'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Bell, Shield, Globe, Database, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [anomalyNotifications, setAnomalyNotifications] = useState(true);
  const [currency, setCurrency] = useState('INR');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* BACK BUTTON */}
      <Link
        href="/profile"
        className="inline-flex items-center space-x-2 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Profile</span>
      </Link>

      {/* TITLE & HEADER */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-black uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Account & System Settings</h1>
        <p className="text-xs text-slate-600 font-medium">
          Manage alert triggers, currency formatting, and analytical index display options.
        </p>
      </div>

      {/* SETTINGS CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* SECTION 1: NOTIFICATIONS */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
            <Bell className="w-4 h-4 mr-2 text-blue-600" />
            Notifications & Alerts
          </h2>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 text-xs block">Price Spike Alerts</span>
                <span className="text-slate-500 text-[11px]">Receive email alerts when monitored fares increase abnormally.</span>
              </div>
              <input
                type="checkbox"
                checked={anomalyNotifications}
                onChange={(e) => setAnomalyNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="font-extrabold text-slate-900 text-xs block">Weekly Airfare Index Digest</span>
                <span className="text-slate-500 text-[11px]">Weekly summary of Indian aviation fare trends.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: REGIONAL & CURRENCY */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
            <Globe className="w-4 h-4 mr-2 text-cyan-600" />
            Regional & Currency
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer pt-1"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="primary" size="md" className="font-bold shadow-md">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
