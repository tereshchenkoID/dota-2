import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = new URL('../src/', import.meta.url)
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/') || (specifier.startsWith('.') && context.parentURL?.startsWith(ROOT.href))) {
      const url = specifier.startsWith('@/') ? new URL(specifier.slice(2), ROOT) : new URL(specifier, context.parentURL)
      const path = fileURLToPath(url)
      const target = [path, `${path}.js`, `${path}/index.js`].find((entry) => existsSync(entry) && entry.endsWith('.js'))
      if (target) return nextResolve(pathToFileURL(target).href, context)
    }
    return nextResolve(specifier, context)
  },
})
