import { icons as ICONS } from 'lucide-react'

const Icon = ({ name, size = 24, ...props }) => {
  if (!name) return null

  const pascalName = name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
  const Component = ICONS[pascalName] || ICONS.CircleQuestionMark

  return (
    <Component
      size={size}
      {...props}
    />
  )
}

export default Icon
