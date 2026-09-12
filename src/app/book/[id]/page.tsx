'use client';

import React, { Suspense, use } from 'react';
import { BookContent } from '../page';

function BookIdPageInner({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  return <BookContent explicitFlightId={id} />;
}

export default function BookIdPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-500">Loading booking options...</div>}>
      <BookIdPageInner paramsPromise={params} />
    </Suspense>
  );
}
