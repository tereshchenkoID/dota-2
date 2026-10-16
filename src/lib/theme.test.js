import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { normalizeTheme, resolveTheme } from './theme'

describe('appearance preferences', () => {
  it.each([null, undefined, {}, 'invalid', '<script>'])('falls back safely for %s', (value) => {
    expect(normalizeTheme(value)).toBe('dark')
  })
  it('resolves system appearance without overriding explicit choices', () => {
    expect(resolveTheme('system', true)).toBe('light')
    expect(resolveTheme('system', false)).toBe('dark')
    expect(resolveTheme('dark', true)).toBe('dark')
    expect(resolveTheme('light', false)).toBe('light')
  })
})

// Color semantics must remain legible when the same component changes theme.

const SOURCE = readFileSync(new URL('../app/[locale]/layout.scss', import.meta.url), 'utf8')
const palette = (name) => {
  const block = SOURCE.split(`[data-theme="${name}"] {`)[1].split('\n}')[0]
  return Object.fromEntries([...block.matchAll(/(--color-[\w-]+): (#[a-f\d]+);/g)].map((match) => [match[1], match[2]]))
}
const luminance = (hex) => {
  let value = hex.slice(1)
  if (value.length === 3) value = value.split('').map((part) => part + part).join('')
  const channels = [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16) / 255).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return channels.reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
}

describe('shared theme contract', () => {
  it('provides the same semantic color roles in both palettes', () => {
    expect(Object.keys(palette('light')).sort()).toEqual(Object.keys(palette('dark')).sort())
  })
  it.each(['dark', 'light'])('keeps text and control contrast above 4.5 in %s', (name) => {
    const colors = palette(name)
    for (const [foreground, background] of [
      ['text', 'material'], ['text-muted', 'material-hover'], ['text-on-accent', 'accent'],
      ['text-on-accent', 'accent-hover'], ['text-on-danger', 'danger'], ['text-on-danger', 'danger-hover'],
      ['accent', 'accent-soft'], ['danger', 'danger-soft'], ['success', 'success-soft'],
    ]) {
      const a = luminance(colors[`--color-${foreground}`])
      const b = luminance(colors[`--color-${background}`])
      expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })
  it('has complete appearance and UI-kit translations', () => {
    const keys = (value, prefix = '') => Object.entries(value).flatMap(([key, entry]) => typeof entry === 'object' ? keys(entry, `${prefix}${key}.`) : [`${prefix}${key}`]).sort()
    const messages = ['en', 'ru', 'uk'].map((locale) => JSON.parse(readFileSync(new URL(`../i18n/locales/${locale}.json`, import.meta.url), 'utf8')))
    for (const current of messages) {
      expect(keys(current.appearance)).toEqual(keys(messages[0].appearance))
      expect(keys(current.uiKit)).toEqual(keys(messages[0].uiKit))
      expect(current.footer.assets).toBeTruthy()
    }
  })
})
