import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useLang } from '../components/LanguageContext'
import guidelines from '../data/guidelines'

function Section({ label, children, color = 'slate' }) {
  const colorMap = {
    slate: 'border-slate-200 bg-slate-50',
    red: 'border-red-200 bg-red-50',
    amber: 'border-amber-200 bg-amber-50',
    emerald: 'border-emerald-200 bg-emerald-50',
    blue: 'border-blue-200 bg-blue-50',
    indigo: 'border-indigo-200 bg-indigo-50',
  }
  const labelMap = {
    slate: 'text-slate-600',
    red: 'text-red-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
    indigo: 'text-indigo-700',
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

const SPECIALTIES = [
  'all', 'cardiology', 'pulmonology', 'neurology', 'infectious',
  'rheumatology', 'endocrinology', 'haematology', 'gastroenterology', 'nephrology',
]

export default function Guidelines() {
  const { t, lang } = useLang()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = guidelines.filter((g) => {
    const matchSpecialty = specialty === 'all' || g.specialty === specialty
    const name = g.name[lang] || g.name.en
    const matchSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      g.guidelineRef.toLowerCase().includes(search.toLowerCase())
    return matchSpecialty && matchSearch
  })

  const specialtyCount = (sp) =>
    sp === 'all' ? guidelines.length : guidelines.filter((g) => g.specialty === sp).length

  return (
    <Layout title={t.guidelines.title}>
      <div className="max-w-2xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold text-slate-800">{t.guidelines.title}</h2>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            📴 {t.guidelines.offline}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelected(null) }}
            placeholder={t.guidelines.search}
            className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        {/* Specialty filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
          {SPECIALTIES.map((sp) => (
            <button
              key={sp}
              onClick={() => { setSpecialty(sp); setSelected(null) }}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                specialty === sp
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {t.guidelines.specialty[sp]} ({specialtyCount(sp)})
            </button>
          ))}
        </div>

        {/* Condition list + detail (two-panel on desktop, stack on mobile) */}
        <div className="lg:flex lg:gap-6">

          {/* List */}
          <div className={`${selected ? 'hidden lg:block' : ''} lg:w-72 lg:shrink-0`}>
            {filtered.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-8">{t.common.noResults}</div>
            ) : (
              <div className="space-y-1">
                {filtered.map((g) => {
                  const name = g.name[lang] || g.name.en
                  const isSelected = selected?.id === g.id
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelected(g)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-slate-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-sm font-medium leading-snug">{name}</div>
                      <div className={`text-xs mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                        {t.guidelines.specialty[g.specialty] || g.specialty}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="lg:flex-1 min-w-0">
              {/* Mobile back */}
              <button
                onClick={() => setSelected(null)}
                className="lg:hidden flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"
              >
                ← {t.common.back}
              </button>

              <div className="space-y-3">
                {/* Title */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h3 className="font-serif text-lg font-bold text-slate-800">
                    {selected.name[lang] || selected.name.en}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    {selected.guidelineRef}
                  </div>
                  <button
                    onClick={() => {
                      router.push({
                        pathname: '/new-case',
                        query: { dx: selected.name.en },
                      })
                    }}
                    className="mt-3 text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1 rounded transition-colors"
                  >
                    + Use in new case
                  </button>
                </div>

                <Section label={t.analysis.keyFindings} color="blue">
                  <BulletList items={selected.keyFindings?.[lang] || selected.keyFindings?.en || []} />
                </Section>

                <Section label={t.analysis.workup} color="slate">
                  <BulletList items={selected.workup?.[lang] || selected.workup?.en || []} />
                </Section>

                <Section label={t.analysis.redFlags} color="red">
                  <BulletList items={selected.redFlags?.[lang] || selected.redFlags?.en || []} />
                </Section>

                <Section label={t.analysis.etiology} color="indigo">
                  <BulletList items={selected.etiology?.[lang] || selected.etiology?.en || []} />
                </Section>

                <Section label={t.analysis.mimics} color="amber">
                  <div className="flex flex-wrap gap-1.5">
                    {(selected.mimics?.[lang] || selected.mimics?.en || []).map((m, i) => (
                      <span key={i} className="text-xs bg-white text-slate-600 border border-amber-200 px-2 py-0.5 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </Section>

                <Section label={t.analysis.treatment} color="emerald">
                  <BulletList items={selected.treatment?.[lang] || selected.treatment?.en || []} />
                </Section>

                <Section label={t.analysis.discharge} color="slate">
                  <BulletList items={selected.discharge?.[lang] || selected.discharge?.en || []} />
                </Section>
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}
