import { forwardRef } from 'react'
import './Model.css'

const Box = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model box ${className}`}>
      <span>Animate Me</span>
    </div>
  )
})

Box.displayName = 'Box'

export default Box

