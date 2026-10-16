export const RUNES = [
  { id: 'double-damage', rarity: 'epic', icon: 'swords', durationType: 'spins', duration: 6, effects: { damageMultiplier: 2 } },
  { id: 'regeneration', rarity: 'common', icon: 'heart-pulse', durationType: 'entry', duration: 1, effects: { healing: 50 } },
  { id: 'haste', rarity: 'rare', icon: 'wind', durationType: 'entry', duration: 1, effects: { spins: 6 } },
  { id: 'arcane', rarity: 'rare', icon: 'sparkles', durationType: 'spins', duration: 8, effects: { abilityBonus: 0.75 } },
  { id: 'invisibility', rarity: 'common', icon: 'ghost', durationType: 'attacks', duration: 2, effects: { blocks: 1, healing: 15 } },
  { id: 'shield', rarity: 'common', icon: 'shield-plus', durationType: 'entry', duration: 1, effects: { shields: 4 } },
  { id: 'illusion', rarity: 'rare', icon: 'copy', durationType: 'spins', duration: 5, effects: { heroEcho: 0.75 } },
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
  next.healingReceived = (battle.healingReceived || 0) + Math.max(0, next.hp - battle.hp)
  next.bonusSpinsEarned = (battle.bonusSpinsEarned || 0) + (rune.effects.spins || 0)
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

export function getRuneValues(rune) {
  return {
    duration: rune.duration,
    healing: rune.effects.healing || 0,
    spins: rune.effects.spins || 0,
    shields: rune.effects.shields || 0,
    bonus: Math.round((rune.effects.abilityBonus || rune.effects.heroEcho || 0) * 100),
    multiplier: rune.effects.damageMultiplier || 1,
  }
}
