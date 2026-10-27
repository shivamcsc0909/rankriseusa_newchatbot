import { FormEvent, type ReactNode, useCallback, useState } from 'react';
import { clearAdminKey, getAdminKey, setAdminKey } from './services/adminSession';

type Props = {
  children: (adminKey: string, lock: () => void) => ReactNode;
};

/**
 * Requires an admin key before rendering the chat dashboard.
 * Key is stored in sessionStorage only (never baked into the client bundle).
 */
export default function AdminAuthGate({ children }: Props) {
  const [adminKey, setAdminKeyState] = useState(() => getAdminKey());
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const lock = useCallback(() => {
    clearAdminKey();
    setAdminKeyState(null);
    setInput('');
    setError('Unauthorized — enter a valid admin key.');
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Admin key is required.');
      return;
    }
    setAdminKey(trimmed);
    setAdminKeyState(trimmed);
    setError(null);
  };

  if (!adminKey) {
    return (
      <section className="min-h-screen bg-background pt-24 pb-8 px-4 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-[#05070a] p-8"
        >
          <h1 className="text-2xl font-black text-foreground tracking-tight mb-2">
            Admin <span className="text-gradient-gold italic">Access</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter the socket admin key to open the chat dashboard.
          </p>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Admin key
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-foreground outline-none focus:border-white/30"
            placeholder="SOCKET_ADMIN_KEY"
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-white text-black font-semibold py-3 hover:bg-white/90 transition"
          >
            Unlock dashboard
          </button>
        </form>
      </section>
    );
  }

  return (
    <>
      <div className="fixed top-20 right-4 z-40">
        <button
          type="button"
          onClick={lock}
          className="text-xs text-muted-foreground hover:text-foreground border border-white/10 rounded-lg px-3 py-1.5 bg-[#05070a]"
        >
          Lock admin
        </button>
      </div>
      {children(adminKey, lock)}
    </>
  );
}
