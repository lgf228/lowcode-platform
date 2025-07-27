import React from 'react'
import { ComponentPageProps } from '../../core/types/Component'
import './layout.scss'

const Page: React.FC<ComponentPageProps> = ({ title, children }) => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>{title}</h1>
      </header>
      <main className="page-content">{children}</main>
    </div>
  )
}

export default Page
