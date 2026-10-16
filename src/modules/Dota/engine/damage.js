import { BALANCE } from '@/modules/Dota/config/balance'
import { HEROES } from '@/modules/Dota/config/heroes'
export const ITEM_EFFECTS = {
  'healing-salve': (s, n) => ({ ...s, healing: (s.healing || 0) + 20 * n }),
  'divine-rapier': (s, n) => ({ ...s, damage: s.damage + 80 * n }),
  'daedalus': (s, n) => ({ ...s, damage: s.damage * (1 + 0.5 * n) }),
  'butterfly': (s, n) => ({ ...s, extraSpins: s.extraSpins + n }),
  'black-king-bar': (s, n) => ({ ...s, shields: s.shields + n }),
  'aghanims-scepter': (s, n) => ({ ...s, damage: s.damage * (1 + 0.35 * n) }),
  'refresher-orb': (s, n, previous = 0) => {
    const effect = typeof previous === 'number' ? { damage: previous } : previous
    return {
      ...s,
      damage: s.damage + (effect.damage || 0) * n,
      extraSpins: s.extraSpins + (effect.extraSpins || 0) * n,
      shields: s.shields + (effect.shields || 0) * n,
      healing: (s.healing || 0) + (effect.healing || 0) * n,
    }
  },
}
export function calculateDamage(matches, previous = 0) {
  let result = {
    damage: 0,
    extraSpins: 0,
    shields: 0,
    healing: 0,
    abilities: [],
  }
  for (const match of matches) {
    const hero = HEROES.find((h) => h.id === match.id)
    if (hero) {
      result.damage += hero.baseDamage * BALANCE.matchMultipliers[match.count]
      result.abilities.push(match.count === 5 ? hero.ultimate : hero.ability)
    }
  }
  for (const match of matches.filter((m) => m.id === 'divine-rapier'))
    result = ITEM_EFFECTS[match.id](result, match.count - 2, previous)
  for (const match of matches
    .filter(
      (m) => !HEROES.some((h) => h.id === m.id) && m.id !== 'divine-rapier',
    )
    .sort(
      (a, b) =>
        Object.keys(ITEM_EFFECTS).indexOf(a.id) -
        Object.keys(ITEM_EFFECTS).indexOf(b.id),
    )) {
    result = ITEM_EFFECTS[match.id](result, match.count - 2, previous)
    result.abilities.push(match.id)
  }
  if (matches.some((m) => m.id === 'divine-rapier'))
    result.abilities.push('divine-rapier')
  return { ...result, damage: Math.round(result.damage) }
}
