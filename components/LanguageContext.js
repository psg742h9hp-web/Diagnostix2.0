import { createContext, useContext, useState, useEffect } from 'react'
import translations from '../lib/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('cs')

  useEffect(() => {
    const stored = localStorage.getItem('dx_lang')
    if (stored === 'cs' || stored === 'en') setLang(stored)
  }, [])

  const toggleLang = () => {
    const next = lang === 'en' ? 'cs' : 'en'
    setLang(next)
    localStorage.setItem('dx_lang', next)
  }

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
