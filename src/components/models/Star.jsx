import { forwardRef } from 'react'
import './Model.css'

const Star = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model star ${className}`}>
      <div className="star-shape"></div>
    </div>
  )
})

Star.displayName = 'Star'

export default Star

