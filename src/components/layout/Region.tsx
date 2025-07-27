import React from 'react'

interface RegionProps {
  id: string
  name: string
  type: string
  children?: React.ReactNode
  style?: React.CSSProperties
  onToggle?: () => void
  isCollapsed?: boolean
}

const Region: React.FC<RegionProps> = ({
  id,
  name,
  type,
  children,
  style,
  onToggle,
  isCollapsed,
}) => {
  return (
    <div id={id} className={`region region-${type}`} style={style}>
      <div className="region-header" onClick={onToggle}>
        <span className="region-title">{name}</span>
        {onToggle && (
          <button className="region-toggle">
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
        )}
      </div>
      {!isCollapsed && <div className="region-content">{children}</div>}
    </div>
  )
}

export default Region
