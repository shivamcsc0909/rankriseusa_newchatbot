import { useMemo } from 'react';
import { getOrCreateVisitorId } from '../services/visitorSession';

/**
 * Resolves the anonymous visitor ID once per mount.
 * Same browser → same ID (localStorage). No auth.
 */
export function useVisitorSession(): { visitorId: string } {
  const visitorId = useMemo(() => getOrCreateVisitorId(), []);
  return { visitorId };
}
