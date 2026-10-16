export const RUNES = [
  { id: 'double-damage', rarity: 'epic', icon: 'swords', durationType: 'spins', duration: 3, effects: { damageMultiplier: 2 } },
  { id: 'regeneration', rarity: 'common', icon: 'heart-pulse', durationType: 'entry', duration: 1, effects: { healing: 35 } },
  { id: 'haste', rarity: 'rare', icon: 'wind', durationType: 'entry', duration: 1, effects: { spins: 3 } },
  { id: 'arcane', rarity: 'rare', icon: 'sparkles', durationType: 'spins', duration: 5, effects: { abilityBonus: 0.5 } },
  { id: 'invisibility', rarity: 'common', icon: 'ghost', durationType: 'attacks', duration: 1, effects: { blocks: 1 } },
  { id: 'shield', rarity: 'common', icon: 'shield-plus', durationType: 'entry', duration: 1, effects: { shields: 2 } },
  { id: 'illusion', rarity: 'rare', icon: 'copy', durationType: 'spins', duration: 3, effects: { heroEcho: 0.4 } },
].map((rune) => ({
  ...rune,
  type: 'rune',
  maxLevel: 1,
  minStage: 1,
  nameKey: `gauntlet.runes.${rune.id}.name`,
  descriptionKey: `gauntlet.runes.${rune.id}.description`,
}))

export function activateRune(battle, preparedRune, maxHp) {
  const rune = RUNES.find((entry) => entry.id === preparedRune)
  if (!rune) return { battle, activeRune: null, preparedRune: null }
  const next = {
    ...battle,
    hp: Math.min(maxHp, battle.hp + (rune.effects.healing || 0)),
    spins: battle.spins + (rune.effects.spins || 0),
    shields: battle.shields + (rune.effects.shields || 0),
  }
  return {
    battle: next,
    preparedRune: null,
    activeRune: rune.durationType === 'entry' ? null : { id: rune.id, remaining: rune.duration },
  }
}

export function consumeRune(activeRune, event) {
  if (!activeRune) return null
  const rune = RUNES.find((entry) => entry.id === activeRune.id)
  if (!rune || rune.durationType !== event) return activeRune
  return activeRune.remaining > 1 ? { ...activeRune, remaining: activeRune.remaining - 1 } : null
}
