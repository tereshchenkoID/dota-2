'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { useScrollLock } from '@/hooks/useScrollLock'
import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Icon from '@/components/Icon'
import GameButton from '@/modules/Dota/components/GameButton'

import styles from './index.module.scss'

import { stopSounds, unlockAudio } from '@/lib/sound'

const GameViewport = ({ children, onOpen }) => {
  const { t } = useTranslation()
  const setPortalTarget = useModalStore((s) => s.setPortalTarget)
  const sound = useGameStore((s) => s.settings.sound)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const ref = useRef(null)

  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const immersive = nativeFullscreen || expanded

  useEffect(() => {
    setPortalTarget(ref.current)
    return () => setPortalTarget(null)
  }, [setPortalTarget])

  useScrollLock(expanded)

  useEffect(() => {
    if (!sound) stopSounds()
  }, [sound])

  useEffect(() => {
    const sync = () => setNativeFullscreen(document.fullscreenElement === ref.current)
    const escape = (event) => {
      if (
        event.key === 'Escape' &&
        !event.target.closest?.('dialog') &&
        !ref.current?.querySelector('dialog[open]')
      )
        setExpanded(false)
    }
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('keydown', escape, true)

    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('keydown', escape, true)
    }
  }, [])

  useEffect(() => {
    if (!expanded) return
    const inertSiblings = []
    let branch = ref.current

    while (branch?.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          inertSiblings.push([sibling, sibling.inert])
          sibling.inert = true
        }
      }
      branch = branch.parentElement
    }
    return () => {
      for (const [element, wasInert] of inertSiblings) element.inert = wasInert
    }
  }, [expanded])

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === ref.current) {
      await document.exitFullscreen()
    } else if (expanded) {
      setExpanded(false)
    } else {
      try {
        if (!document.fullscreenEnabled || !ref.current.requestFullscreen)
          throw new Error('Fullscreen unavailable')
        await ref.current.requestFullscreen()
        if (document.fullscreenElement !== ref.current) setExpanded(true)
      } catch {
        // iOS and embedded browsers can use the same immersive layout in-page.
        setExpanded(true)
      }
    }
  }

  const soundClick = () => {
    if (!sound) unlockAudio()
    else stopSounds()
    toggleSound()
  }

  return (
    <section
      ref={ref}
      className={
        clsx(
          styles.block,
          {
            [styles.immersive]: immersive,
            [styles.expanded]: expanded
          }
        )
      }
      aria-label={t('app.title')}
    >
      <header className={styles.toolbar}>
        <div className={styles.game}>
          <Image
            className={styles.image}
            width={60}
            height={60}
            src="/assets/ui/dota-logo.png"
            alt=""
          />
          <div>
            <h2 className={styles.title}>
              {t('app.title')}
            </h2>
            <span className={styles.label}>
              {t('app.tagline')}
            </span>
          </div>
        </div>
        <div className={styles.actions}>
          <GameButton
            variant="secondary"
            square
            type="button"
            onClick={() => onOpen('guide')}
            aria-label={t('nav.guide')}
          >
            <Icon
              name="circle-question-mark"
              size={20}
            />
          </GameButton>
          <GameButton
            variant="secondary"
            square
            type="button"
            onClick={soundClick}
            aria-label={t('header.sound')}
            aria-pressed={sound}
          >
            <Icon
              name={sound ? 'volume-2' : 'volume-x'}
              size={20}
            />
          </GameButton>
          <GameButton
            variant="secondary"
            square
            type="button"
            onClick={() => onOpen('settings')}
            aria-label={t('header.settings')}
          >
            <Icon
              name="settings"
              size={20}
            />
          </GameButton>
          <GameButton
            variant="secondary"
            square
            type="button"
            onClick={toggleFullscreen}
            title={t(immersive ? 'game.exitFullscreen' : 'game.fullscreen')}
            aria-label={t(immersive ? 'game.exitFullscreen' : 'game.fullscreen')}
            aria-pressed={immersive}
          >
            <Icon
              name={immersive ? 'minimize' : 'maximize'}
              size={20}
            />
          </GameButton>
        </div>
      </header>
      <div className={styles.body}>
        {children}
      </div>
    </section>
  )
}

export default GameViewport
