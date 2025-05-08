/**
 * @param {string} selector
 * @returns {any}
 */
export function $(selector) {
  return document.querySelector(selector)
}

/**
 * @param {string} selector
 * @returns {any[]}
 */
export function $All(selector) {
  return [...document.querySelectorAll(selector)]
}

/**
 *
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {number[]}
 */
export function hslToRgb(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  return [0, 8, 4].map((n) =>
    Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))) * 255)
  )
}

/**
 *
 * @param {number} l
 * @param {number} c
 * @param {number} h
 * @returns {number[]}
 */
export function lchToRgb(l, c, h) {
  // Convert hue from degrees to radians
  let hr = (h * Math.PI) / 180

  // Convert LCH to LAB
  let a = c * Math.cos(hr)
  let b = c * Math.sin(hr)

  // Convert LAB to XYZ
  let y = (l + 16) / 116
  let x = a / 500 + y
  let z = y - b / 200

  y = y > 0.2069 ? y ** 3 : (y - 16 / 116) / 7.787
  x = x > 0.2069 ? x ** 3 : (x - 16 / 116) / 7.787
  z = z > 0.2069 ? z ** 3 : (z - 16 / 116) / 7.787

  x *= 95.047
  y *= 100
  z *= 108.883

  // Convert XYZ to RGB
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415
  b = x * 0.0557 + y * -0.204 + z * 1.057

  // Apply gamma correction and normalize to 0-255 range
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b

  // Clamp and convert to 0-255
  r = Math.max(0, Math.min(255, Math.round(r * 255)))
  g = Math.max(0, Math.min(255, Math.round(g * 255)))
  b = Math.max(0, Math.min(255, Math.round(b * 255)))

  return [r, g, b]
}

export function getDistance(p0, p1) {
  const dx = p0.x - p1.x
  const dy = p0.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 *
 * @param {string} mode
 * @param { (args: {angle: number, rgba: number[]}) => void} onClick
 * @returns {HTMLCanvasElement}
 */
export function createColorWheel(mode, onClick) {
  const el = $(`.color.wheel-color.${mode}-wheel`)

  const wheelContainer = document.createElement('div')
  wheelContainer.className = 'wheel-container'
  el.append(wheelContainer)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Error Canvas COntext')
  }

  canvas.className = 'wheel'
  canvas.setAttribute('width', '200')
  canvas.setAttribute('height', '200')
  wheelContainer.append(canvas)
  updateWheelImageData(mode, canvas, 50)

  canvas.addEventListener('click', (e) => {
    let block = wheelContainer.querySelector(`.block`)
    if (!block) {
      block = document.createElement('div')
      block.className = 'block'
      wheelContainer.append(block)
    }
    const canvasRect = canvas.getBoundingClientRect()
    const radius = canvasRect.width / 2
    const rect = block.getBoundingClientRect()
    const x = e.offsetX
    const y = e.offsetY
    const distance = getDistance({ x, y }, { x: radius, y: radius })
    console.log({ mouseX: x, mouseY: y, distance })

    if (distance > radius) return
    // @ts-ignore
    Object.assign(block.style, {
      left: `${x - rect.width / 2}px`,
      top: `${y - rect.height / 2}px`,
    })

    const dx = x - radius
    const dy = y - radius
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180

    const i = (y * canvas.width + x) * 4
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    onClick({ angle, rgba: [...d.slice(i, i + 4)] })
  })

  return canvas
}

/**
 *
 * @param {string} mode
 * @param {HTMLCanvasElement} canvas
 * @param {number} lightness
 */
export function updateWheelImageData(mode, canvas, lightness) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imageData = ctx.createImageData(canvas.width, canvas.height)
  const radius = canvas.width / 2
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - radius
      const dy = y - radius
      const distance = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180

      if (distance < radius) {
        const [r, g, b] =
          mode === 'hsl'
            ? hslToRgb(angle, (distance / radius) * 100, lightness)
            : hslToRgb(angle, 100, lightness)

        const index = (y * canvas.width + x) * 4
        imageData.data[index] = r
        imageData.data[index + 1] = g
        imageData.data[index + 2] = b
        imageData.data[index + 3] = 255
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)
}
