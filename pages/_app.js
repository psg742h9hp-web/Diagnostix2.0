import '../styles/globals.css'
import { LanguageProvider } from '../components/LanguageContext'
import { CaseProvider } from '../components/CaseContext'

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <CaseProvider>
        <Component {...pageProps} />
      </CaseProvider>
    </LanguageProvider>
  )
}
