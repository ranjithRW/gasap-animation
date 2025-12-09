import { forwardRef } from 'react'
import './Model.css'

const Rocket = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model rocket ${className}`}>
      <div className="rocket-body">
        <div className="rocket-window"></div>
        <div className="rocket-fin rocket-fin-left"></div>
        <div className="rocket-fin rocket-fin-right"></div>
        <div className="rocket-flame"></div>
      </div>
    </div>
  )
})

Rocket.displayName = 'Rocket'

export default Rocket

