import { createContext, useContext, useState, useEffect } from 'react'

const CaseContext = createContext(null)

const STORAGE_KEY = 'dx_cases'

function generateCaseId() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const time = now.toTimeString().slice(0, 5).replace(':', '')
  const rand = Math.random().toString(36).slice(2, 8)
  return `${date}-${time}-${rand}`
}

export function CaseProvider({ children }) {
  const [cases, setCases] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCases(JSON.parse(raw))
    } catch {
      setCases([])
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
    } catch {
      // storage quota exceeded — silently fail
    }
  }, [cases, loaded])

  const saveCase = (caseData) => {
    const id = generateCaseId()
    const newCase = {
      ...caseData,
      caseID: id,
      createdAt: new Date().toISOString(),
      status: 'draft',
    }
    setCases((prev) => [newCase, ...prev])
    return id
  }

  const updateCase = (caseID, updates) => {
    setCases((prev) =>
      prev.map((c) => (c.caseID === caseID ? { ...c, ...updates } : c))
    )
  }

  const deleteCase = (caseID) => {
    setCases((prev) => prev.filter((c) => c.caseID !== caseID))
  }

  const getCase = (caseID) => cases.find((c) => c.caseID === caseID) || null

  const exportCases = () => {
    const blob = new Blob([JSON.stringify(cases, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diagnostix-cases-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearCases = () => setCases([])

  const storageSize = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || ''
      return (new Blob([raw]).size / 1024).toFixed(1) + ' KB'
    } catch {
      return '—'
    }
  }

  return (
    <CaseContext.Provider
      value={{
        cases,
        loaded,
        saveCase,
        updateCase,
        deleteCase,
        getCase,
        exportCases,
        clearCases,
        storageSize,
      }}
    >
      {children}
    </CaseContext.Provider>
  )
}

export function useCases() {
  const ctx = useContext(CaseContext)
  if (!ctx) throw new Error('useCases must be used within CaseProvider')
  return ctx
}
