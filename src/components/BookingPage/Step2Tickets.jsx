// src/components/BookingPage/Step2Tickets.jsx
import { useBooking } from '../../context/BookingContext'
import { ticketTypes, calcSubtotal } from '../../data/tickets'
import { formatDateLong } from '../../data/exhibitions'
import { QuantityControl, Button } from '../ui'
import styles from './Step2Tickets.module.css'

export default function Step2Tickets() {
  const { state, dispatch } = useBooking()
  const subtotal = calcSubtotal(state.tickets)
  const totalQty = Object.values(state.tickets).reduce((a, b) => a + b, 0)

  function setTicket(id, qty) {
    dispatch({ type: 'SET_TICKET', ticketType: id, qty })
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Select tickets</h2>
      {state.date && <p className={styles.subtitle}>{formatDateLong(state.date)}</p>}

      <div className={styles.rows}>
        {ticketTypes.map(({ id, labelEn, price }) => {
          const qty = state.tickets[id] ?? 0
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
              <QuantityControl
                value={qty}
                onChange={(n) => setTicket(id, n)}
                min={0}
                ariaLabel={baseName}
              />
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
        <Button
          variant="secondary"
          className={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
        >← Back</Button>
        <Button
          variant="primary"
          className={styles.continueBtn}
          disabled={totalQty === 0}
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
        >Continue →</Button>
      </div>
    </section>
  )
}
