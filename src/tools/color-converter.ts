type HEX = `#${string}`
type RGB = { r: number; g: number; b: number }
type HSL = { h: number; s: number; l: number}

// HEX - RGB
function hex_to_rgb(input: HEX): RGB {
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

function rgb_to_hex({ r, g, b }: RGB): HEX {
    const toHex = (n: number) => {
        const clamped = Math.min(255, Math.max(0, Math.round(n)))
        return clamped.toString(16).padStart(2, '0')
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// RGB - HSL
function rgb_to_hsl({ r, g, b }: RGB): HSL {
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

function hsl_to_rgb({ h, s, l }: HSL): RGB {
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
function hex_to_hsl(input: HEX): HSL {
    return rgb_to_hsl(hex_to_rgb(input))
}

function hsl_to_hex(input: HSL): HEX {
    return rgb_to_hex(hsl_to_rgb(input))
}