'use client'

import { useEffect, useId, useRef } from 'react'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'

import styles from './index.module.scss'

let openDialogs = 0
let bodyOverflow = ''

const Modal = ({
  title,
  children,
  onClose,
  variant = 'modal'
}) => {
  const ref = useRef(null)
  const titleId = useId()
  const { t } = useTranslation()

  useEffect(() => {
    const previous = document.activeElement
    const dialog = ref.current

    if (openDialogs === 0) {
      bodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    openDialogs += 1
    dialog.showModal()

    return () => {
      dialog.close()
      openDialogs -= 1
      if (openDialogs === 0) document.body.style.overflow = bodyOverflow
      if (previous?.isConnected) previous.focus()
    }
  }, [])

  return (
    <dialog
      ref={ref}
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
            size={2}
          >
            {title}
          </Heading>
          <Button
            color="alt"
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
