import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdminKey, setAdminKey } from '@/chat/admin/services/adminSession';
import { validateAdminKey } from '../lib/adminApi';
import { Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/admin/dashboard';

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = getAdminKey();
    if (!existing) return;
    let cancelled = false;
    void validateAdminKey(existing).then((ok) => {
      if (!cancelled && ok) navigate(from, { replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [from, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Admin key is required.');
      return;
    }

    setLoading(true);
    setError(null);
    const ok = await validateAdminKey(trimmed);
    setLoading(false);

    if (!ok) {
      setError('Invalid admin key or API unavailable.');
      return;
    }

    setAdminKey(trimmed);
    navigate(from, { replace: true });
  };

  return (
    <section className="min-h-screen bg-[#05070a] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Lock className="w-5 h-5 text-amber-300" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Admin <span className="italic text-amber-300">Login</span>
        </h1>
        <p className="text-sm text-white/50 mb-6">
          Enter your ADMIN_API_KEY to unlock the RankRise Control Center.
        </p>
        <label className="block text-xs uppercase tracking-wide text-white/40 mb-2">
          Admin API Key
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-amber-300/40"
          placeholder="X-Admin-Key value"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-white text-black font-semibold py-3 hover:bg-white/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Unlock dashboard
        </button>
      </form>
    </section>
  );
}
