export const BOSS_CONFIG = {
  id: 'roshan',
  maxHp: 1000,
  attackInterval: 3,
  phases: [
    { threshold: 0.66, damage: 5 },
    { threshold: 0.3, damage: 10 },
    { threshold: 0, damage: 15 },
  ],
}
export function getPhase(hp, maxHp = BOSS_CONFIG.maxHp) {
  return BOSS_CONFIG.phases.findIndex(
    (p) => hp / maxHp > p.threshold,
  ) === -1
    ? 2
    : BOSS_CONFIG.phases.findIndex((p) => hp / maxHp > p.threshold)
}
