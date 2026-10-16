'use client'

import { Suspense, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'

import Modal from '@/components/Modal'
import Text from '@/components/Text'

import { MODAL_REGISTRY } from './registry'

const Modals = () => {
  const { modals, portalTarget, closeModal, closeAllModals } = useModalStore()
  const { t } = useTranslation()
  const pathname = usePathname()

  useLayoutEffect(() => {
    closeAllModals()
  }, [pathname, closeAllModals])

  if (!modals.length) return null

  return createPortal(
    modals.map((entry) => {
      const registration = MODAL_REGISTRY[entry.name]

      if (!registration) return null

      const definition = registration.resolve?.(pathname) || registration
      const { Component, title, variant } = definition
      const titleKey = typeof title === 'function' ? title(entry.props) : title

      return (
        <Modal
          key={entry.id}
          title={t(titleKey)}
          variant={variant}
          onClose={closeModal}
          {...entry.options}
        >
          <Suspense fallback={
            <Text role="status">
              {t('ui.loading')}
            </Text>
          }
          >
            <Component
              {...definition.props}
              {...entry.props}
              onClose={closeModal}
            />
          </Suspense>
        </Modal>
      )
    }),
    portalTarget || document.body,
  )
}

export default Modals
