export const THEME_STORAGE_KEY = 'spin-arcade-appearance-v1'
export const THEMES = ['dark', 'light', 'system']

export function normalizeTheme(value) {
  return THEMES.includes(value) ? value : 'dark'
}

export function resolveTheme(value, systemLight = false) {
  const theme = normalizeTheme(value)
  return theme === 'system' ? systemLight ? 'light' : 'dark' : theme
}

// Runs in the document head before paint; the stored string is validated.
export const THEME_BOOTSTRAP = `(() => { try { const saved = JSON.parse(localStorage.getItem('${THEME_STORAGE_KEY}') || 'null'); const choice = saved?.state?.theme; const theme = ['dark', 'light', 'system'].includes(choice) ? choice : 'dark'; document.documentElement.dataset.theme = theme === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : theme; } catch { document.documentElement.dataset.theme = 'dark'; } })()`
