'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Icon from '@/components/Icon'

import styles from './index.module.scss'

import { stopSounds, unlockAudio } from '@/lib/sound'

const GameViewport = ({ children, onOpen }) => {
  const ref = useRef(null)
  const setPortalTarget = useModalStore((s) => s.setPortalTarget)
  useEffect(() => {
    setPortalTarget(ref.current)
    return () => setPortalTarget(null)
  }, [setPortalTarget])
  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  const sound = useGameStore((s) => s.settings.sound)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const immersive = nativeFullscreen || expanded
  useEffect(() => {
    if (!sound) stopSounds()
  }, [sound])
  useEffect(() => {
    const sync = () =>
      setNativeFullscreen(document.fullscreenElement === ref.current)
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
    const previous = document.body.style.overflow
    const scrollY = window.scrollY
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
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
      for (const [element, wasInert] of inertSiblings) element.inert = wasInert
      window.scrollTo({ top: scrollY, behavior: 'instant' })
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
          styles.viewport,
          immersive && styles.immersive,
          expanded && styles.expanded,
        )
      }
      aria-label={t('app.title')}
    >
      <header className={styles.toolbar}>
        <div className={styles.gameBrand}>
          <Image
            className={styles.image}
            width={634}
            height={591}
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
        <div className={styles.toolbarActions}>
          <button
            className={styles.control}
            type="button"
            onClick={() => onOpen('guide')}
            aria-label={t('nav.guide')}
          >
            <Icon
              name="circle-question-mark"
              size={21}
            />
          </button>
          <button
            className={styles.control}
            type="button"
            onClick={soundClick}
            aria-label={t('header.sound')}
            aria-pressed={sound}
          >
            {
              sound ? (
                <Icon
                  name="volume-2"
                  size={21}
                />
              ) : (
                <Icon
                  name="volume-x"
                  size={21}
                />
              )
            }
          </button>
          <button
            className={styles.control}
            type="button"
            onClick={() => onOpen('settings')}
            aria-label={t('header.settings')}
          >
            <Icon
              name="settings"
              size={21}
            />
          </button>
          <button
            className={styles.control}
            type="button"
            onClick={toggleFullscreen}
            aria-label={
              t(
                immersive ? 'game.exitFullscreen' : 'game.fullscreen',
              )
            }
            aria-pressed={immersive}
            title={t(immersive ? 'game.exitFullscreen' : 'game.fullscreen')}
          >
            {
              immersive ? (
                <Icon
                  name="minimize"
                  size={21}
                />
              ) : (
                <Icon
                  name="maximize"
                  size={21}
                />
              )
            }
          </button>
        </div>
      </header>
      <div className={styles.viewportBody}>
        {children}
      </div>
    </section>
  )
}

export default GameViewport
