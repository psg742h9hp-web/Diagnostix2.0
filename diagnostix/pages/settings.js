import { useState } from 'react'
import Layout from '../components/Layout'
import { useLang } from '../components/LanguageContext'
import { useCases } from '../components/CaseContext'

export default function Settings() {
  const { t, lang, toggleLang } = useLang()
  const { exportCases, clearCases, storageSize, cases } = useCases()
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    if (confirmClear) {
      clearCases()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  return (
    <Layout title={t.settings.title}>
      <div className="max-w-2xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
        <h2 className="font-serif text-2xl font-bold text-slate-800 mb-6">{t.settings.title}</h2>

        {/* Language */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.settings.language}</h3>
          <button
            onClick={toggleLang}
            className="flex items-center gap-3 w-full px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span className="text-lg">🌐</span>
            <div className="text-left">
              <div className="text-sm font-medium text-slate-800">
                {lang === 'en' ? 'English → Čeština' : 'Čeština → English'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {lang === 'en' ? 'Přepnout do češtiny' : 'Switch to English'}
              </div>
            </div>
          </button>
        </section>

        {/* Data management */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">{t.settings.data}</h3>
          <p className="text-xs text-slate-400 mb-4">
            {t.settings.storageUsed}: {storageSize()} · {cases.length} cases
          </p>

          <div className="space-y-2">
            <button
              onClick={exportCases}
              disabled={cases.length === 0}
              className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              <span>💾</span> {t.settings.exportCases}
            </button>

            {confirmClear ? (
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <p className="text-sm text-red-700 mb-3">{t.settings.clearConfirm}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm text-slate-600 bg-white hover:bg-slate-50"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex-1 bg-red-600 text-white rounded px-3 py-2 text-sm hover:bg-red-700"
                  >
                    {t.common.confirm}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClear}
                disabled={cases.length === 0}
                className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-40 flex items-center gap-2"
              >
                <span>🗑️</span> {t.settings.clearCases}
              </button>
            )}
          </div>
        </section>

        {/* About */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">{t.settings.about}</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">{t.settings.version}</span>
              <span className="font-mono text-xs">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Guidelines</span>
              <span className="text-xs">ESC · ERS · ESCMID · EULAR 2022–2024</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">{t.settings.apiNote}</p>
        </section>

        {/* Legal */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">{t.settings.legal}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{t.settings.legalText}</p>
        </section>

        {/* Privacy */}
        <section className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">{t.settings.privacy}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{t.settings.privacyText}</p>
        </section>

      </div>
    </Layout>
  )
}
