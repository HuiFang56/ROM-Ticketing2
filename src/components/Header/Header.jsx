import { useLang } from '../../context/LanguageContext'
import styles from './Header.module.css'

export default function Header() {
  const { lang, setLang } = useLang()
  return (
    <header className={styles.header}>
      <span className={styles.logo}>ROM</span>
      <div className={styles.langToggle}>
        <button
          className={`${styles.langBtn} ${lang === 'en' ? styles.active : ''}`}
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
        <span className={styles.divider} aria-hidden="true">·</span>
        <button
          className={`${styles.langBtn} ${lang === 'zh' ? styles.active : ''}`}
          onClick={() => setLang('zh')}
          aria-pressed={lang === 'zh'}
        >
          中
        </button>
      </div>
    </header>
  )
}
