import { useLang } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import { Button, SectionLabel } from '../ui'
import styles from './PlanVisitPage.module.css'

export default function PlanVisitPage() {
  const { lang, t } = useLang()
  const { dispatch } = useBooking()

  return (
    <main className={styles.page}>
      <button
        className={styles.back}
        onClick={() => dispatch({ type: 'GO_HOME' })}
      >
        ← {t('back')}
      </button>

      <h1 className={styles.title}>{t('plan-visit')}</h1>

      <section className={styles.section}>
        <SectionLabel as="h2">{t('hours')}</SectionLabel>
        <div className={styles.rows}>
          {lang === 'zh' ? (
            <>
              <div className={styles.row}><span>周一至周五</span><span>上午10:00 – 下午5:30</span></div>
              <div className={styles.row}><span>周六至周日</span><span>上午10:00 – 下午5:30</span></div>
              <div className={styles.row}><span>休馆</span><span>12月25日（圣诞节）</span></div>
            </>
          ) : (
            <>
              <div className={styles.row}><span>Mon – Fri</span><span>10:00 am – 5:30 pm</span></div>
              <div className={styles.row}><span>Sat – Sun</span><span>10:00 am – 5:30 pm</span></div>
              <div className={styles.row}><span>Closed</span><span>Dec 25 (Christmas Day)</span></div>
            </>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <SectionLabel as="h2">{t('location')}</SectionLabel>
        <p className={styles.text}>100 Queen's Park, Toronto, ON M5S 2C6</p>
        <a
          href="https://maps.google.com/?q=Royal+Ontario+Museum+Toronto"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
        >
          {t('open-in-maps')} →
        </a>
      </section>

      <section className={styles.section}>
        <SectionLabel as="h2">{t('getting-here')}</SectionLabel>
        {lang === 'zh' ? (
          <>
            <p className={styles.text}>地铁：Museum站（1号线）</p>
            <p className={styles.text}>公交：5、6、94路</p>
          </>
        ) : (
          <>
            <p className={styles.text}>Subway: Museum station (Line 1 Yonge-University)</p>
            <p className={styles.text}>Bus: Routes 5, 6, 94</p>
          </>
        )}
      </section>

      <section className={styles.section}>
        <SectionLabel as="h2">{t('accessibility')}</SectionLabel>
        <p className={styles.text}>
          {lang === 'zh'
            ? '无障碍入口位于Bloor St W。各楼层均设有电梯及无障碍洗手间。'
            : 'Wheelchair accessible entrance on Bloor St W. Elevators available on all floors. Accessible washrooms on every level.'
          }
        </p>
      </section>

      <div className={styles.cta}>
        <Button
          variant="primary"
          className={styles.ctaBtn}
          onClick={() => dispatch({ type: 'GO_TO_BOOKING', exhibitionId: null })}
        >
          {t('book-tickets')}
        </Button>
      </div>
    </main>
  )
}
