// src/components/BookingPage/StepIndicator.jsx
import styles from './StepIndicator.module.css'

const STEPS = ['DATE', 'TICKETS', 'ADD-ONS', 'CONTACT', 'PAYMENT']

export default function StepIndicator({ currentStep }) {
  return (
    <ol className={styles.indicator} aria-label={`Step ${currentStep} of 5`}>
      {STEPS.map((label, i) => {
        const num = i + 1
        const isDone = num < currentStep
        const isActive = num === currentStep
        return (
          <li
            key={label}
            className={`${styles.item} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className={styles.dot}>{isDone ? '✓' : num}</div>
            <span className={styles.label}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
