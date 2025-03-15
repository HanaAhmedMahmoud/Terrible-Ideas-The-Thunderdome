import {Suspense} from 'react';
import Stats from '../components/stats';

export default function StatsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stats />
    </Suspense>
  );
}

