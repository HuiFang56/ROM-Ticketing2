// src/components/BookingPage/Step1Date.jsx
import { useState } from 'react'
import { useBooking } from '../../context/BookingContext'
import { localTodayStr, formatDateLong } from '../../data/exhibitions'
import { Button } from '../ui'
import styles from './Step1Date.module.css'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December']

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function isDisabled(year, month, day, todayStr) {
  const dateStr = toDateStr(year, month, day)
  if (dateStr < todayStr) return true
  if (new Date(year, month, day).getDay() === 1) return true // Monday
  return false
}

export default function Step1Date() {
  const { state, dispatch } = useBooking()
  const todayStr = localTodayStr()
  const todayDate = new Date(todayStr + 'T00:00:00')

  const [displayYear, setDisplayYear] = useState(todayDate.getFullYear())
  const [displayMonth, setDisplayMonth] = useState(todayDate.getMonth())

  const isCurrentMonth = displayYear === todayDate.getFullYear() && displayMonth === todayDate.getMonth()
  const offset = firstDayOfMonth(displayYear, displayMonth)
  const totalDays = daysInMonth(displayYear, displayMonth)

  function prevMonth() {
    const d = new Date(displayYear, displayMonth - 1, 1)
    setDisplayYear(d.getFullYear())
    setDisplayMonth(d.getMonth())
  }

  function nextMonth() {
    const d = new Date(displayYear, displayMonth + 1, 1)
    setDisplayYear(d.getFullYear())
    setDisplayMonth(d.getMonth())
  }

  function selectDay(day) {
    const dateStr = toDateStr(displayYear, displayMonth, day)
    dispatch({ type: 'SET_DATE', date: dateStr })
  }

  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Choose your visit date</h2>
      <p className={styles.subtitle}>Open Tue – Sun · Closed Mondays</p>

      <div className={styles.calendar}>
        <div className={styles.monthNav}>
          <button
            className={styles.navBtn}
            onClick={prevMonth}
            disabled={isCurrentMonth}
            aria-label="Previous month"
          >‹</button>
          <span className={styles.monthLabel}>{MONTH_NAMES[displayMonth]} {displayYear}</span>
          <button className={styles.navBtn} onClick={nextMonth} aria-label="Next month">›</button>
        </div>

        <div className={styles.grid} role="grid">
          <div className={styles.headerRow} role="row">
            {DAY_LABELS.map((d, i) => (
              <div
                key={i}
                role="columnheader"
                aria-label={i === 1 ? 'Closed' : undefined}
                className={`${styles.dayHeader} ${i === 1 ? styles.dayHeaderClosed : ''}`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className={styles.daysGrid} role="rowgroup">
            {cells.map((day, i) => {
              if (day === null) return <span key={`e-${i}`} aria-hidden="true" />
              const dateStr = toDateStr(displayYear, displayMonth, day)
              const disabled = isDisabled(displayYear, displayMonth, day, todayStr)
              const selected = state.date === dateStr
              return (
                <button
                  key={day}
                  className={`${styles.day} ${disabled ? styles.dayDisabled : ''} ${selected ? styles.daySelected : ''}`}
                  disabled={disabled}
                  aria-label={dateStr}
                  aria-pressed={selected}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {state.date && (
        <p className={styles.selectedNote}>
          <strong>{formatDateLong(state.date)}</strong>
        </p>
      )}

      <div className={styles.actions}>
        <Button
          variant="primary"
          className={styles.continueBtn}
          disabled={!state.date}
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
        >
          Continue →
        </Button>
      </div>
    </section>
  )
}
