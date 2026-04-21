import { LanguageContext, translations } from '../context/LanguageContext'
import { BookingContext } from '../context/BookingContext'
import { fn } from 'storybook/test'

function mockLang(lang) {
  return {
    lang,
    setLang: fn(),
    t: (key) => translations[lang]?.[key] ?? key,
  }
}

export function withMockContexts(lang = 'en', state) {
  return (Story) => (
    <LanguageContext.Provider value={mockLang(lang)}>
      <BookingContext.Provider value={{ state, dispatch: fn() }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh' }}>
          <Story />
        </div>
      </BookingContext.Provider>
    </LanguageContext.Provider>
  )
}
