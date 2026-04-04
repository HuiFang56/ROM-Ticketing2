import { useLang } from '../../context/LanguageContext'
import { useBooking } from '../../context/BookingContext'
import { isExhibitionOpen, localTodayStr } from '../../data/exhibitions'
import styles from './ExhibitionList.module.css'

export default function ExhibitionList({ exhibitions, todayStr }) {
  const { lang, t } = useLang()
  const { dispatch } = useBooking()
  const today = todayStr ?? localTodayStr()

  const featured = exhibitions[0]
  const rest = exhibitions.slice(1)

  function handleClick(id) {
    dispatch({ type: 'GO_TO_EXHIBITION', exhibitionId: id })
  }

  return (
    <section>
      <h2 className={styles.label}>{t('special-exhibitions')}</h2>

      {/* Featured card */}
      <button className={styles.featured} onClick={() => handleClick(featured.id)}>
        <div className={styles.featuredImgWrapper}>
          {featured.imageUrl && (
            <img
              src={featured.imageUrl}
              alt={lang === 'zh' ? featured.nameZh : featured.nameEn}
              loading="lazy"
              className={styles.featuredImg}
            />
          )}
          <div className={styles.featuredGradient} aria-hidden="true" />
          <span className={styles.featuredName}>
            {lang === 'zh' ? featured.nameZh : featured.nameEn}
          </span>
        </div>
        <div className={styles.featuredMeta}>
          <span className={styles.date}>
            {lang === 'zh' ? featured.dateRangeZh : featured.dateRangeEn}
          </span>
          {isExhibitionOpen(featured, today) ? (
            <span className={styles.badgeOpen}>
              +${featured.addonPrice.adult}
            </span>
          ) : (
            <span className={styles.badgeSoon}>{t('coming-soon')}</span>
          )}
        </div>
      </button>

      {/* Compact rows */}
      {rest.map((ex) => (
        <button key={ex.id} className={styles.row} onClick={() => handleClick(ex.id)}>
          {ex.imageUrl ? (
            <img
              src={ex.imageUrl}
              alt={lang === 'zh' ? ex.nameZh : ex.nameEn}
              loading="lazy"
              className={styles.rowImg}
            />
          ) : (
            <div className={styles.rowImg} aria-hidden="true" />
          )}
          <div className={styles.rowBody}>
            <span className={styles.rowName}>
              {lang === 'zh' ? ex.nameZh : ex.nameEn}
            </span>
            <span className={styles.rowDate}>
              {lang === 'zh' ? ex.dateRangeZh : ex.dateRangeEn}
            </span>
          </div>
          <div className={styles.rowRight}>
            {isExhibitionOpen(ex, today) ? (
              <span className={styles.badgeOpen}>+${ex.addonPrice.adult}</span>
            ) : (
              <span className={styles.badgeSoon}>{t('coming-soon')}</span>
            )}
          </div>
        </button>
      ))}
    </section>
  )
}
