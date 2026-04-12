import { useLang } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import { exhibitions, isExhibitionOpen, localTodayStr } from '../../data/exhibitions'
import { Button, Badge } from '../ui'
import styles from './ExhibitionPage.module.css'

export default function ExhibitionPage({ todayStr }) {
  const { lang, t } = useLang()
  const { state, dispatch } = useBooking()
  const today = todayStr ?? localTodayStr()

  const ex = exhibitions.find((e) => e.id === state.selectedExhibitionId)
  if (!ex) return null

  const isOpen = isExhibitionOpen(ex, today)
  const name = lang === 'zh' ? ex.nameZh : ex.nameEn
  const description = lang === 'zh' ? ex.descriptionZh : ex.descriptionEn
  const dateRange = lang === 'zh' ? ex.dateRangeZh : ex.dateRangeEn

  return (
    <main className={styles.page}>
      <button
        className={styles.back}
        onClick={() => dispatch({ type: 'GO_HOME' })}
      >
        ← {t('back')}
      </button>

      <div className={styles.hero}>
        {ex.imageUrl && (
          <img src={ex.imageUrl} alt={name} className={styles.heroImg} />
        )}
        <div className={styles.heroGradient} aria-hidden="true" />
        <h1 className={styles.heroName}>{name}</h1>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaLeft}>
          {isOpen
            ? <Badge variant="open">{t('open')}</Badge>
            : <Badge variant="coming-soon">{t('coming-soon')}</Badge>
          }
          <span className={styles.dateRange}>{dateRange}</span>
        </div>
        <span className={styles.price}>+${ex.addonPrice.adult} / person</span>
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.cta}>
        {isOpen ? (
          <Button
            variant="primary"
            className={styles.ctaBtn}
            onClick={() => dispatch({ type: 'GO_TO_BOOKING', exhibitionId: ex.id })}
          >
            {t('book-tickets')}
          </Button>
        ) : (
          <Button variant="primary" className={styles.ctaBtn} disabled>
            {t('coming-soon')}
          </Button>
        )}
        <p className={styles.subnote}>{t('includes-ga')}</p>
      </div>
    </main>
  )
}
