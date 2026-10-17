import clsx from 'clsx'

import { SYMBOLS } from '@/modules/Dota/engine/spin'

import SlotSymbol from './SlotSymbol'

import styles from './index.module.scss'
const SlotReel = ({ column, index, rolling, winning }) => {
  const sequence = Array.from(
    { length: 8 },
    (_, i) => SYMBOLS[(i + index * 3) % SYMBOLS.length].id,
  )
  const strip = rolling ? [...sequence, ...sequence] : column
  return (
    <div
      className={styles.reel}
      data-reel={index}
    >
      <div className={
        clsx(
          styles.window,
          rolling ? styles.rolling : styles.stopped,
        )
      }
      >
        <div
          key={rolling ? 'rolling' : column.join('-')}
          className={styles.track}
          aria-hidden={rolling || undefined}
        >
          {
            strip.map((id, row) => (
              <SlotSymbol
                key={`${row}-${id}`}
                id={id}
                cell={rolling ? undefined : `${index}-${row}`}
                winning={!rolling && winning.includes(`${index}-${row}`)}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default SlotReel
