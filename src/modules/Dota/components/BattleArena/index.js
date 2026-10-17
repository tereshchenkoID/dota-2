import styles from './index.module.scss'

const BattleArena = ({ boss, stats, children }) => {
  return (
    <div
      data-game-arena
      className={styles.arena}
    >
      {boss}
      <div className={styles.playerSide}>
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
