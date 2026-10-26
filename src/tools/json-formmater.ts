export type Indent = '2' | '4' | 'tab'

function toIndent(indent: Indent): string | number {
  return indent === 'tab' ? '\t' : Number(indent)
}

export function formatJson(text: string, indent: Indent): string {
  return JSON.stringify(JSON.parse(text), null, toIndent(indent))
}

export function minifyJson(text: string): string {
  return JSON.stringify(JSON.parse(text))
}