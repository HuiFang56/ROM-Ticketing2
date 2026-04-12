import styles from './Button.module.css'

export default function Button({
  variant = 'primary',
  onClick,
  disabled,
  type = 'button',
  className,
  children,
}) {
  return (
    <button
      type={type}
      className={[styles.btn, styles[variant], className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
