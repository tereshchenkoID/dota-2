'use client'

import { useEffect } from 'react'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Text from '@/components/Text'
import ArcadePanel from '@/modules/Dota/components/arcade-panel'
import BattleStats from '@/modules/Dota/components/BattleStats'
import GameViewport from '@/modules/Dota/components/GameViewport'
import RoshanBoss from '@/modules/Dota/components/RoshanBoss'
import SlotMachine from '@/modules/Dota/components/SlotMachine'

import styles from './index.module.scss'
import DOTA_ARENA_STYLES from '@/modules/Dota/components/DotaGame/index.module.scss'

const ArcadeGame = () => {
  const { t } = useTranslation()
  const { run, stats, spinning, newRun } = useArcadeStore()
  const open = useModalStore((s) => s.openModal)
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
      </section>
    )
  }

  return (
    <GameViewport onOpen={open}>
      <div className={clsx(styles.banner, run.stageConfig.elite && styles.elite)}>
        <strong>
          {t('gauntlet.stage', { stage: run.stage })}
          {' '}
          ·
          {' '}
          {t('gauntlet.title')}
        </strong>
        <span>
          {t(run.stageConfig.elite ? 'gauntlet.elite' : 'gauntlet.mode')}
        </span>
      </div>
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
          <div className={styles.health}>
            <BattleStats
              run={run.battle}
              maxHp={run.maxHp}
            />
          </div>
          <div className={styles.machine}>
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
    </GameViewport>
  )
}

export default ArcadeGame
