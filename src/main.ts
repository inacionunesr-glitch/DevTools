import { convertColor, type Format } from './tools/color-converter'

// SideBar
const links = document.querySelectorAll<HTMLAnchorElement>('.sidebar a')
const tools = document.querySelectorAll<HTMLElement>('.tool')

function render() {
  const id = location.hash.slice(1) || 'color-converter'

  tools.forEach(tool => {
    tool.style.display = tool.id === id ? 'flex' : 'none'
  })

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
  })
}

window.addEventListener('hashchange', render)
render()

// Color Converter
const inputFormat = document.querySelector<HTMLSelectElement>('#input-format')!
const outputFormat = document.querySelector<HTMLSelectElement>('#output-format')!
const colorInput = document.querySelector<HTMLInputElement>('#color-input')!
const convertBtn = document.querySelector<HTMLButtonElement>('#convert-btn')!
const colorOutput = document.querySelector<HTMLElement>('#color-output')!

const placeholders: Record<Format, string> = {
  hex: '#ff8800',
  rgb: '255, 136, 0',
  hsl: '32, 100, 50',
}

function updatePlaceholder() {
  colorInput.placeholder = placeholders[inputFormat.value as Format]
}

inputFormat.addEventListener('change', updatePlaceholder)
updatePlaceholder()

const result = document.querySelector<HTMLElement>('#result')!
const colorPreview = document.querySelector<HTMLElement>('#color-preview')!
const copyBtn = document.querySelector<HTMLButtonElement>('#copy-btn')!

function convert() {
  const from = inputFormat.value as Format
  const to = outputFormat.value as Format

  try {
    colorOutput.textContent = convertColor(colorInput.value, from, to)
    // o quadrado sempre usa rgb(...), que o CSS entende
    colorPreview.style.background = convertColor(colorInput.value, from, 'rgb')
    result.classList.remove('error')
  } catch (e) {
    colorOutput.textContent = (e as Error).message
    result.classList.add('error')
  }

  result.hidden = false
}

convertBtn.addEventListener('click', convert)

// Enter no campo também converte
colorInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') convert()
})

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(colorOutput.textContent ?? '')
  copyBtn.textContent = 'Copied!'
  setTimeout(() => (copyBtn.textContent = 'Copy'), 1200)
})