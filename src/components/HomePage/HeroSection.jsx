import { useLang } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import { Button } from '../ui'
import styles from './HeroSection.module.css'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=900&q=80'

export default function HeroSection() {
  const { lang, t } = useLang()
  const { dispatch } = useBooking()

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
    >
      <div className={styles.content}>
        <p className={styles.tagline} aria-hidden="true">
          {t('includes-ga')}
        </p>
        <h1 className={styles.title}>
          {lang === 'zh' ? (
            <>
              皇家安大略博物馆
              <br />
              <span>Royal Ontario Museum</span>
            </>
          ) : (
            <>
              Royal
              <br />
              Ontario
              <br />
              Museum
            </>
          )}
        </h1>
        <Button
          variant="primary"
          className={styles.ctaBtn}
          onClick={() => dispatch({ type: 'GO_TO_BOOKING', exhibitionId: null })}
        >
          {t('buy-tickets')}
        </Button>
        <Button
          variant="text"
          className={styles.planBtn}
          onClick={() => dispatch({ type: 'GO_TO_PLAN_VISIT' })}
        >
          {t('plan-visit')}<span aria-hidden="true"> →</span>
        </Button>
      </div>
    </section>
  )
}
