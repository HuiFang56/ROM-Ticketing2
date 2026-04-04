import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    'buy-tickets':        'Buy Tickets',
    'back':               'Back',
    'plan-visit':         'Plan Your Visit',
    'special-exhibitions':'Special Exhibitions',
    'add-on':             'Add-on',
    'coming-soon':        'Coming Soon',
    'includes-ga':        'Includes General Admission',
  },
  zh: {
    'buy-tickets':        '购票',
    'back':               '返回',
    'plan-visit':         '参观信息',
    'special-exhibitions':'特别展览',
    'add-on':             '加购',
    'coming-soon':        '即将开展',
    'includes-ga':        '含通用入场票',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = (key) => translations[lang][key] ?? key
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
