export type HEX = `#${string}`
export type RGB = { r: number; g: number; b: number }
export type HSL = { h: number; s: number; l: number }
export type Format = 'hex' | 'rgb' | 'hsl'

// HEX - RGB
export function hex_to_rgb(input: HEX): RGB {
    let hex = input.slice(1)

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('')
    }

    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
        throw new Error(`Cor HEX inválida: ${input}`)
    }

    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
    }
}

export function rgb_to_hex({ r, g, b }: RGB): HEX {
    const toHex = (n: number) => {
        const clamped = Math.min(255, Math.max(0, Math.round(n)))
        return clamped.toString(16).padStart(2, '0')
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// RGB - HSL
export function rgb_to_hsl({ r, g, b }: RGB): HSL {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    const l = (max + min) / 2

    let h = 0
    let s = 0

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1))

        switch (max) {
            case r: h = ((g - b) / delta) % 6; break
            case g: h = (b - r) / delta + 2; break
            case b: h = (r - g) / delta + 4; break
        }

        h *= 60
        if (h < 0) h += 360
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    }
}

export function hsl_to_rgb({ h, s, l }: HSL): RGB {
    h = ((h % 360) + 360) % 360
    s /= 100
    l /= 100

    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))

    return {
        r: Math.round(f(0) * 255),
        g: Math.round(f(8) * 255),
        b: Math.round(f(4) * 255),
    }
}

// HEX - HSL
export function hex_to_hsl(input: HEX): HSL {
    return rgb_to_hsl(hex_to_rgb(input))
}

export function hsl_to_hex(input: HSL): HEX {
    return rgb_to_hex(hsl_to_rgb(input))
}

// General Conversor

function parse(value: string, format: Format): RGB {
    const v = value.trim()

    if (format === 'hex') {
        return hex_to_rgb((v.startsWith('#') ? v : `#${v}`) as HEX)
    }

    const n = v.match(/-?\d+(\.\d+)?/g)?.map(Number)
    if (!n || n.length !== 3) {
        throw new Error('Formato inválido. Use 3 números, ex: 255, 136, 0')
    }

    return format === 'rgb'
        ? { r: n[0], g: n[1], b: n[2] }
        : hsl_to_rgb({ h: n[0], s: n[1], l: n[2] })
}

function stringify(rgb: RGB, format: Format): string {
    if (format === 'hex') return rgb_to_hex(rgb)
    if (format === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

    const { h, s, l } = rgb_to_hsl(rgb)
    return `hsl(${h}, ${s}%, ${l}%)`
}

export function convertColor(value: string, from: Format, to: Format): string {
    return stringify(parse(value, from), to)
}