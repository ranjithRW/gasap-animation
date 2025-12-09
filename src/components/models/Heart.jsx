import { forwardRef } from 'react'
import './Model.css'

const Heart = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model heart ${className}`}>
      <div className="heart-shape"></div>
    </div>
  )
})

Heart.displayName = 'Heart'

export default Heart

