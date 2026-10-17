'use client'

import { useEffect, useId, useRef } from 'react'
import clsx from 'clsx'

import { useScrollLock } from '@/hooks/useScrollLock'
import { useTranslation } from '@/hooks/useTranslation'
import { useAppearanceStore } from '@/store/appearance'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'

import styles from './index.module.scss'

const Modal = ({
  title,
  children,
  onClose,
  variant = 'modal'
}) => {
  const ref = useRef(null)
  const titleId = useId()
  const { t } = useTranslation()
  const theme = useAppearanceStore((state) => state.resolvedTheme)

  useScrollLock(true, ref)

  useEffect(() => {
    const previous = document.activeElement
    const dialog = ref.current

    dialog.showModal()

    return () => {
      dialog.close()
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={ref}
      data-theme={theme}
      className={
        clsx(
          styles.block,
          {
            [styles.drawer]: variant === 'drawer'
          }
        )
      }
      aria-labelledby={titleId}
      onCancel={
        (event) => {
          event.preventDefault()
          event.stopPropagation()
          onClose()
        }
      }
      onClick={
        (event) => {
          if (event.target === event.currentTarget) onClose()
        }
      }
    >
      <div className={styles.content}>
        <div className={styles.headline}>
          <Heading
            id={titleId}
            as="h2"
            size={3}
          >
            {title}
          </Heading>
          <Button
            color="secondary"
            square={true}
            onClick={onClose}
            aria-label={t('ui.close')}
          >
            <Icon
              name="x"
              size={22}
            />
          </Button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </dialog>
  )
}

export default Modal
