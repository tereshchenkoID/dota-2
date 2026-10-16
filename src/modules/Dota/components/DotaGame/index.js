'use client'
import { useEffect } from 'react'

import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import BattleStats from '@/modules/Dota/components/BattleStats'
import GameViewport from '@/modules/Dota/components/GameViewport'
import RoshanBoss from '@/modules/Dota/components/RoshanBoss'
import SlotMachine from '@/modules/Dota/components/SlotMachine'

import styles from './index.module.scss'
const DotaGame = () => {
  const run = useGameStore((s) => s.run)
  const spinning = useGameStore((s) => s.spinning)
  const open = useModalStore((s) => s.openModal)
  const showResult = useModalStore((s) => s.showResult)
  useEffect(() => {
    showResult(run)
  }, [run, showResult])

  return (
    <GameViewport onOpen={open}>
      <div
        data-game-arena
        className={styles.arena}
      >
        <RoshanBoss
          run={run}
          spinning={spinning}
        />
        <div className={styles.playerSide}>
          <SlotMachine onNew={() => open('restart')} />
          <BattleStats run={run} />
        </div>
      </div>
    </GameViewport>
  )
}

export default DotaGame
