import { forwardRef } from 'react'
import './Model.css'

const Cloud = forwardRef(({ className = '' }, ref) => {
  return (
    <div ref={ref} className={`model cloud ${className}`}>
      <div className="cloud-part cloud-part-1"></div>
      <div className="cloud-part cloud-part-2"></div>
      <div className="cloud-part cloud-part-3"></div>
      <div className="cloud-part cloud-part-4"></div>
    </div>
  )
})

Cloud.displayName = 'Cloud'

export default Cloud

