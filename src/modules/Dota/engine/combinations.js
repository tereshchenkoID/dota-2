import { PAYLINES } from '@/modules/Dota/config/paylines'
export function findCombinations(grid) {
  return PAYLINES.flatMap((line, lineIndex) => {
    const id = grid[0][line[0]]
    let count = 1
    while (count < 5 && grid[count][line[count]] === id) count++
    return count >= 3
      ? [
        {
          id,
          count,
          lineIndex,
          cells: line.slice(0, count).map((row, col) => `${col}-${row}`),
        },
      ]
      : []
  })
}
