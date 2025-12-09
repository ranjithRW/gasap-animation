import { forwardRef } from 'react'
import { detectModelType } from '../../utils/modelDetector'
import Ball from './Ball'
import Car from './Car'
import Cloud from './Cloud'
import Plane from './Plane'
import Bird from './Bird'
import Star from './Star'
import Heart from './Heart'
import Rocket from './Rocket'
import Box from './Box'

const ModelRenderer = forwardRef(({ prompt, className = '' }, ref) => {
  const modelInfo = detectModelType(prompt || '')
  
  const modelProps = {
    ref: ref,
    className: className
  }
  
  switch (modelInfo.type) {
    case 'ball':
      return <Ball {...modelProps} />
    case 'car':
      return <Car {...modelProps} />
    case 'cloud':
      return <Cloud {...modelProps} />
    case 'plane':
      return <Plane {...modelProps} />
    case 'bird':
      return <Bird {...modelProps} />
    case 'star':
      return <Star {...modelProps} />
    case 'heart':
      return <Heart {...modelProps} />
    case 'rocket':
      return <Rocket {...modelProps} />
    default:
      return <Box {...modelProps} />
  }
})

ModelRenderer.displayName = 'ModelRenderer'

export default ModelRenderer

