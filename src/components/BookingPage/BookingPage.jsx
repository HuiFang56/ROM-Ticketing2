// src/components/BookingPage/BookingPage.jsx
import { useBooking } from '../../context/BookingContext'
import { StepIndicator } from '../ui'
import Step1Date from './Step1Date'
import Step2Tickets from './Step2Tickets'
import Step3Addons from './Step3Addons'
import Step4Contact from './Step4Contact'
import Step5Payment from './Step5Payment'
import styles from './BookingPage.module.css'

const STEPS = [Step1Date, Step2Tickets, Step3Addons, Step4Contact, Step5Payment]

export default function BookingPage() {
  const { state } = useBooking()
  const ActiveStep = STEPS[state.step - 1] ?? Step1Date
  return (
    <main className={styles.page}>
      <StepIndicator currentStep={state.step} />
      <ActiveStep />
    </main>
  )
}
