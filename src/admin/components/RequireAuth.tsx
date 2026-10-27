import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { clearAdminKey, getAdminKey } from '@/chat/admin/services/adminSession';
import { validateAdminKey } from '@/admin/lib/adminApi';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const key = getAdminKey();
  const [state, setState] = useState<'checking' | 'ok' | 'fail'>(key ? 'checking' : 'fail');

  useEffect(() => {
    let cancelled = false;
    if (!key) {
      setState('fail');
      return;
    }
    setState('checking');
    validateAdminKey(key).then((ok) => {
      if (cancelled) return;
      if (!ok) {
        clearAdminKey();
        setState('fail');
        return;
      }
      setState('ok');
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  if (!key || state === 'fail') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (state === 'checking') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Verifying admin session…
      </div>
    );
  }

  return <>{children}</>;
}
