export const STORAGE_KEY = 'dota-spins-v1'

export const SAFE_STORAGE = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* Private mode / full quota: play in memory. */
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      /* Unavailable storage. */
    }
  },
}
