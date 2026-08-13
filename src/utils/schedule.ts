export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(total: number): string {
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function generateTimeSlots(openingTime: string, closingTime: string, duration: number): string[] {
  const slots: string[] = []
  const start = timeToMinutes(openingTime)
  const closing = timeToMinutes(closingTime)
  for (let current = start; current + duration <= closing; current += duration) {
    slots.push(minutesToTime(current))
  }
  return slots
}
