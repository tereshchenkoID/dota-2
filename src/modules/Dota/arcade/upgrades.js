export const UPGRADES = [
  { id: 'blade-mastery', type: 'offense', rarity: 'rare', icon: 'swords', effect: 'heroBonus', value: 0.15 },
  { id: 'critical-power', type: 'offense', rarity: 'rare', icon: 'crosshair', effect: 'criticalBonus', value: 0.35 },
  { id: 'arcane-knowledge', type: 'offense', rarity: 'rare', icon: 'sparkles', effect: 'abilityBonus', value: 0.25 },
  { id: 'fortified-armor', type: 'defense', rarity: 'common', icon: 'shield', effect: 'shields', value: 1 },
  { id: 'extra-charges', type: 'utility', rarity: 'rare', icon: 'battery-plus', effect: 'spins', value: 2 },
  { id: 'vitality', type: 'defense', rarity: 'common', icon: 'heart', effect: 'maxHp', value: 20 },
  { id: 'battle-recovery', type: 'defense', rarity: 'common', icon: 'heart-pulse', effect: 'recovery', value: 12 },
  { id: 'artifact-mastery', type: 'utility', rarity: 'rare', icon: 'gem', effect: 'artifactBonus', value: 0.25 },
  { id: 'roshan-hunter', type: 'offense', rarity: 'rare', icon: 'scan-eye', effect: 'eliteBonus', value: 0.25 },
  { id: 'second-wind', type: 'defense', rarity: 'epic', icon: 'wind', effect: 'reviveHp', value: 20 },
].map((upgrade) => ({
  maxLevel: 30,
  minStage: 1,
  ...upgrade,
  nameKey: `gauntlet.upgrades.${upgrade.id}.name`,
  descriptionKey: `gauntlet.upgrades.${upgrade.id}.description`,
}))

export function getBonuses(upgrades = {}) {
  return Object.fromEntries(UPGRADES.map((upgrade) => [upgrade.effect, Math.min(upgrade.maxLevel, Math.max(0, upgrades[upgrade.id] || 0)) * upgrade.value]))
}

export function getUpgradeValue(upgrade, level = 1) {
  const value = Math.min(upgrade.maxLevel, Math.max(0, level)) * upgrade.value
  return upgrade.value < 1 ? Math.round(value * 100) : value
}
