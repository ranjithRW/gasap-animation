import { forwardRef } from 'react'
import './Model.css'

const Bird = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model bird ${className}`}>
      <div className="bird-body"></div>
      <div className="bird-wing bird-wing-left"></div>
      <div className="bird-wing bird-wing-right"></div>
    </div>
  )
})

Bird.displayName = 'Bird'

export default Bird

