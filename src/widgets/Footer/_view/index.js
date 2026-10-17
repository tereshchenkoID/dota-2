'use client'

import { useTranslation } from '@/hooks/useTranslation'

import Button from '@/components/Button'
import Container from '@/components/Container'
import Icon from '@/components/Icon'
import Logo from '@/components/Logo'
import Text from '@/components/Text'

import styles from './index.module.scss'

const FooterView = () => {
  const { t } = useTranslation()

  return (
    <footer className={styles.block}>
      <Container className={styles.container}>
        <div className={styles.copy}>
          <Logo />
          <Text
            size={3}
            color="muted"
          >
            ©
            {' '}
            {new Date().getFullYear()}
            {' · '}
            {t('footer.note')}
          </Text>
          <Text
            size={3}
            color="muted"
          >
            {t('footer.assets')}
          </Text>
        </div>
        <div className={styles.actions}>
          <Button
            color="secondary"
            square
            aria-label={t('footer.top')}
            onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
          >
            <Icon
              name="arrow-up"
              size={20}
            />
          </Button>
        </div>
      </Container>
    </footer>
  )
}

export default FooterView
