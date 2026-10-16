'use client'

import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import Icon from '@/components/Icon'
import Link from '@/components/Link'

import styles from './index.module.scss'

const Logo = ({ className }) => {
  const { t } = useTranslation()

  return (
    <Link
      href="/"
      className={
        clsx(
          styles.block,
          className
        )
      }
      aria-label={t('site.brand')}
    >
      <Icon
        name="sparkles"
        size={30}
        className={styles.svg}
      />
      <span>
        {t('site.brand')}
        <small className={styles.small}>
          {t('site.tagline')}
        </small>
      </span>
    </Link>
  )
}

export default Logo
