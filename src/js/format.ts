export function formatFileSize(bytes: string | number, round?: boolean) {
  if (typeof bytes === 'string')
    bytes = Number(bytes)

  if (isNaN(bytes))
    return 0

  if (bytes / 1000000 > 1)
    return round ? `${Math.round(bytes / 1000000)}MB` : `${bytes / 1000000}MB`
  return round ? `${Math.round(bytes / 1000)}KB` : `${bytes / 1000}KB`
}
