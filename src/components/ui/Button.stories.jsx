import Button from './Button'

export default {
  component: Button,
  args: { onClick: undefined },
}

export const Primary   = { args: { children: 'Buy Tickets', variant: 'primary' } }
export const Secondary = { args: { children: 'Go Back', variant: 'secondary' } }
export const Text      = { args: { children: 'Skip', variant: 'text' } }
