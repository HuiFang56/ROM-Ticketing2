// src/components/BookingPage/Step3Addons.jsx
import { useEffect } from 'react'
import { useBooking } from '../../context/BookingContext'
import { useLang } from '../../context/LanguageContext'
import { exhibitions, isExhibitionOpen } from '../../data/exhibitions'
import { ticketTypes, calcAddonSubtotal } from '../../data/tickets'
import styles from './Step3Addons.module.css'

export default function Step3Addons() {
  const { state, dispatch } = useBooking()
  const { lang } = useLang()

  const openExhibitions = state.date
    ? exhibitions.filter(ex => isExhibitionOpen(ex, state.date))
    : []

  const purchasedTypes = ticketTypes.filter(({ id }) => (state.tickets[id] ?? 0) > 0)

  // Pre-fill entry exhibition with purchased ticket quantities on mount
  useEffect(() => {
    const { entryExhibitionId, addons, tickets } = state
    if (entryExhibitionId && !addons[entryExhibitionId]) {
      purchasedTypes.forEach(({ id }) => {
        dispatch({ type: 'SET_ADDON', exhibitionId: entryExhibitionId, ticketType: id, qty: tickets[id] })
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addonSubtotal = calcAddonSubtotal(state.addons, openExhibitions)

  function adjust(exhibitionId, ticketType, delta) {
    const current = (state.addons[exhibitionId]?.[ticketType] ?? 0)
    dispatch({ type: 'SET_ADDON', exhibitionId, ticketType, qty: current + delta })
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Add special exhibitions</h2>
      <p className={styles.subtitle}>Optional — upgrade your visit</p>

      {openExhibitions.length === 0 && (
        <p className={styles.empty}>No special exhibitions available for this date.</p>
      )}

      <div className={styles.cards}>
        {openExhibitions.map(ex => {
          const exAddons = state.addons[ex.id] ?? {}
          const hasAny = purchasedTypes.some(({ id }) => (exAddons[id] ?? 0) > 0)
          const name = lang === 'zh' ? ex.nameZh : ex.nameEn
          const dateRange = lang === 'zh' ? ex.dateRangeZh : ex.dateRangeEn
          const pricePerPerson = ex.addonPrice.adult

          return (
            <div key={ex.id} className={`${styles.card} ${hasAny ? styles.cardActive : ''}`}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.exName}>{name}</div>
                  <div className={styles.exDate}>{dateRange}</div>
                </div>
                <div className={styles.exPrice}>+${pricePerPerson.toFixed(2)} / person</div>
              </div>

              {purchasedTypes.map(({ id, labelEn }) => {
                const parenIdx = labelEn.indexOf(' (')
                const baseName = parenIdx > -1 ? labelEn.slice(0, parenIdx) : labelEn
                const qty = exAddons[id] ?? 0
                const maxQty = state.tickets[id]
                return (
                  <div key={id} className={styles.typeRow}>
                    <span className={styles.typeLabel}>{baseName} × {maxQty}</span>
                    <div className={styles.controls}>
                      <button
                        className={styles.minus}
                        aria-label={`Decrease ${baseName} for ${name}`}
                        disabled={qty === 0}
                        onClick={() => adjust(ex.id, id, -1)}
                      >−</button>
                      <span className={styles.qty}>{qty}</span>
                      <button
                        className={styles.plus}
                        aria-label={`Increase ${baseName} for ${name}`}
                        disabled={qty >= maxQty}
                        onClick={() => adjust(ex.id, id, 1)}
                      >+</button>
                    </div>
                  </div>
                )
              })}

              {hasAny && (
                <div className={styles.cardSubtotal}>
                  Subtotal: ${purchasedTypes.reduce(
                    (s, { id }) => s + (exAddons[id] ?? 0) * (ex.addonPrice[id] ?? 0), 0
                  ).toFixed(2)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {addonSubtotal > 0 && (
        <div className={styles.totalBar}>
          <span>Add-ons</span>
          <span>+${addonSubtotal.toFixed(2)}</span>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}>← Back</button>
        <button className={styles.continueBtn} onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}>Continue →</button>
      </div>
    </section>
  )
}
