export function encodeBase64(text: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach(b => (binary += String.fromCharCode(b)))

  let result = btoa(binary)

  if (urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }

  return result
}

export function decodeBase64(text: string): string {
  let b64 = text.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4 !== 0) b64 += '='

  let binary: string
  try {
    binary = atob(b64)
  } catch {
    throw new Error('Base64 inválido.')
  }

  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error('O resultado não é um texto UTF-8 válido (pode ser um arquivo binário).')
  }
}