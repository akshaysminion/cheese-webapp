import { Suspense, lazy } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const CheeseHero3D = lazy(() => import('./CheeseHero3D').then((m) => ({ default: m.CheeseHero3D })));

export function LazyCheeseHero3D({ compact }: { compact?: boolean }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className={compact ? 'hero3d hero3dCompact' : 'hero3d'} aria-hidden />}>
        <CheeseHero3D compact={compact} />
      </Suspense>
    </ErrorBoundary>
  );
}
