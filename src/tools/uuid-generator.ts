export type UuidOptions = {
  count: number
  uppercase: boolean
  hyphens: boolean
}

export function generateUuids({ count, uppercase, hyphens }: UuidOptions): string[] {
  return Array.from({ length: count }, () => {
    let id: string = crypto.randomUUID()
    if (!hyphens) id = id.replace(/-/g, '')
    if (uppercase) id = id.toUpperCase()
    return id
  })
}