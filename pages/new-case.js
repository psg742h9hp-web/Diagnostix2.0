import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useLang } from '../components/LanguageContext'
import { useCases } from '../components/CaseContext'

const SYMPTOM_GROUPS = [
  {
    key: 'cardiovascular',
    symptoms: ['chestPain', 'dyspnea', 'palpitations', 'syncope', 'oedema'],
  },
  {
    key: 'neurological',
    symptoms: ['headache', 'dizziness', 'weakness', 'confusion', 'seizure'],
  },
  {
    key: 'respiratory',
    symptoms: ['cough', 'haemoptysis', 'pleuriticPain'],
  },
  {
    key: 'gastrointestinal',
    symptoms: ['nausea', 'abdominalPain', 'diarrhoea', 'jaundice'],
  },
  {
    key: 'systemic',
    symptoms: ['fever', 'weightLoss', 'fatigue', 'rash', 'tickBite'],
  },
  {
    key: 'musculoskeletal',
    symptoms: ['jointPain', 'backPain'],
  },
]

export default function NewCase() {
  const { t } = useLang()
  const { saveCase } = useCases()
  const router = useRouter()

  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [chiefComplaint, setChiefComplaint] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [suspectedDx, setSuspectedDx] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const toggleSymptom = (sym) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    )
  }

  const handleSave = async () => {
    if (!chiefComplaint.trim()) {
      setError(t.caseForm.required)
      return
    }
    setError('')
    setSaving(true)

    const differentials = suspectedDx
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((diagnosisName) => ({ diagnosisName, userNote: '', claudeAnalysis: '', timestamp: new Date().toISOString() }))

    const caseID = saveCase({
      patientAge: age ? parseInt(age) : null,
      patientGender: gender,
      chiefComplaint: chiefComplaint.trim(),
      symptoms: selectedSymptoms,
      differentials,
      physicianNotes: notes.trim(),
      status: 'draft',
    })

    setSaving(false)
    router.push(`/cases/${caseID}`)
  }

  return (
    <Layout title={t.caseForm.title}>
      <div className="max-w-2xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

        <h2 className="font-serif text-2xl font-bold text-slate-800 mb-6">{t.caseForm.title}</h2>

        {/* Demographics */}
        <section className="mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            {t.caseForm.demographics}
            <span className="ml-2 text-slate-400 normal-case font-normal">({t.common.optional})</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t.caseForm.age}</label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="—"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">{t.caseForm.gender}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="">—</option>
                <option value="M">{t.caseForm.male}</option>
                <option value="F">{t.caseForm.female}</option>
                <option value="O">{t.caseForm.other}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Chief complaint */}
        <section className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {t.caseForm.chiefComplaint} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={chiefComplaint}
            onChange={(e) => { setChiefComplaint(e.target.value); setError('') }}
            placeholder={t.caseForm.chiefComplaintPlaceholder}
            className={`w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 ${
              error ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </section>

        {/* Symptoms */}
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">{t.caseForm.symptoms}</h3>
            <span className="text-xs text-slate-400">{t.caseForm.symptomsNote}</span>
          </div>
          <div className="space-y-4">
            {SYMPTOM_GROUPS.map((group) => (
              <div key={group.key}>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  {t.symptoms[group.key]}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.symptoms.map((sym) => {
                    const selected = selectedSymptoms.includes(sym)
                    return (
                      <button
                        key={sym}
                        onClick={() => toggleSymptom(sym)}
                        className={`px-3 py-1.5 rounded text-xs border transition-colors ${
                          selected
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {t.symptomList[sym]}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suspected differentials */}
        <section className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {t.caseForm.suspectedDx}
            <span className="ml-2 text-slate-400 text-xs font-normal">({t.common.optional})</span>
          </label>
          <input
            type="text"
            value={suspectedDx}
            onChange={(e) => setSuspectedDx(e.target.value)}
            placeholder={t.caseForm.suspectedDxPlaceholder}
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <p className="text-xs text-slate-400 mt-1">{t.caseForm.suspectedDxNote}</p>
        </section>

        {/* Clinical notes */}
        <section className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {t.caseForm.notes}
            <span className="ml-2 text-slate-400 text-xs font-normal">({t.common.optional})</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.caseForm.notesPlaceholder}
            rows={4}
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
          />
        </section>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {saving ? t.caseForm.saving : t.caseForm.save}
        </button>

      </div>
    </Layout>
  )
}
