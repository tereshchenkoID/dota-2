'use client'

import { useEffect } from 'react'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Text from '@/components/Text'
import { MODIFIERS } from '@/modules/Dota/arcade/modifiers'
import ArcadePanel from '@/modules/Dota/components/arcade-panel'
import BattleStats from '@/modules/Dota/components/BattleStats'
import CombatNotice from '@/modules/Dota/components/combat-notice'
import GameViewport from '@/modules/Dota/components/GameViewport'
import RoshanBoss from '@/modules/Dota/components/RoshanBoss'
import SlotMachine from '@/modules/Dota/components/SlotMachine'

import styles from './index.module.scss'
import DOTA_ARENA_STYLES from '@/modules/Dota/components/DotaGame/index.module.scss'

const ArcadeGame = () => {
  const { t, number } = useTranslation()
  const { run, stats, spinning, newRun } = useArcadeStore()
  const open = useModalStore((s) => s.openModal)
  const band = run.stage >= 10 ? 'endless' : run.stage >= 7 ? 'challenge' : run.stage >= 4 ? 'development' : 'introduction'
  const modifier = MODIFIERS.find((entry) => entry.id === run.stageConfig?.modifier)
  const reward = ['choosing-reward', 'transitioning'].includes(run.status)

  useEffect(() => {
    if (reward) open('arcade-reward')
    if (run.status === 'defeated') open('arcade-result')
  }, [run.status, run.id, run.stage, reward, open])

  if (run.status === 'idle') {
    return (
      <section className={styles.intro}>
        <Heading>
          {t('gauntlet.title')}
        </Heading>
        <Text color="muted">
          {t('gauntlet.description')}
        </Text>
        <Text>
          {t('gauntlet.rules')}
        </Text>
        <Button onClick={() => newRun()}>
          {t('gauntlet.start')}
        </Button>
        <Button
          color="secondary"
          onClick={() => open('arcade-records')}
        >
          {t('progression.arcadeRecords')}
        </Button>
      </section>
    )
  }

  return (
    <GameViewport onOpen={open}>
      <div className={clsx(styles.world, styles[band])}>
        <div className={clsx(styles.banner, run.stageConfig.elite && styles.elite)}>
          <strong>
            {t('gauntlet.stage', { stage: run.stage })}
            {' '}
            ·
            {' '}
            {t('gauntlet.title')}
          </strong>
          <span>
            {t('gauntlet.best', { stage: number(stats.bestStage) })}
            {' '}
            ·
            {t(run.stageConfig.elite ? 'gauntlet.elite' : 'gauntlet.mode')}
          </span>
        </div>
        {
modifier &&
<div className={styles.curse}>
  <Icon
    name={modifier.icon}
    size={20}
  />
  <strong>
    {t(modifier.nameKey)}
  </strong>
  <span>
    {t(modifier.descriptionKey)}
  </span>
</div>
        }
        {
run.status !== 'fighting' &&
<Button
  className={styles.resume}
  onClick={() => open(reward ? 'arcade-reward' : 'arcade-result')}
>
  {t(reward ? 'gauntlet.chooseReward' : 'gauntlet.results')}
</Button>
        }
        <div
          data-game-arena
          className={DOTA_ARENA_STYLES.arena}
        >
          <div className={clsx(styles.boss, run.stageConfig.elite && styles.empowered)}>
            <RoshanBoss
              run={run.battle}
              spinning={spinning}
              bossConfig={run.stageConfig}
            />
          </div>
          <div className={DOTA_ARENA_STYLES.playerSide}>
            <div className={DOTA_ARENA_STYLES.health}>
              <BattleStats
                run={run.battle}
                maxHp={run.maxHp}
                feedback={
                  !spinning && (run.battle.secondWindTriggered || run.battle.lastBlockSource || run.battle.lastAttack > 0) &&
                  <CombatNotice battle={run.battle} />
                }
              />
            </div>
            <div className={DOTA_ARENA_STYLES.machine}>
              <SlotMachine
                store={useArcadeStore}
                onNew={() => open('arcade-restart')}
              />
            </div>
          </div>
        </div>
        <ArcadePanel
          run={run}
          best={stats.bestStage}
        />
      </div>
    </GameViewport>
  )
}

export default ArcadeGame
