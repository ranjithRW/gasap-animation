import { forwardRef } from 'react'
import './Model.css'

const Plane = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model plane ${className}`}>
      <div className="plane-body">
        <div className="plane-wing plane-wing-left"></div>
        <div className="plane-wing plane-wing-right"></div>
        <div className="plane-tail"></div>
      </div>
    </div>
  )
})

Plane.displayName = 'Plane'

export default Plane

