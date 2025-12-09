import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import './AnimationPreview.css'

function AnimationPreview({ code }) {
  const boxRef = useRef(null)
  const containerRef = useRef(null)
  const timelineRef = useRef(null)
  const [error, setError] = useState('')

  const executeAnimation = useCallback((animationCode) => {
    if (!boxRef.current) return null

    // Reset animation
    gsap.set(boxRef.current, { clearProps: 'all' })
    gsap.killTweensOf(boxRef.current)
    setError('')

    try {
      // Prepare the code for execution
      let processedCode = animationCode.trim()
      
      // Remove React.useRef declarations and other React-specific code
      processedCode = processedCode.replace(/const\s+boxRef\s*=\s*React\.useRef\([^)]*\)\s*;?\s*/gi, '')
      processedCode = processedCode.replace(/let\s+boxRef\s*=\s*React\.useRef\([^)]*\)\s*;?\s*/gi, '')
      processedCode = processedCode.replace(/var\s+boxRef\s*=\s*React\.useRef\([^)]*\)\s*;?\s*/gi, '')
      processedCode = processedCode.replace(/React\.useRef\([^)]*\)/gi, 'null')
      processedCode = processedCode.replace(/import\s+.*?from\s+['"]react['"]\s*;?\s*/gi, '')
      
      // Clean up extra whitespace and newlines
      processedCode = processedCode.replace(/\n\s*\n/g, '\n').trim()
      
      // Replace boxRef.current and boxRef with a parameter name
      // Use parameter names that are unlikely to conflict
      const elParam = '__targetEl__'
      const gsapParam = '__gsapLib__'
      
      processedCode = processedCode.replace(/boxRef\.current/g, elParam)
      processedCode = processedCode.replace(/\bboxRef\b/g, elParam)
      
      // Ensure we have a timeline if the code doesn't create one
      if (!processedCode.includes('const tl') && !processedCode.includes('let tl') && !processedCode.includes('var tl')) {
        processedCode = `const tl = ${gsapParam}.timeline();\n${processedCode}`
      } else {
        // Replace gsap references with the parameter
        processedCode = processedCode.replace(/\bgsap\.timeline\(/g, `${gsapParam}.timeline(`)
        processedCode = processedCode.replace(/\bgsap\.to\(/g, `${gsapParam}.to(`)
        processedCode = processedCode.replace(/\bgsap\.from\(/g, `${gsapParam}.from(`)
        processedCode = processedCode.replace(/\bgsap\.set\(/g, `${gsapParam}.set(`)
      }
      
      // Create a function that takes gsap and element as parameters
      const functionCode = `
        return function(${gsapParam}, ${elParam}) {
          const gsap = ${gsapParam};
          ${processedCode}
          return typeof tl !== 'undefined' ? tl : null;
        }
      `

      // Create execution function
      const createExecutor = new Function(functionCode)
      const executor = createExecutor()
      
      // Execute with the actual element
      const timeline = executor(gsap, boxRef.current)
      
      // Store timeline reference
      timelineRef.current = timeline
      
      // Play the animation
      if (timeline) {
        timeline.restart()
        return timeline
      } else {
        setError('Failed to create animation timeline')
        return null
      }
    } catch (error) {
      console.error('Animation error:', error)
      setError(`Animation error: ${error.message}`)
      return null
    }
  }, [])

  const playAnimation = useCallback(() => {
    if (!code) {
      setError('No animation code available')
      return
    }
    executeAnimation(code)
  }, [code, executeAnimation])

  // Auto-play when code changes
  useEffect(() => {
    if (code && boxRef.current) {
      // Kill any existing animations first
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        executeAnimation(code)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [code, executeAnimation])

  // Default demo animation when no code
  useEffect(() => {
    if (!code && boxRef.current) {
      // Kill any previous timeline
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      
      gsap.set(boxRef.current, { clearProps: 'all' })
      
      const demoTimeline = gsap.timeline({ repeat: -1, yoyo: true })
      demoTimeline.to(boxRef.current, {
        scale: 1.2,
        rotation: 10,
        duration: 1,
        ease: "power2.inOut"
      })
      timelineRef.current = demoTimeline

      return () => {
        if (demoTimeline) demoTimeline.kill()
      }
    }
  }, [code])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (boxRef.current) {
        gsap.killTweensOf(boxRef.current)
      }
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="preview-container">
      <div ref={boxRef} className="animated-box" onClick={playAnimation}>
        <span>Animate Me</span>
      </div>
      {error && <div className="animation-error">{error}</div>}
      {code && (
        <button className="replay-button" onClick={playAnimation}>
          🔄 Replay Animation
        </button>
      )}
      {!code && (
        <p className="preview-hint">Enter a prompt and generate code to see your animation</p>
      )}
    </div>
  )
}

export default AnimationPreview

