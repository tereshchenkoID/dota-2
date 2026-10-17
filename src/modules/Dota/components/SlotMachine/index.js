'use client'

import { useEffect, useRef, useState } from 'react'

import { useTranslation } from '@/hooks/useTranslation'
import { useGameStore } from '@/modules/Dota/store/game'

import Icon from '@/components/Icon'
import GameButton from '@/modules/Dota/components/GameButton'

import SlotOutcome from './SlotOutcome'
import SlotReel from './SlotReel'
import SpinButton from './SpinButton'
import WinningLines from './WinningLines'

import styles from './index.module.scss'

import { playSound, unlockAudio } from '@/lib/sound'
const SlotMachine = ({ onNew, store: useStore = useGameStore }) => {
  const { t, number } = useTranslation()
  const state = useStore()
  const { pending, spinning, beginSpin, finishSpin } = state
  const run = state.run.battle || state.run
  const settings = useGameStore((s) => s.settings)
  const reelsRef = useRef(null)
  const [stopped, setStopped] = useState(0)
  useEffect(() => {
    if (!spinning) return
    const getRun = () => useStore.getState().run.battle || useStore.getState().run
    const timers = Array.from({ length: 5 }, (_, i) =>
      setTimeout(
        () => {
          setStopped(i + 1)
          if (useGameStore.getState().settings.sound) playSound('stop')
        },
        550 + i * 180,
      ),
    )
    timers.push(
      setTimeout(() => {
        finishSpin()
        if (
          useGameStore.getState().settings.sound &&
          getRun().lastDamage
        )
          playSound('hit')
        if (
          useGameStore.getState().settings.sound &&
          getRun().lastHealing
        )
          playSound('heal')
        if (
          useGameStore.getState().settings.sound &&
          getRun().lastAttack > 0
        )
          playSound('boss-attack')
      }, 1450),
    )
    return () => timers.forEach(clearTimeout)
  }, [spinning, finishSpin, useStore])
  const spin = () => {
    if (beginSpin()) {
      setStopped(0)
      if (settings.sound) {
        unlockAudio()
        playSound('spin')
      }
    }
  }
  const winning = run.matches.flatMap((m) => m.cells)
  return (
    <section className={styles.machine}>
      <div className={styles.machineHeading}>
        <span className={styles.label}>
          <Icon
            className={styles.glyph}
            name="gem"
            size={16}
          />
          {' '}
          {t('game.paylines')}
        </span>
        <span className={styles.label}>
          {t('game.match')}
        </span>
      </div>
      <div className={styles.reelsFrame}>
        <div className={styles.paylineMarker}>
          <Icon
            className={styles.glyph}
            name="chevron-right"
            size={24}
          />
        </div>
        <div
          className={styles.reels}
          ref={reelsRef}
        >
          {
            run.grid.map((column, i) => (
              <SlotReel
                key={i}
                index={i}
                column={spinning && pending && i < stopped ? pending[i] : column}
                rolling={spinning && i >= stopped}
                winning={spinning ? [] : winning}
              />
            ))
          }
          {
            !spinning && run.matches.length > 0 &&
            <WinningLines
              key={run.turn}
              containerRef={reelsRef}
              matches={run.matches}
            />
          }
          <SlotOutcome
            run={run}
            spinning={spinning}
          />
        </div>
        <div className={styles.paylineMarker}>
          <Icon
            className={styles.glyph}
            name="chevron-left"
            size={24}
          />
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.remaining}>
          <b className={styles.value}>
            {number(run.spins)}
          </b>
          <span className={styles.label}>
            {t('game.spinsLeft')}
          </span>
        </div>
        <SpinButton
          spinning={spinning}
          disabled={spinning || run.status !== 'active'}
          onClick={spin}
        />
      </div>
      <div className={styles.machineFooter}>
        <span className={styles.label}>
          <i className={styles.fill} />
          {' '}
          {t('game.saved')}
        </span>
        <GameButton
          variant="secondary"
          onClick={onNew}
          disabled={spinning}
          aria-haspopup="dialog"
        >
          <Icon
            className={styles.glyph}
            name="rotate-ccw"
            size={20}
          />
          {' '}
          {t('game.restart')}
        </GameButton>
      </div>
    </section>
  )
}

export default SlotMachine
