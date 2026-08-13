const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})

const shortFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'short', day: 'numeric', month: 'short',
})

export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatLongDate(value: string): string {
  const formatted = dateFormatter.format(parseLocalDate(value))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatShortDate(value: string): string {
  const formatted = shortFormatter.format(parseLocalDate(value)).replace('.', '')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function moveDate(value: string, days: number): string {
  const date = parseLocalDate(value)
  date.setDate(date.getDate() + days)
  return toLocalDateKey(date)
}

export function isToday(value: string): boolean {
  return value === toLocalDateKey()
}

export function isOpenDay(value: string, openingDays: number[]): boolean {
  return openingDays.includes(parseLocalDate(value).getDay())
}
