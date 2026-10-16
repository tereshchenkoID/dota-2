export function secureRandom() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296
}

export function seededRandom(seed = 1) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
}
