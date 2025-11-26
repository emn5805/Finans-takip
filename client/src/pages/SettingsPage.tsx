import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const displayName = user?.email?.split('@')[0] || 'Kullanıcı';

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Hesap ve uygulama tercihleri</p>
        <h1 className="text-3xl font-bold text-slate-900">Ayarlar</h1>
      </header>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Profil</h2>
        <div className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="name">
              Kullanıcı Adı
            </label>
            <input
              id="name"
              type="text"
              defaultValue={displayName}
              disabled
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500 focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              defaultValue={user?.email}
              disabled
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500 focus:border-brand-primary focus:outline-none"
            />
          </div>
        </div>
        <button className="mt-4 rounded-2xl bg-brand-primary px-4 py-2 font-semibold text-white shadow">
          Kaydet
        </button>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Bildirimler</h2>
        <div className="space-y-4 text-sm text-slate-600">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="size-4 rounded border-slate-300" />
            E-posta ile haftalık özet gönder
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="size-4 rounded border-slate-300" />
            Bütçe limitleri aşıldığında uyar
          </label>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
