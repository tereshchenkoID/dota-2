export const UPGRADES = [
  { id: 'blade-mastery', type: 'offense', rarity: 'rare', icon: 'swords', effect: 'heroBonus', value: 0.1 },
  { id: 'critical-power', type: 'offense', rarity: 'rare', icon: 'crosshair', effect: 'criticalBonus', value: 0.15 },
  { id: 'arcane-knowledge', type: 'offense', rarity: 'rare', icon: 'sparkles', effect: 'abilityBonus', value: 0.1 },
  { id: 'fortified-armor', type: 'defense', rarity: 'common', icon: 'shield', effect: 'shields', value: 1 },
  { id: 'extra-charges', type: 'utility', rarity: 'rare', icon: 'battery-plus', effect: 'spins', value: 1 },
  { id: 'vitality', type: 'defense', rarity: 'common', icon: 'heart', effect: 'maxHp', value: 15 },
  { id: 'battle-recovery', type: 'defense', rarity: 'common', icon: 'heart-pulse', effect: 'recovery', value: 10 },
  { id: 'artifact-mastery', type: 'utility', rarity: 'rare', icon: 'gem', effect: 'artifactBonus', value: 0.1 },
  { id: 'roshan-hunter', type: 'offense', rarity: 'rare', icon: 'scan-eye', effect: 'eliteBonus', value: 0.1 },
  { id: 'second-wind', type: 'defense', rarity: 'epic', icon: 'wind', effect: 'reviveHp', value: 10, maxLevel: 2 },
].map((upgrade) => ({
  maxLevel: 3,
  minStage: 1,
  ...upgrade,
  nameKey: `gauntlet.upgrades.${upgrade.id}.name`,
  descriptionKey: `gauntlet.upgrades.${upgrade.id}.description`,
}))

export function getBonuses(upgrades = {}) {
  return Object.fromEntries(UPGRADES.map((upgrade) => [upgrade.effect, Math.min(upgrade.maxLevel, Math.max(0, upgrades[upgrade.id] || 0)) * upgrade.value]))
}
