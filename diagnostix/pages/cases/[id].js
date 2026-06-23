import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useLang } from '../../components/LanguageContext'
import { useCases } from '../../components/CaseContext'
import guidelines from '../../data/guidelines'

function Section({ label, children, color = 'slate' }) {
  const colorMap = {
    slate: 'border-slate-200 bg-slate-50',
    red: 'border-red-200 bg-red-50',
    amber: 'border-amber-200 bg-amber-50',
    emerald: 'border-emerald-200 bg-emerald-50',
    blue: 'border-blue-200 bg-blue-50',
  }
  const labelMap = {
    slate: 'text-slate-600',
    red: 'text-red-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
  }
  return (
    <div className={`border rounded-lg p-4 ${colorMap[color]}`}>
      <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${labelMap[color]}`}>{label}</div>
      {children}
    </div>
  )
}

function BulletList({ items }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-slate-700 flex gap-2">
          <span className="text-slate-400 shrink-0 mt-0.5">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CaseDetail() {
  const router = useRouter()
  const { id } = router.query
  const { t, lang } = useLang()
  const { getCase, updateCase } = useCases()

  const [caseData, setCaseData] = useState(null)
  const [selectedDx, setSelectedDx] = useState(null)
  const [guidelineData, setGuidelineData] = useState(null)
  const [copied, setCopied] = useState(false)
  const [customDx, setCustomDx] = useState('')
  const [addingDx, setAddingDx] = useState(false)

  useEffect(() => {
    if (id) {
      const c = getCase(id)
      setCaseData(c)
    }
  }, [id, getCase])

  useEffect(() => {
    if (selectedDx) {
      const g = guidelines.find(
        (gl) =>
          gl.name.en.toLowerCase().includes(selectedDx.diagnosisName.toLowerCase()) ||
          gl.name.cs.toLowerCase().includes(selectedDx.diagnosisName.toLowerCase()) ||
          gl.id === selectedDx.diagnosisName.toLowerCase().replace(/\s+/g, '-')
      )
      setGuidelineData(g || null)
    }
  }, [selectedDx])

  const handleAddDx = () => {
    if (!customDx.trim()) return
    const newDx = { diagnosisName: customDx.trim(), userNote: '', claudeAnalysis: '', timestamp: new Date().toISOString() }
    const updated = [...(caseData.differentials || []), newDx]
    updateCase(id, { differentials: updated })
    setCaseData((prev) => ({ ...prev, differentials: updated }))
    setCustomDx('')
    setAddingDx(false)
    setSelectedDx(newDx)
  }

  const buildDischargeSummary = () => {
    if (!caseData || !guidelineData) return ''
    const g = guidelineData
    const lines = [
      `DiagnostiX — ${new Date().toLocaleDateString()}`,
      '',
      `DIAGNOSIS: ${selectedDx?.diagnosisName || ''}`,
      `Chief Complaint: ${caseData.chiefComplaint || ''}`,
      caseData.patientAge ? `Age: ${caseData.patientAge} ${caseData.patientGender || ''}` : '',
      '',
      '--- DISCHARGE PLAN ---',
      ...(g.discharge?.[lang] || g.discharge?.en || []).map((l) => `• ${l}`),
      '',
      '--- TREATMENT ---',
      ...(g.treatment?.[lang] || g.treatment?.en || []).map((l) => `• ${l}`),
      '',
      `Guideline: ${g.guidelineRef}`,
    ]
    return lines.filter(Boolean).join('\n')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(buildDischargeSummary()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const markComplete = () => {
    updateCase(id, { status: 'complete' })
    setCaseData((prev) => ({ ...prev, status: 'complete' }))
  }

  if (!caseData) {
    return (
      <Layout title="Case">
        <div className="flex items-center justify-center h-48 text-sm text-slate-400">
          {t.common.loading}
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={caseData.chiefComplaint || 'Case'}>
      <div className="max-w-2xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

        {/* Back + status */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/cases')}
            className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            ← {t.common.back}
          </button>
          {caseData.status !== 'complete' && (
            <button
              onClick={markComplete}
              className="text-xs border border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-3 py-1 rounded transition-colors"
            >
              Mark complete
            </button>
          )}
        </div>

        {/* Case header */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-800">
                {caseData.chiefComplaint}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                {new Date(caseData.createdAt).toLocaleString()}
                {caseData.patientAge && ` · ${caseData.patientAge}y`}
                {caseData.patientGender && ` ${caseData.patientGender}`}
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              caseData.status === 'complete'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {caseData.status === 'complete' ? t.caseList.complete : t.caseList.draft}
            </span>
          </div>

          {caseData.symptoms && caseData.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {caseData.symptoms.map((s) => (
                <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {t.symptomList[s] || s}
                </span>
              ))}
            </div>
          )}

          {caseData.physicianNotes && (
            <div className="mt-3 text-sm text-slate-600 border-t border-slate-100 pt-3">
              {caseData.physicianNotes}
            </div>
          )}
        </div>

        {/* Differentials */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              {t.analysis.title}
            </h3>
            <button
              onClick={() => setAddingDx(!addingDx)}
              className="text-xs text-blue-600 hover:underline"
            >
              + Add
            </button>
          </div>

          {addingDx && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customDx}
                onChange={(e) => setCustomDx(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDx()}
                placeholder="Diagnosis name..."
                className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                autoFocus
              />
              <button onClick={handleAddDx} className="bg-slate-800 text-white px-3 py-1.5 rounded text-sm">
                Add
              </button>
              <button onClick={() => setAddingDx(false)} className="text-slate-400 hover:text-slate-600 text-sm px-2">
                ×
              </button>
            </div>
          )}

          {(!caseData.differentials || caseData.differentials.length === 0) ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-sm text-slate-400">
              {t.analysis.selectDx}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mb-4">
              {caseData.differentials.map((dx, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDx(selectedDx?.diagnosisName === dx.diagnosisName ? null : dx)}
                  className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                    selectedDx?.diagnosisName === dx.diagnosisName
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {dx.diagnosisName}
                </button>
              ))}
            </div>
          )}

          {/* Guideline content */}
          {selectedDx && (
            <div className="space-y-3">
              {guidelineData ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      📋 {t.analysis.guidelineRef}: {guidelineData.guidelineRef}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1 rounded transition-colors"
                    >
                      {copied ? `✓ ${t.analysis.copied}` : t.analysis.copyDischarge}
                    </button>
                  </div>

                  <Section label={t.analysis.keyFindings} color="blue">
                    <BulletList items={guidelineData.keyFindings?.[lang] || guidelineData.keyFindings?.en || []} />
                  </Section>

                  <Section label={t.analysis.workup} color="slate">
                    <BulletList items={guidelineData.workup?.[lang] || guidelineData.workup?.en || []} />
                  </Section>

                  <Section label={t.analysis.redFlags} color="red">
                    <BulletList items={guidelineData.redFlags?.[lang] || guidelineData.redFlags?.en || []} />
                  </Section>

                  <Section label={t.analysis.mimics} color="amber">
                    <div className="flex flex-wrap gap-1.5">
                      {(guidelineData.mimics?.[lang] || guidelineData.mimics?.en || []).map((m, i) => (
                        <span key={i} className="text-xs bg-white text-slate-600 border border-amber-200 px-2 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </Section>

                  <Section label={t.analysis.treatment} color="emerald">
                    <BulletList items={guidelineData.treatment?.[lang] || guidelineData.treatment?.en || []} />
                  </Section>

                  <Section label={t.analysis.discharge} color="slate">
                    <BulletList items={guidelineData.discharge?.[lang] || guidelineData.discharge?.en || []} />
                  </Section>

                  {/* Lab Analysis placeholder */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-600">{t.analysis.labAnalysis}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{t.analysis.labComingSoonNote}</p>
                  </div>
                </>
              ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-5">
                  <div className="text-sm font-medium text-slate-700 mb-1">{selectedDx.diagnosisName}</div>
                  <p className="text-sm text-slate-400">
                    No offline guideline available for this diagnosis. Search Guidelines Reference for related conditions.
                  </p>
                  <button
                    onClick={() => router.push('/guidelines')}
                    className="mt-3 text-xs text-blue-600 hover:underline"
                  >
                    Open Guidelines →
                  </button>

                  {/* Lab Analysis placeholder */}
                  <div className="mt-4 border border-slate-100 rounded p-3 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">{t.analysis.labAnalysis}</span>
                      <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{t.analysis.labComingSoonNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}
