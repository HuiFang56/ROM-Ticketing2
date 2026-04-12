// src/components/BookingPage/Step4Contact.jsx
import { useState } from 'react'
import { useBooking } from '../../context/BookingContext'
import { formatDateLong } from '../../data/exhibitions'
import { ticketTypes, calcSubtotal, calcAddonSubtotal } from '../../data/tickets'
import { exhibitions } from '../../data/exhibitions'
import { FormField, Button } from '../ui'
import styles from './Step4Contact.module.css'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Step4Contact() {
  const { state, dispatch } = useBooking()
  const [emailError, setEmailError] = useState('')

  const { name, email, phone } = state.contact
  const canContinue = name.trim().length > 0 && email.trim().length > 0

  function handleField(field, value) {
    dispatch({ type: 'SET_CONTACT', fields: { [field]: value } })
    if (field === 'email') setEmailError('')
  }

  function handleContinue() {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    dispatch({ type: 'SET_STEP', step: 5 })
  }

  const subtotal = calcSubtotal(state.tickets)
  const openExhibitions = exhibitions.filter(ex =>
    state.addons[ex.id] && Object.values(state.addons[ex.id]).some(q => q > 0)
  )
  const addonSubtotal = calcAddonSubtotal(state.addons, openExhibitions)
  const totalQty = Object.values(state.tickets).reduce((a, b) => a + b, 0)

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Your details</h2>
      <p className={styles.subtitle}>Confirmation will be sent to your email</p>

      <div className={styles.fields}>
        <FormField label="Full Name" htmlFor="contact-name">
          <input
            id="contact-name"
            type="text"
            className={styles.input}
            value={name}
            onChange={e => handleField('name', e.target.value)}
            autoComplete="name"
          />
        </FormField>

        <FormField label="Email" htmlFor="contact-email" error={emailError} hint={emailError ? undefined : 'Tickets will be sent here'}>
          <input
            id="contact-email"
            type="email"
            className={`${styles.input} ${emailError ? styles.inputError : ''}`}
            value={email}
            onChange={e => handleField('email', e.target.value)}
            autoComplete="email"
          />
        </FormField>

        <FormField label="Phone (optional)" htmlFor="contact-phone">
          <input
            id="contact-phone"
            type="tel"
            className={styles.input}
            value={phone}
            onChange={e => handleField('phone', e.target.value)}
            autoComplete="tel"
          />
        </FormField>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryLabel}>Order Summary</div>
        {state.date && (
          <div className={styles.summaryRow}>
            <span>{formatDateLong(state.date)} · {totalQty} ticket{totalQty !== 1 ? 's' : ''}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        )}
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
        <div className={styles.summaryTotal}>
          <span>Total (excl. tax)</span>
          <span>${(subtotal + addonSubtotal).toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          className={styles.backBtn}
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
        >← Back</Button>
        <Button
          variant="primary"
          className={styles.continueBtn}
          disabled={!canContinue}
          onClick={handleContinue}
        >Continue →</Button>
      </div>
    </section>
  )
}
