import styles from './index.module.scss'

const BattleArena = ({ boss, stats, children }) => {
  return (
    <div
      className={styles.block}
      data-game-arena
    >
      {boss}
      <div className={styles.side}>
        <div className={styles.health}>
          {stats}
        </div>
        <div className={styles.machine}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default BattleArena
