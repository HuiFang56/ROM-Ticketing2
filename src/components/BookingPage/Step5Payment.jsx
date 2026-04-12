// src/components/BookingPage/Step5Payment.jsx
import { useBooking } from '../../context/BookingContext'
import { exhibitions } from '../../data/exhibitions'
import { ticketTypes, calcSubtotal, calcAddonSubtotal, HST_RATE } from '../../data/tickets'
import { SectionLabel, Button } from '../ui'
import styles from './Step5Payment.module.css'

const METHODS = [
  { id: 'wechat', label: 'WeChat Pay', emoji: '💬', deepLink: 'weixin://pay', appName: 'WeChat' },
  { id: 'alipay', label: 'Alipay',     emoji: '🔵', deepLink: 'alipays://pay', appName: 'Alipay' },
]

export default function Step5Payment() {
  const { state, dispatch } = useBooking()

  const openExhibitions = exhibitions.filter(ex =>
    state.addons[ex.id] && Object.values(state.addons[ex.id]).some(q => q > 0)
  )
  const subtotal = calcSubtotal(state.tickets)
  const addonSubtotal = calcAddonSubtotal(state.addons, openExhibitions)
  const taxBase = subtotal + addonSubtotal
  const hst = Math.round(taxBase * HST_RATE * 100) / 100
  const total = taxBase + hst
  const totalQty = Object.values(state.tickets).reduce((a, b) => a + b, 0)

  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768
  const selected = state.paymentMethod
  const selectedMethod = METHODS.find(m => m.id === selected)

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Payment</h2>

      <div className={styles.summary}>
        <div className={styles.summaryLabel}>Order Summary</div>
        <div className={styles.summaryRow}>
          <span>{totalQty} ticket{totalQty !== 1 ? 's' : ''}</span>
          <span>{totalQty > 0 ? `×` : ''}</span>
        </div>
        {openExhibitions.map(ex => {
          const addonTotal = ticketTypes.reduce(
            (s, { id }) => s + (state.addons[ex.id]?.[id] ?? 0) * (ex.addonPrice[id] ?? 0), 0
          )
          return addonTotal > 0 ? (
            <div key={ex.id} className={styles.summaryRow}>
              <span>{ex.nameEn}</span>
              <span>+${addonTotal.toFixed(2)}</span>
            </div>
          ) : null
        })}
        <div className={styles.summaryDivider} />
        <div className={styles.summaryRow}>
          <span>Subtotal</span><span>${taxBase.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>HST (7%)</span><span>${hst.toFixed(2)}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryTotal}>
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      <SectionLabel className={styles.methodLabel}>Pay with</SectionLabel>
      <div className={styles.methods}>
        {METHODS.map(m => (
          <button
            key={m.id}
            aria-label={m.label}
            className={`${styles.method} ${selected === m.id ? styles.methodSelected : ''}`}
            onClick={() => dispatch({ type: 'SET_PAYMENT_METHOD', method: m.id })}
          >
            <span className={styles.methodEmoji}>{m.emoji}</span>
            <span className={styles.methodName}>{m.label}</span>
          </button>
        ))}
      </div>

      {selected && (
        isDesktop ? (
          <div className={styles.qrBox}>
            <div className={styles.qrPlaceholder} aria-label="QR code for payment" />
            <p className={styles.qrHint}>Scan with {selectedMethod.appName}</p>
          </div>
        ) : (
          <a href={selectedMethod.deepLink} className={styles.deepLink}>
            Open {selectedMethod.appName} →
          </a>
        )
      )}

      <div className={styles.actions}>
        <Button
          variant="secondary"
          className={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}
        >← Back</Button>
        <Button
          variant="primary"
          className={styles.confirmBtn}
          disabled={!selected}
          onClick={() => dispatch({ type: 'CONFIRM_ORDER' })}
        >Confirm &amp; Pay</Button>
      </div>
    </section>
  )
}
