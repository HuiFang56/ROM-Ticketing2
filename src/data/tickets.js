export const ticketTypes = [
  { id: 'adult',   labelEn: 'Adult',         labelZh: '成人',        price: 27.00 },
  { id: 'child',   labelEn: 'Child (4–14)',   labelZh: '儿童(4–14)', price: 16.50 },
  { id: 'youth',   labelEn: 'Youth (15–19)',  labelZh: '青少年',      price: 20.25 },
  { id: 'student', labelEn: 'Student',        labelZh: '学生',        price: 20.25 },
  { id: 'senior',  labelEn: 'Senior (65+)',   labelZh: '长者(65+)',   price: 21.50 },
]

export const HST_RATE = 0.07

export function calcSubtotal(tickets) {
  return ticketTypes.reduce((sum, { id, price }) => sum + (tickets[id] ?? 0) * price, 0)
}

export function calcAddonSubtotal(addons, exhibitions) {
  return exhibitions.reduce((sum, ex) => {
    const qty = addons[ex.id] ?? {}
    return sum + ticketTypes.reduce(
      (s, { id }) => s + (qty[id] ?? 0) * (ex.addonPrice[id] ?? 0),
      0
    )
  }, 0)
}
