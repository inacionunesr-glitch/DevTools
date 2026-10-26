import { convertColor, type Format } from './tools/color-converter'
import { formatJson, minifyJson, type Indent } from './tools/json-formmater'
import { generateUuids } from './tools/uuid-generator'

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

colorInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') convert()
})

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(colorOutput.textContent ?? '')
  copyBtn.textContent = 'Copied!'
  setTimeout(() => (copyBtn.textContent = 'Copy'), 1200)
})

// JSON Formatter
const jsonInput = document.querySelector<HTMLTextAreaElement>('#json-input')!
const jsonOutput = document.querySelector<HTMLTextAreaElement>('#json-output')!
const jsonIndent = document.querySelector<HTMLSelectElement>('#json-indent')!
const jsonError = document.querySelector<HTMLElement>('#json-error')!
const jsonFormatBtn = document.querySelector<HTMLButtonElement>('#json-format-btn')!
const jsonMinifyBtn = document.querySelector<HTMLButtonElement>('#json-minify-btn')!
const jsonClearBtn = document.querySelector<HTMLButtonElement>('#json-clear-btn')!
const jsonCopyBtn = document.querySelector<HTMLButtonElement>('#json-copy-btn')!

function runJson(action: (text: string) => string) {
  if (!jsonInput.value.trim()) {
    jsonOutput.value = ''
    jsonError.hidden = true
    return
  }

  try {
    jsonOutput.value = action(jsonInput.value)
    jsonError.hidden = true
  } catch (e) {
    jsonOutput.value = ''
    jsonError.textContent = (e as Error).message
    jsonError.hidden = false
  }
}

jsonFormatBtn.addEventListener('click', () =>
  runJson(text => formatJson(text, jsonIndent.value as Indent)),
)

jsonMinifyBtn.addEventListener('click', () => runJson(minifyJson))

jsonClearBtn.addEventListener('click', () => {
  jsonInput.value = ''
  jsonOutput.value = ''
  jsonError.hidden = true
})

jsonCopyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.value)
    jsonCopyBtn.textContent = 'Copied!'
  } catch {
    jsonCopyBtn.textContent = 'Failed'
  }
  setTimeout(() => (jsonCopyBtn.textContent = 'Copy'), 1200)
})

// UUID Generator
const uuidCount = document.querySelector<HTMLInputElement>('#uuid-count')!
const uuidUppercase = document.querySelector<HTMLInputElement>('#uuid-uppercase')!
const uuidHyphens = document.querySelector<HTMLInputElement>('#uuid-hyphens')!
const uuidGenerateBtn = document.querySelector<HTMLButtonElement>('#uuid-generate-btn')!
const uuidCopyBtn = document.querySelector<HTMLButtonElement>('#uuid-copy-btn')!
const uuidOutput = document.querySelector<HTMLTextAreaElement>('#uuid-output')!

function generateUuid() {
  const count = Math.min(50, Math.max(1, Math.floor(Number(uuidCount.value)) || 1))
  uuidCount.value = String(count)

  uuidOutput.value = generateUuids({
    count,
    uppercase: uuidUppercase.checked,
    hyphens: uuidHyphens.checked,
  }).join('\n')
}

uuidGenerateBtn.addEventListener('click', generateUuid)
uuidCount.addEventListener('change', generateUuid)
uuidUppercase.addEventListener('change', generateUuid)
uuidHyphens.addEventListener('change', generateUuid)
generateUuid()

uuidCopyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(uuidOutput.value)
    uuidCopyBtn.textContent = 'Copied!'
  } catch {
    uuidCopyBtn.textContent = 'Failed'
  }
  setTimeout(() => (uuidCopyBtn.textContent = 'Copy all'), 1200)
})