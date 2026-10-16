'use client'

import { useId } from 'react'
import clsx from 'clsx'

import Icon from '@/components/Icon'
import Text from '@/components/Text'

import styles from './index.module.scss'

const Input = ({
  label,
  icon,
  description,
  error,
  className,
  id,
  ...props
}) => {
  const generated = useId()
  const inputId = id || generated
  const helpId = `${inputId}-help`

  return (
    <div className={
      clsx(
        styles.block,
        className
      )
    }
    >
      {
        label &&
        <Text
          as="label"
          size={3}
          weight="semibold"
          htmlFor={inputId}
        >
          {label}
        </Text>
      }
      <div className={
        clsx(
          styles.field,
          {
            [styles.invalid]: error
          }
        )
      }
      >
        {
          icon &&
          <Icon
            className={styles.icon}
            name={icon}
            size={20}
          />
        }
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={description || error ? helpId : undefined}
          {...props}
        />
      </div>
      {
        (description || error) &&
        <Text
          id={helpId}
          size={3}
          color={error ? 'danger' : 'muted'}
        >
          {error || description}
        </Text>
      }
    </div>
  )
}

export default Input
