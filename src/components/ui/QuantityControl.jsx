import styles from './QuantityControl.module.css'

export default function QuantityControl({ value, onChange, min = 0, max, ariaLabel }) {
  return (
    <div className={styles.controls}>
      <button
        className={styles.btn}
        aria-label={`Decrease ${ariaLabel}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >−</button>
      <span className={styles.value}>{value}</span>
      <button
        className={styles.btn}
        aria-label={`Increase ${ariaLabel}`}
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
      >+</button>
    </div>
  )
}
