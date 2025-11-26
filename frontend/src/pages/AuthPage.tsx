import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const { login, register, loading, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İşlem başarısız oldu');
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = loading || submitting || !email || password.length < 8;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <span className="text-xl font-bold">F</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">FinansTakip</h1>
          <p className="text-sm text-slate-500">Bütçeni kolayca yönet</p>
        </div>

        <div className="mb-6 flex rounded-full border border-slate-200 p-1 text-sm font-semibold text-slate-500">
          <button
            className={`flex-1 rounded-full py-2 transition ${mode === 'login' ? 'bg-slate-900 text-white' : ''}`}
            onClick={() => setMode('login')}
          >
            Giriş Yap
          </button>
          <button
            className={`flex-1 rounded-full py-2 transition ${mode === 'register' ? 'bg-slate-900 text-white' : ''}`}
            onClick={() => setMode('register')}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-600">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-600">
              Şifre (min. 8 karakter)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="rounded-2xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-2xl bg-brand-primary px-4 py-3 font-semibold text-white shadow transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
