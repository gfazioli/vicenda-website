/**
 * Whether something introduced in `since` is still new when the app is at
 * `current`: within `window` minor releases of it. `config.app.version` is
 * bumped by release.sh on every release, so a badge keyed on this comes off
 * on its own. findergit.app's feature cards decay the same way
 * (its `components/Welcome/recent.ts`).
 *
 * A different major is never "recent", and a `since` ahead of `current` is not
 * either.
 */
export function isRecent(since: string, current: string, window = 2): boolean {
  const a = parse(since);
  const b = parse(current);
  if (!a || !b) return false;
  if (a.major !== b.major) return false;
  const distance = b.minor - a.minor;
  return distance >= 0 && distance <= window;
}

function parse(version: string): { major: number; minor: number } | null {
  const m = /^(\d+)\.(\d+)(?:\.(\d+))?$/.exec(version.trim());
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]) };
}
