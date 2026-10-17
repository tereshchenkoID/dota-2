'use client'

import { useLayoutEffect } from 'react'

const GAP = 8
const PADDING = 12
const WIDTH = 232
const HEIGHT = 320

export const useSelectPosition = ({ open, trigger, menu, onOpenChange }) => {
  useLayoutEffect(() => {
    if (!open || !trigger.current || !menu.current) return

    const control = trigger.current
    const list = menu.current
    const viewport = window.visualViewport
    const dialog = control.closest('dialog')
    const position = () => {
      const unit = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16
      const gap = GAP * unit
      const padding = PADDING * unit
      const anchor = control.getBoundingClientRect()
      const frame = dialog?.getBoundingClientRect()
      const leftEdge = Math.max(viewport?.offsetLeft || 0, frame?.left || 0) + padding
      const topEdge = Math.max(viewport?.offsetTop || 0, frame?.top || 0) + padding
      const rightEdge = Math.min((viewport?.offsetLeft || 0) + (viewport?.width || window.innerWidth), frame?.right ?? window.innerWidth) - padding
      const bottomEdge = Math.min((viewport?.offsetTop || 0) + (viewport?.height || window.innerHeight), frame?.bottom ?? window.innerHeight) - padding
      if (anchor.bottom <= topEdge || anchor.top >= bottomEdge || anchor.right <= leftEdge || anchor.left >= rightEdge) {
        onOpenChange(false)
        return
      }

      const width = Math.min(Math.max(anchor.width, WIDTH * unit), Math.max(0, rightEdge - leftEdge))

      list.style.width = `${width}px`
      const desired = Math.min(list.scrollHeight + 2 * unit, HEIGHT * unit)
      const below = Math.max(0, bottomEdge - anchor.bottom - gap)
      const above = Math.max(0, anchor.top - topEdge - gap)
      const upward = below < desired && above > below
      const height = Math.min(desired, upward ? above : below)
      // Follow the nearest container edge before clamping to the visible bounds.
      const alignRight = anchor.left - leftEdge > rightEdge - anchor.right
      const aligned = alignRight ? anchor.right - width : anchor.left
      const left = Math.max(leftEdge, Math.min(aligned, rightEdge - width))
      const top = upward ? anchor.top - gap - height : anchor.bottom + gap

      const inlineStart = getComputedStyle(list).direction === 'rtl'
        ? document.documentElement.clientWidth - left - width
        : left
      list.style.insetInlineStart = `${inlineStart}px`
      list.style.insetBlockStart = `${Math.max(topEdge, top)}px`
      list.style.maxHeight = `${height}px`
    }

    list.showPopover()
    position()

    const observer = new ResizeObserver(position)
    observer.observe(control)
    if (dialog) observer.observe(dialog)
    window.addEventListener('resize', position)
    document.addEventListener('scroll', position, true)
    viewport?.addEventListener('resize', position)
    viewport?.addEventListener('scroll', position)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', position)
      document.removeEventListener('scroll', position, true)
      viewport?.removeEventListener('resize', position)
      viewport?.removeEventListener('scroll', position)
      if (list.matches(':popover-open')) list.hidePopover()
    }
  }, [open, trigger, menu, onOpenChange])
}
