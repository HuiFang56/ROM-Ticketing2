import { formatDateLong, isExhibitionOpen, localTodayStr, exhibitions } from './exhibitions'

describe('isExhibitionOpen', () => {
  const openEx    = { startDate: '2025-01-01', endDate: '2027-12-31' }
  const pastEx    = { startDate: '2024-01-01', endDate: '2024-06-01' }
  const comingSoon = { startDate: '2026-06-01', endDate: null }
  const permanent  = { startDate: '2020-01-01', endDate: null }

  it('returns true when today is within date range', () => {
    expect(isExhibitionOpen(openEx, '2026-04-04')).toBe(true)
  })

  it('returns false when today is before startDate', () => {
    expect(isExhibitionOpen(comingSoon, '2026-04-04')).toBe(false)
  })

  it('returns false when today is after endDate', () => {
    expect(isExhibitionOpen(pastEx, '2026-04-04')).toBe(false)
  })

  it('returns true on startDate (inclusive)', () => {
    expect(isExhibitionOpen(openEx, '2025-01-01')).toBe(true)
  })

  it('returns true on endDate (inclusive)', () => {
    expect(isExhibitionOpen(openEx, '2027-12-31')).toBe(true)
  })

  it('returns true for permanent exhibition (endDate null)', () => {
    expect(isExhibitionOpen(permanent, '2026-04-04')).toBe(true)
  })
})

describe('localTodayStr', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    expect(localTodayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('exhibitions array', () => {
  it('has 3 exhibitions', () => {
    expect(exhibitions).toHaveLength(3)
  })

  it('first exhibition id is forbidden-city', () => {
    expect(exhibitions[0].id).toBe('forbidden-city')
  })

  it('egypt-pharaohs is coming soon as of 2026-04-04', () => {
    expect(isExhibitionOpen(exhibitions[2], '2026-04-04')).toBe(false)
  })

  it('forbidden-city and trex-revealed are open as of 2026-04-04', () => {
    expect(isExhibitionOpen(exhibitions[0], '2026-04-04')).toBe(true)
    expect(isExhibitionOpen(exhibitions[1], '2026-04-04')).toBe(true)
  })

  it('each exhibition has required fields', () => {
    for (const ex of exhibitions) {
      expect(ex).toHaveProperty('id')
      expect(ex).toHaveProperty('nameEn')
      expect(ex).toHaveProperty('nameZh')
      expect(ex).toHaveProperty('dateRangeEn')
      expect(ex).toHaveProperty('dateRangeZh')
      expect(ex).toHaveProperty('imageUrl')
      expect(ex).toHaveProperty('addonPrice.adult')
      expect(ex).toHaveProperty('addonPrice.youth')
      expect(ex).toHaveProperty('addonPrice.senior')
      expect(ex).toHaveProperty('startDate')
      expect(ex).toHaveProperty('endDate')
    }
  })
})

describe('formatDateLong', () => {
  test('formatDateLong formats YYYY-MM-DD to long English date', () => {
    expect(formatDateLong('2026-04-10')).toBe('Friday, April 10, 2026')
  })
})

describe('addonPrice extensions', () => {
  test('forbidden-city addonPrice has child and student keys', () => {
    const ex = exhibitions.find(e => e.id === 'forbidden-city')
    expect(ex.addonPrice.child).toBeDefined()
    expect(ex.addonPrice.student).toBeDefined()
  })

  test('all exhibitions have addonPrice with 5 ticket type keys', () => {
    const keys = ['adult', 'child', 'youth', 'student', 'senior']
    exhibitions.forEach(ex => {
      keys.forEach(key => expect(ex.addonPrice[key]).toBeDefined())
    })
  })
})
