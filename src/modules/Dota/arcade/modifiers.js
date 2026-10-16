export const MODIFIERS = [
  { id: 'enraged', icon: 'flame', effects: { attackMultiplier: 1.25 } },
  { id: 'thick-hide', icon: 'shell', effects: { receivedDamage: 0.9 } },
  { id: 'exhaustion', icon: 'battery-low', effects: { spins: -1 } },
  { id: 'brutal-strikes', icon: 'swords', effects: { attackInterval: -1 } },
].map((modifier) => ({
  ...modifier,
  nameKey: `gauntlet.modifiers.${modifier.id}.name`,
  descriptionKey: `gauntlet.modifiers.${modifier.id}.description`,
}))

export function chooseModifier(stage, random) {
  return stage < 3 ? null : MODIFIERS[Math.floor(random() * MODIFIERS.length)].id
}
