import { useState } from 'react'
import FormField from './FormField'

export default { component: FormField }

export const Default = {
  render: () => {
    const [val, setVal] = useState('')
    return (
      <FormField label="Email" htmlFor="email-default">
        <input
          id="email-default"
          type="email"
          value={val}
          onChange={e => setVal(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #b3b3b3', fontFamily: 'inherit' }}
        />
      </FormField>
    )
  },
}

export const WithError = {
  render: () => {
    const [val, setVal] = useState('notanemail')
    return (
      <FormField label="Email" htmlFor="email-error" error="Enter a valid email address">
        <input
          id="email-error"
          type="email"
          value={val}
          onChange={e => setVal(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #c00000', fontFamily: 'inherit' }}
        />
      </FormField>
    )
  },
}
