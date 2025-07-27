import React from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white'
      case 'secondary':
        return 'bg-gray-500 text-white'
      case 'danger':
        return 'bg-red-500 text-white'
      default:
        return ''
    }
  }

  return (
    <button
      className={`py-2 px-4 rounded ${getButtonClass()}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default Button
