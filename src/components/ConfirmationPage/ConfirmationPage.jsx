// src/components/ConfirmationPage/ConfirmationPage.jsx
import { useBooking } from '../../context/BookingContext'
import { formatDateLong, exhibitions } from '../../data/exhibitions'
import { ticketTypes, calcSubtotal, calcAddonSubtotal, HST_RATE } from '../../data/tickets'
import styles from './ConfirmationPage.module.css'

export default function ConfirmationPage() {
  const { state, dispatch } = useBooking()

  const openExhibitions = exhibitions.filter(ex =>
    state.addons[ex.id] && Object.values(state.addons[ex.id]).some(q => q > 0)
  )
  const subtotal = calcSubtotal(state.tickets)
  const addonSubtotal = calcAddonSubtotal(state.addons, openExhibitions)
  const taxBase = subtotal + addonSubtotal
  const hst = Math.round(taxBase * HST_RATE * 100) / 100
  const total = taxBase + hst

  return (
    <main className={styles.page}>
      <div className={styles.icon} aria-hidden="true">✓</div>
      <h1 className={styles.heading}>You're all set!</h1>
      <p className={styles.emailSent}>Confirmation sent to</p>
      <p className={styles.email}>{state.contact.email}</p>

      <div className={styles.card}>
        <div className={styles.orderId}>Order #{state.orderId}</div>

        {state.date && (
          <div className={styles.row}>
            <span>Date</span>
            <span>{formatDateLong(state.date)}</span>
          </div>
        )}
        <div className={styles.row}>
          <span>Tickets</span>
          <span>
            {ticketTypes
              .filter(({ id }) => (state.tickets[id] ?? 0) > 0)
              .map(({ id, labelEn }) => {
                const parenIdx = labelEn.indexOf(' (')
                const baseName = parenIdx > -1 ? labelEn.slice(0, parenIdx) : labelEn
                return `${state.tickets[id]} ${baseName}`
              })
              .join(', ')}
          </span>
        </div>
        {openExhibitions.map(ex => (
          <div key={ex.id} className={styles.row}>
            <span>{ex.nameEn}</span>
            <span>
              {ticketTypes
                .filter(({ id }) => (state.addons[ex.id]?.[id] ?? 0) > 0)
                .map(({ id }) => state.addons[ex.id][id])
                .reduce((a, b) => a + b, 0)} tickets
            </span>
          </div>
        ))}

        <div className={styles.divider} />

        <div className={styles.row}>
          <span>Subtotal</span><span>${taxBase.toFixed(2)}</span>
        </div>
        <div className={styles.row}>
          <span>HST (7%)</span><span>${hst.toFixed(2)}</span>
        </div>
        <div className={styles.divider} />
        <div className={`${styles.row} ${styles.total}`}>
          <span>Total paid</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      <p className={styles.note}>
        Please present your email confirmation at the ROM entrance.
        Check your spam folder if you don't see it within a few minutes.
      </p>

      <button
        className={styles.homeBtn}
        onClick={() => dispatch({ type: 'GO_HOME' })}
      >
        Back to Home
      </button>
    </main>
  )
}
