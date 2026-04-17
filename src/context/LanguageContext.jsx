import { createContext, useContext, useState } from 'react'

export const translations = {
  en: {
    'buy-tickets':        'Buy Tickets',
    'book-tickets':       'Book Tickets',
    'back':               'Back',
    'plan-visit':         'Plan Your Visit',
    'special-exhibitions':'Special Exhibitions',
    'add-on':             'Add-on',
    'coming-soon':        'Coming Soon',
    'includes-ga':        'Includes General Admission',
    'open':               'Open',
    'hours':              'Hours',
    'location':           'Location',
    'getting-here':       'Getting Here',
    'accessibility':      'Accessibility',
    'open-in-maps':       'Open in Maps',
  },
  zh: {
    'buy-tickets':        '购票',
    'book-tickets':       '立即订票',
    'back':               '返回',
    'plan-visit':         '参观信息',
    'special-exhibitions':'特别展览',
    'add-on':             '加购',
    'coming-soon':        '即将开展',
    'includes-ga':        '含通用入场票',
    'open':               '展出中',
    'hours':              '开放时间',
    'location':           '地址',
    'getting-here':       '交通指南',
    'accessibility':      '无障碍设施',
    'open-in-maps':       '查看地图',
  },
}

export const LanguageContext = createContext(null)

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
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
