import styles from './Badge.module.css'

export default function Badge({ variant, children }) {
  return (
    <span className={`${styles.badge} ${styles[variant === 'coming-soon' ? 'comingSoon' : variant]}`}>
      {children}
    </span>
  )
}
