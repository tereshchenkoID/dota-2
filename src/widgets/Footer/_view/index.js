'use client'

import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Logo from '@/components/Logo'
import Text from '@/components/Text'

import styles from './index.module.scss'

const Section = () => {
  const { t } = useTranslation()

  return (
    <footer className={styles.block}>
      <div className={styles.container}>
        <div className={clsx(styles.brand, styles.item)}>
          <Logo />
          <Text
            className={styles.description}
            size={3}
            color="muted"
          >
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            ·
            {' '}
            {t('footer.note')}
          </Text>
        </div>
        <Text
          className={clsx(styles.description, styles.item)}
          size={3}
          color="muted"
        >
          {t('footer.assets')}
        </Text>
        <Button
          className={clsx(styles.control, styles.item)}
          color="default"
          onClick={
            () =>
              window.scrollTo({
              top: 0,
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                .matches
                ? 'instant'
                : 'smooth',
            })
          }
        >
          <Icon
            name="arrow-up"
            size={18}
          />
          {t('footer.top')}
        </Button>
      </div>
    </footer>
  )
}

export default Section
