'use client';

import React, { Suspense } from 'react';
import { BookContent } from '../../components/booking/BookContent';

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-500">Loading booking options...</div>}>
      <BookContent />
    </Suspense>
  );
}
