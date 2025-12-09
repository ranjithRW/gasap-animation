import { forwardRef } from 'react'
import './Model.css'

const Ball = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model ball ${className}`}>
      <div className="ball-inner"></div>
    </div>
  )
})

Ball.displayName = 'Ball'

export default Ball

