import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { MODIFIERS } from './modifiers'
import { REWARDS } from './reward-generator'

const read = (locale) => {
  const messages = JSON.parse(readFileSync(new URL(`../../../i18n/locales/${locale}.json`, import.meta.url), 'utf8'))
  return { gauntlet: messages.gauntlet, progression: messages.progression, buildImpact: messages.buildImpact }
}
const flatten = (value, prefix = '') => Object.entries(value).flatMap(([key, entry]) => typeof entry === 'object' ? flatten(entry, `${prefix}${key}.`) : [[`${prefix}${key}`, entry]])

describe('Arcade translations', () => {
  it.each(['ru', 'uk'])('has identical keys and interpolation parameters in %s', (locale) => {
    const english = Object.fromEntries(flatten(read('en')))
    const messages = Object.fromEntries(flatten(read(locale)))
    expect(Object.keys(messages).sort()).toEqual(Object.keys(english).sort())
    for (const [key, value] of Object.entries(english)) {
      expect(messages[key].trim().length).toBeGreaterThan(0)
      expect((messages[key].match(/\{\w+\}/g) || []).sort()).toEqual((value.match(/\{\w+\}/g) || []).sort())
    }
  })
  it('provides every reward and modifier name and description', () => {
    for (const locale of ['en', 'ru', 'uk']) {
      const messages = Object.fromEntries(flatten(read(locale)))
      for (const entry of [...REWARDS, ...MODIFIERS]) {
        expect(messages[entry.nameKey]).toBeTruthy()
        expect(messages[entry.descriptionKey]).toBeTruthy()
      }
    }
  })
})
