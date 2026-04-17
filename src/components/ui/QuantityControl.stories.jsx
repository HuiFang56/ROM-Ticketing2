import { useState } from 'react'
import QuantityControl from './QuantityControl'

export default { component: QuantityControl }

export const AtZero = {
  render: () => {
    const [qty, setQty] = useState(0)
    return (
      <QuantityControl
        value={qty}
        onChange={setQty}
        min={0}
        max={10}
        ariaLabel="Adult tickets"
      />
    )
  },
}

export const NonZero = {
  render: () => {
    const [qty, setQty] = useState(3)
    return (
      <QuantityControl
        value={qty}
        onChange={setQty}
        min={0}
        max={10}
        ariaLabel="Adult tickets"
      />
    )
  },
}
