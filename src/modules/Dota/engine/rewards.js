import { BALANCE } from '@/modules/Dota/config/balance'
export function getRewards(run) {
  const won = run.status === 'won'
  return {
    xp: won ? 180 : 40 + Math.floor(run.totalDamage / 20),
    gold: won ? 250 : Math.floor(run.totalDamage / 10),
  }
}
export function applyRewards(progress, run) {
  const reward = getRewards(run)
  const xp = progress.xp + reward.xp
  return {
    ...progress,
    xp,
    level: 1 + Math.floor(xp / BALANCE.xpPerLevel),
    gold: progress.gold + reward.gold,
    wins: progress.wins + (run.status === 'won' ? 1 : 0),
    losses: progress.losses + (run.status === 'lost' ? 1 : 0),
    best: Math.max(progress.best, run.totalDamage),
  }
}
