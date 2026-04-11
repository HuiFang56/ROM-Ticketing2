import styles from './SectionLabel.module.css'

export default function SectionLabel({ as: Tag = 'p', className, children }) {
  return (
    <Tag className={[styles.label, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
