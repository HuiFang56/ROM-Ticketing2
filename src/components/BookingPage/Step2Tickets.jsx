// src/components/BookingPage/Step2Tickets.jsx
import { useBooking } from '../../context/BookingContext'
import { ticketTypes, calcSubtotal } from '../../data/tickets'
import { formatDateLong } from '../../data/exhibitions'
import styles from './Step2Tickets.module.css'

export default function Step2Tickets() {
  const { state, dispatch } = useBooking()
  const subtotal = calcSubtotal(state.tickets)
  const totalQty = Object.values(state.tickets).reduce((a, b) => a + b, 0)

  function adjust(id, delta) {
    dispatch({ type: 'SET_TICKET', ticketType: id, qty: (state.tickets[id] ?? 0) + delta })
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Select tickets</h2>
      {state.date && <p className={styles.subtitle}>{formatDateLong(state.date)}</p>}

      <div className={styles.rows}>
        {ticketTypes.map(({ id, labelEn, price }) => {
          const qty = state.tickets[id] ?? 0
          // Split label if it includes age range in parens, e.g. "Child (4–14)"
          const parenIdx = labelEn.indexOf(' (')
          const baseName = parenIdx > -1 ? labelEn.slice(0, parenIdx) : labelEn
          const ageNote = parenIdx > -1 ? labelEn.slice(parenIdx + 1) : null
          return (
            <div key={id} className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowLabel}>{baseName}</span>
                {ageNote !== null && <span className={styles.rowAge}>{ageNote}</span>}
                <span className={styles.rowPrice}>${price.toFixed(2)}</span>
              </div>
              <div className={styles.controls}>
                <button
                  className={styles.minus}
                  aria-label={`Decrease ${baseName}`}
                  disabled={qty === 0}
                  onClick={() => adjust(id, -1)}
                >−</button>
                <span className={styles.qty}>{qty}</span>
                <button
                  className={styles.plus}
                  aria-label={`Increase ${baseName}`}
                  onClick={() => adjust(id, 1)}
                >+</button>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.totalBar}>
        <span className={styles.totalCount}>{totalQty} ticket{totalQty !== 1 ? 's' : ''}</span>
        <span className={styles.totalAmount}>${subtotal.toFixed(2)}</span>
      </div>
      <p className={styles.taxNote}>Applicable taxes will be added at checkout</p>

      <div className={styles.actions}>
        <button
          className={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
        >← Back</button>
        <button
          className={styles.continueBtn}
          disabled={totalQty === 0}
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
        >Continue →</button>
      </div>
    </section>
  )
}
