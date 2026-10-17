import Image from 'next/image'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import { SYMBOLS } from '@/modules/Dota/engine/spin'

import styles from './index.module.scss'
const SlotSymbol = ({ id, winning, cell }) => {
  const symbol = SYMBOLS.find((s) => s.id === id)
  const { t } = useTranslation()
  return (
    <div
      className={clsx(styles.symbol, winning && styles.winning)}
      data-symbol-type={symbol.type}
      data-cell={cell}
      title={t(symbol.nameKey)}
      style={{ '--color-symbol': symbol.color }}
    >
      <Image
        className={styles.image}
        width={256}
        height={144}
        loading="eager"
        src={symbol.image}
        alt={t(symbol.nameKey)}
        draggable="false"
      />
    </div>
  )
}

export default SlotSymbol
