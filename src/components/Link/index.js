'use client'

import clsx from 'clsx'

import { isExternalHref, Link as LocaleLink } from '@/i18n/navigation'

import styles from './index.module.scss'

const Link = ({
  href,
  children,
  className = '',
  ...props
}) => {
  const external = isExternalHref(href)
  const Component = external ? 'a' : LocaleLink

  return (
    <Component
      href={href}
      className={clsx(styles.link, className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Link
