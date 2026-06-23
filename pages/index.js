import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useLang } from '../components/LanguageContext'
import { useCases } from '../components/CaseContext'

export default function Dashboard() {
  const { t } = useLang()
  const { cases } = useCases()
  const router = useRouter()

  const today = new Date().toDateString()
  const todayCount = cases.filter(
    (c) => new Date(c.createdAt).toDateString() === today
  ).length

  const recentCases = cases.slice(0, 3)

  return (
    <Layout title={t.nav.dashboard}>
      <div className="max-w-2xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

        {/* Hero */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-slate-800">
            {t.dashboard.welcome}
          </h2>
          <p className="text-slate-500 mt-1 text-sm lg:text-base leading-snug">
            {t.dashboard.subtitle}
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: t.dashboard.stats.total, value: cases.length },
            { label: t.dashboard.stats.today, value: todayCount },
            { label: t.dashboard.stats.conditions, value: 100 },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <div className="font-serif text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Primary actions */}
        <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-2">
          <button
            onClick={() => router.push('/new-case')}
            className="flex items-center gap-3 bg-slate-800 text-white px-5 py-4 rounded-lg text-left hover:bg-slate-700 transition-colors"
          >
            <span className="text-2xl">+</span>
            <div>
              <div className="font-semibold text-sm">{t.dashboard.startCase}</div>
              <div className="text-slate-400 text-xs mt-0.5">New clinical encounter</div>
            </div>
          </button>

          <button
            onClick={() => router.push('/guidelines')}
            className="flex items-center gap-3 bg-white border border-slate-200 text-slate-800 px-5 py-4 rounded-lg text-left hover:bg-slate-50 transition-colors"
          >
            <span className="text-2xl">◉</span>
            <div>
              <div className="font-semibold text-sm">{t.dashboard.guidelines}</div>
              <div className="text-slate-400 text-xs mt-0.5">100 conditions, offline</div>
            </div>
          </button>
        </div>

        {/* Recent cases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm text-slate-600 uppercase tracking-wide">
              {t.dashboard.recentCases}
            </h3>
            {cases.length > 3 && (
              <button
                onClick={() => router.push('/cases')}
                className="text-xs text-blue-600 hover:underline"
              >
                {t.common.search} →
              </button>
            )}
          </div>

          {recentCases.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
              <p className="text-sm text-slate-400">{t.dashboard.noCases}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentCases.map((c) => (
                <button
                  key={c.caseID}
                  onClick={() => router.push(`/cases/${c.caseID}`)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-left hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">
                        {c.chiefComplaint || '—'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(c.createdAt).toLocaleDateString()} ·{' '}
                        {c.patientAge ? `${c.patientAge}y` : ''}{' '}
                        {c.patientGender || ''}
                      </div>
                    </div>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${
                      c.status === 'complete'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {c.status === 'complete' ? t.caseList.complete : t.caseList.draft}
                    </span>
                  </div>
                  {c.differentials && c.differentials.length > 0 && (
                    <div className="text-xs text-slate-400 mt-1 truncate">
                      {c.differentials.map((d) => d.diagnosisName).join(', ')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400 leading-relaxed">{t.disclaimer}</p>
        </div>

      </div>
    </Layout>
  )
}
