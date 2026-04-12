import { ticketTypes, HST_RATE, calcSubtotal, calcAddonSubtotal } from './tickets'
import { exhibitions } from './exhibitions'

test('ticketTypes has 5 entries', () => {
  expect(ticketTypes).toHaveLength(5)
})

test('ticketTypes ids are adult child youth student senior', () => {
  expect(ticketTypes.map(t => t.id)).toEqual(['adult', 'child', 'youth', 'student', 'senior'])
})

test('prices are correct', () => {
  const prices = Object.fromEntries(ticketTypes.map(t => [t.id, t.price]))
  expect(prices.adult).toBe(27.00)
  expect(prices.child).toBe(16.50)
  expect(prices.youth).toBe(20.25)
  expect(prices.student).toBe(20.25)
  expect(prices.senior).toBe(21.50)
})

test('HST_RATE is 0.07', () => {
  expect(HST_RATE).toBe(0.07)
})

test('calcSubtotal returns correct total', () => {
  const tickets = { adult: 2, child: 1, youth: 0, student: 0, senior: 0 }
  expect(calcSubtotal(tickets)).toBeCloseTo(27 * 2 + 16.50)
})

test('calcSubtotal returns 0 when no tickets', () => {
  const tickets = { adult: 0, child: 0, youth: 0, student: 0, senior: 0 }
  expect(calcSubtotal(tickets)).toBe(0)
})

test('calcAddonSubtotal returns correct total', () => {
  const addons = { 'forbidden-city': { adult: 2, child: 0, youth: 0, student: 0, senior: 0 } }
  const openExhibitions = exhibitions.filter(e => e.id === 'forbidden-city')
  expect(calcAddonSubtotal(addons, openExhibitions)).toBeCloseTo(8 * 2)
})

test('calcAddonSubtotal returns 0 when addons is empty', () => {
  expect(calcAddonSubtotal({}, exhibitions)).toBe(0)
})

test('calcAddonSubtotal returns 0 for unknown exhibition id', () => {
  // exhibition id not in data — no addonPrice found, total should be 0
  const addons = { 'unknown-exhibit': { adult: 2, child: 2, youth: 0, student: 0, senior: 0 } }
  const openExhibitions = exhibitions.filter(e => e.id === 'unknown-exhibit')
  expect(calcAddonSubtotal(addons, openExhibitions)).toBe(0)
})

test('calcSubtotal handles partial ticket object', () => {
  expect(calcSubtotal({ adult: 1 })).toBeCloseTo(27.00)
  expect(calcSubtotal({})).toBe(0)
})
