import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './AnimationPreview.css'

function AnimationPreview({ code }) {
  const boxRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!code || !boxRef.current) return

    // Reset animation
    gsap.set(boxRef.current, { clearProps: 'all' })
    gsap.killTweensOf(boxRef.current)

    try {
      // Prepare the code for execution
      let processedCode = code.trim()
      
      // Replace boxRef references (with or without .current) with the actual element
      processedCode = processedCode.replace(/boxRef\.current/g, 'element')
      processedCode = processedCode.replace(/boxRef\b/g, 'element')
      
      // Ensure we have a timeline if the code doesn't create one
      if (!processedCode.includes('const tl') && !processedCode.includes('let tl') && !processedCode.includes('var tl')) {
        processedCode = `const tl = gsap.timeline();\n${processedCode}`
      }

      // Create execution context
      const element = boxRef.current
      const executeCode = new Function('gsap', 'element', `
        ${processedCode}
        return typeof tl !== 'undefined' ? tl : null;
      `)

      const timeline = executeCode(gsap, element)
      
      // Play the animation
      if (timeline) {
        timeline.restart()
      }
    } catch (error) {
      console.error('Animation error:', error)
    }

    // Cleanup
    return () => {
      if (boxRef.current) {
        gsap.killTweensOf(boxRef.current)
      }
    }
  }, [code])

  return (
    <div ref={containerRef} className="preview-container">
      <div ref={boxRef} className="animated-box">
        <span>Animate Me</span>
      </div>
    </div>
  )
}

export default AnimationPreview

