'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'

import Icon from '@/components/Icon'

import styles from './index.module.scss'

const Select = ({ value, options, onChange, label }) => {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [menuShift, setMenuShift] = useState(0)

  const root = useRef(null)
  const trigger = useRef(null)
  const optionRefs = useRef([])
  const id = useId()
  const selected =
    options.find((option) => option.value === value) || options[0]

  useEffect(() => {
    if (!open) return
    optionRefs.current[active]?.focus()
  }, [open, active])

  useEffect(() => {
    if (!open) return
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  const show = () => {
    const unit = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const width = Math.min(14.5 * unit, window.innerWidth - 1.5 * unit)
    const edge = trigger.current.getBoundingClientRect().right
    setMenuShift(Math.max(0, 0.75 * unit - (edge - width)) / unit)
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    )
    setOpen(true)
  }

  const choose = (next) => {
    onChange(next)
    setOpen(false)
    trigger.current?.focus()
  }

  const navigate = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setActive(
        (index) =>
          (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
          options.length,
      )
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActive(event.key === 'Home' ? 0 : options.length - 1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      trigger.current?.focus()
    }
  }

  return (
    <div
      ref={root}
      className={
        clsx(
          styles.block,
          {
            [styles.open]: open,
          }
        )
      }
      onBlur={
        (event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
        }
      }
    >
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={
          (event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              show()
            }
          }
        }
      >
        <span>
          {
            selected.short || selected.label
          }
        </span>
        <Icon
          name="chevron-down"
          size={16}
          className={clsx(styles.arrow, styles.glyph)}
        />
      </button>
      {
        open &&
        <div
          id={id}
          className={styles.menu}
          style={{ '--shift': `${-menuShift}rem` }}
          role="listbox"
          aria-label={label}
          onKeyDown={navigate}
        >
          {
            options.map((option, index) =>
              <button
                ref={
                  (element) => {
                    optionRefs.current[index] = element
                  }
                }
                type="button"
                role="option"
                aria-selected={option.value === value}
                tabIndex={-1}
                key={option.value}
                className={styles.option}
                onClick={() => choose(option.value)}
              >
                <span className={styles.code}>
                  {option.short}
                </span>
                <span>
                  {option.label}
                </span>
                {
                  option.value === value &&
                  <Icon
                    className={styles.glyph}
                    name="check"
                    size={18}
                  />
                }
              </button>
            )
          }
        </div>
      }
    </div>
  )
}

export default Select
