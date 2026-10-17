'use client'

import clsx from 'clsx'

import { useWinningLines } from '@/hooks/useWinningLines'

import { LINE_COLORS } from '@/modules/Dota/config/paylines'

import styles from './index.module.scss'

const WinningLines = ({ containerRef, matches }) => {
  const geometry = useWinningLines(containerRef, matches)
  if (!geometry) return null

  return (
    <svg
      className={styles.overlay}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      preserveAspectRatio="none"
    >
      {
        geometry.lines.map(({ lineIndex, points }) => (
          <g
            key={lineIndex}
            style={{ '--color-win-line': LINE_COLORS[lineIndex] }}
          >
            <polyline
              className={clsx(styles.outline, styles.path)}
              points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
            />
            <polyline
              className={clsx(styles.trace, styles.path)}
              pathLength="1"
              points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
            />
            {
              points.map(({ x, y }, index) => (
                <circle
                  className={styles.point}
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                />
              ))
            }
          </g>
        ))
      }
    </svg>
  )
}

export default WinningLines
