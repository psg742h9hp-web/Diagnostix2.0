import Head from 'next/head'
import { useRouter } from 'next/router'
import { useLang } from './LanguageContext'

const NAV_ITEMS = [
  { path: '/', icon: '⊞', key: 'dashboard' },
  { path: '/new-case', icon: '+', key: 'newCase' },
  { path: '/cases', icon: '▤', key: 'cases' },
  { path: '/guidelines', icon: '◉', key: 'guidelines' },
  { path: '/settings', icon: '⚙', key: 'settings' },
]

export default function Layout({ children, title }) {
  const { t, lang, toggleLang } = useLang()
  const router = useRouter()

  const pageTitle = title ? `${title} — DiagnostiX` : 'DiagnostiX'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* Desktop: sidebar + content */}
      <div className="min-h-screen bg-slate-50 flex">

        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
          <div className="px-6 py-5 border-b border-slate-200">
            <h1 className="font-serif text-xl font-bold text-slate-800 tracking-tight">DiagnostiX</h1>
            <p className="text-xs text-slate-400 mt-0.5">{t.tagline}</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = router.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors text-left ${
                    active
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <span className="text-base w-5 text-center leading-none">{item.icon}</span>
                  {t.nav[item.key]}
                </button>
              )
            })}
          </nav>

          <div className="px-4 py-4 border-t border-slate-200">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span>🌐</span>
              <span>{lang === 'en' ? 'Switch to Čeština' : 'Switch to English'}</span>
            </button>
          </div>

          <div className="px-4 pb-4">
            <p className="text-xs text-slate-400">{t.disclaimer}</p>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <h1 className="font-serif text-lg font-bold text-slate-800 leading-none">DiagnostiX</h1>
              </div>
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 px-2 py-1 rounded border border-slate-200"
              >
                <span>🌐</span>
                <span className="font-medium">{lang === 'en' ? 'EN' : 'CS'}</span>
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 pb-20 lg:pb-8">
            {children}
          </main>

          {/* Bottom nav (mobile only) */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-20">
            <div className="flex">
              {NAV_ITEMS.map((item) => {
                const active = router.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                      active ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    <span className="text-lg leading-none">{item.icon}</span>
                    <span className="text-[10px] font-medium">{t.nav[item.key]}</span>
                  </button>
                )
              })}
            </div>
          </nav>

        </div>
      </div>
    </>
  )
}
