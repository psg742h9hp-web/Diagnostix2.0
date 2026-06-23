import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useLang } from '../../components/LanguageContext'
import { useCases } from '../../components/CaseContext'

export default function Cases() {
  const { t } = useLang()
  const { cases, deleteCase, exportCases } = useCases()
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleDelete = (caseID) => {
    if (confirmDelete === caseID) {
      deleteCase(caseID)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(caseID)
    }
  }

  return (
    <Layout title={t.caseList.title}>
      <div className="max-w-2xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-slate-800">{t.caseList.title}</h2>
          {cases.length > 0 && (
            <button
              onClick={exportCases}
              className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded px-3 py-1.5 transition-colors"
            >
              {t.caseList.exportAll}
            </button>
          )}
        </div>

        {cases.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
            <p className="text-sm text-slate-500 mb-1">{t.caseList.empty}</p>
            <p className="text-xs text-slate-400">{t.caseList.emptyNote}</p>
            <button
              onClick={() => router.push('/new-case')}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              {t.dashboard.startCase} →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {cases.map((c) => (
              <div
                key={c.caseID}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => { setConfirmDelete(null); router.push(`/cases/${c.caseID}`) }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">
                        {c.chiefComplaint || '—'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(c.createdAt).toLocaleDateString()} ·{' '}
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {c.patientAge && ` · ${c.patientAge}y`}
                        {c.patientGender && ` ${c.patientGender}`}
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
                    <div className="text-xs text-slate-400 mt-1.5 truncate">
                      {c.differentials.map((d) => d.diagnosisName).join(' · ')}
                    </div>
                  )}
                  {c.symptoms && c.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.symptoms.slice(0, 4).map((s) => (
                        <span key={s} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                      {c.symptoms.length > 4 && (
                        <span className="text-xs text-slate-400">+{c.symptoms.length - 4}</span>
                      )}
                    </div>
                  )}
                </button>

                {/* Delete row */}
                <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-end gap-3">
                  {confirmDelete === c.caseID ? (
                    <>
                      <span className="text-xs text-slate-500">{t.caseList.deleteConfirm}</span>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        {t.common.cancel}
                      </button>
                      <button
                        onClick={() => handleDelete(c.caseID)}
                        className="text-xs text-red-600 font-medium hover:text-red-800"
                      >
                        {t.common.confirm}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(c.caseID)}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      🗑️ {t.caseList.delete}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
