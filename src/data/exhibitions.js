export function localTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isExhibitionOpen(ex, todayStr) {
  if (todayStr < ex.startDate) return false
  if (ex.endDate && todayStr > ex.endDate) return false
  return true
}

export const exhibitions = [
  {
    id: 'forbidden-city',
    nameEn: 'Forbidden City',
    nameZh: '紫禁城',
    dateRangeEn: 'Oct 12, 2025 – Jun 30, 2027',
    dateRangeZh: '2025年10月12日 – 2027年6月30日',
    imageUrl: '',
    addonPrice: { adult: 8, youth: 8, senior: 8 },
    startDate: '2025-10-12',
    endDate: '2027-06-30',
  },
  {
    id: 'trex-revealed',
    nameEn: 'T.Rex Revealed',
    nameZh: '霸王龙大揭秘',
    dateRangeEn: 'Mar 5, 2025 – Mar 31, 2027',
    dateRangeZh: '2025年3月5日 – 2027年3月31日',
    imageUrl: '',
    addonPrice: { adult: 6, youth: 6, senior: 6 },
    startDate: '2025-03-05',
    endDate: '2027-03-31',
  },
  {
    id: 'egypt-pharaohs',
    nameEn: 'Egypt: The Time of Pharaohs',
    nameZh: '古埃及：法老时代',
    dateRangeEn: 'From Jun 1, 2026',
    dateRangeZh: '2026年6月1日起',
    imageUrl: '',
    addonPrice: { adult: 10, youth: 10, senior: 10 },
    startDate: '2026-06-01',
    endDate: null,
  },
]
