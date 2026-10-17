'use client'

import { useLayoutEffect } from 'react'

const LOCKS = new Map()
const PROPERTIES = ['overflow-x', 'overflow-y', 'overscroll-behavior-x', 'overscroll-behavior-y']

const lock = (element) => {
  const existing = LOCKS.get(element)
  if (existing) {
    existing.count += 1
    return
  }

  const properties = PROPERTIES.map((property) => ({
    property,
    value: element.style.getPropertyValue(property),
    priority: element.style.getPropertyPriority(property),
  }))

  LOCKS.set(element, { count: 1, properties })
  element.style.setProperty('overflow', 'hidden')
  element.style.setProperty('overscroll-behavior', 'none')
}

const unlock = (element) => {
  const entry = LOCKS.get(element)
  if (!entry || --entry.count > 0) return

  for (const { property, value, priority } of entry.properties) {
    if (value) element.style.setProperty(property, value, priority)
    else element.style.removeProperty(property)
  }
  LOCKS.delete(element)
}

export const useScrollLock = (active, scope) => {
  useLayoutEffect(() => {
    if (!active) return

    const elements = new Set([document.documentElement, document.body])
    for (let element = scope?.current?.parentElement; element && element !== document.body; element = element.parentElement) {
      const style = getComputedStyle(element)
      if (/(auto|scroll)/.test(`${style.overflowX} ${style.overflowY}`) || LOCKS.has(element)) {
        elements.add(element)
      }
    }

    elements.forEach(lock)
    return () => elements.forEach(unlock)
  }, [active, scope])
}
