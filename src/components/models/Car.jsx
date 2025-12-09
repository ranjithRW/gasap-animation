import { forwardRef } from 'react'
import './Model.css'

const Car = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model car ${className}`}>
      <div className="car-body">
        <div className="car-window"></div>
        <div className="car-wheel car-wheel-front"></div>
        <div className="car-wheel car-wheel-back"></div>
      </div>
    </div>
  )
})

Car.displayName = 'Car'

export default Car

