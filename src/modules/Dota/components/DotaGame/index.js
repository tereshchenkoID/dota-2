'use client'
import { useEffect } from 'react'

import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import BattleArena from '@/modules/Dota/components/BattleArena'
import BattleStats from '@/modules/Dota/components/BattleStats'
import GameViewport from '@/modules/Dota/components/GameViewport'
import RoshanBoss from '@/modules/Dota/components/RoshanBoss'
import SlotMachine from '@/modules/Dota/components/SlotMachine'

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
      <BattleArena
        boss={
          <RoshanBoss
            run={run}
            spinning={spinning}
          />
        }
        stats={<BattleStats run={run} />}
      >
        <SlotMachine onNew={() => open('restart')} />
      </BattleArena>
    </GameViewport>
  )
}

export default DotaGame
