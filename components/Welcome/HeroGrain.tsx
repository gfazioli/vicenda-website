'use client';

import { Scene } from '@gfazioli/mantine-scene';

/**
 * The hero's grain, the one piece of it that has to be a client component:
 * `Scene.Noise` is a static property of a client component, which a server
 * component cannot reach through the client reference it gets.
 *
 * NOT decoration: a wide dark gradient BANDS on an 8-bit display, and 3% of
 * noise breaks the steps without reading as texture. `Scene` honours Reduce
 * Motion, and its one layer here does not move.
 */
export function HeroGrain() {
  return (
    <Scene reducedMotion="auto">
      <Scene.Noise opacity={0.03} grain={0.8} octaves={2} />
    </Scene>
  );
}
