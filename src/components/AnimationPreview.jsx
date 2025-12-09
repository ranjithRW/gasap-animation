import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import ModelRenderer from './models/ModelRenderer'
import './AnimationPreview.css'

function AnimationPreview({ code, prompt = '' }) {
  const modelRef = useRef(null)
  const containerRef = useRef(null)
  const timelineRef = useRef(null)
  const [error, setError] = useState('')
  const [transformState, setTransformState] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  })
  const [userControlActive, setUserControlActive] = useState(false)
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0
  })

  const executeAnimation = useCallback((animationCode) => {
    if (!modelRef.current) return null

    // Reset animation but preserve initial background gradient
    gsap.killTweensOf(modelRef.current)
    // Reset transform properties but keep background for color animations
    gsap.set(modelRef.current, { 
      x: 0, 
      y: 0, 
      rotation: 0, 
      scale: 1, 
      opacity: 1 
    })
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
      
      // Convert backgroundColor to background for GSAP compatibility (in case AI still generates it)
      processedCode = processedCode.replace(/backgroundColor\s*:/g, 'background:')
      processedCode = processedCode.replace(/['"]backgroundColor['"]\s*:/g, '"background":')
      
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
      const timeline = executor(gsap, modelRef.current)
      
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

  // Allow manual transform controls when no generated code is present
  const applyTransform = useCallback((next) => {
    setTransformState((prev) => {
      const updated = typeof next === 'function' ? next(prev) : next
      if (!code && modelRef.current) {
        gsap.set(modelRef.current, {
          x: updated.x,
          y: updated.y,
          scale: updated.scale,
          rotation: updated.rotation
        })
      }
      return updated
    })
  }, [code])

  const enableUserControl = useCallback(() => {
    if (code) return
    // Stop demo animation before giving control
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }
    setUserControlActive(true)
  }, [code])

  const handlePointerDown = useCallback((e) => {
    if (code) return
    enableUserControl()
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: transformState.x,
      originY: transformState.y
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }, [code, enableUserControl, transformState.x, transformState.y])

  const handlePointerMove = useCallback((e) => {
    const state = dragState.current
    if (!state.dragging || code) return
    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY
    applyTransform((prev) => ({
      ...prev,
      x: state.originX + dx,
      y: state.originY + dy
    }))
  }, [code, applyTransform])

  const handlePointerUp = useCallback(() => {
    dragState.current.dragging = false
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerMove])

  const handleWheel = useCallback((e) => {
    if (code) return
    enableUserControl()
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.1 : -0.1
    applyTransform((prev) => {
      const nextScale = Math.min(3, Math.max(0.5, prev.scale + delta))
      return { ...prev, scale: nextScale }
    })
  }, [code, enableUserControl, applyTransform])

  const handleRotate = useCallback((delta) => {
    if (code) return
    enableUserControl()
    applyTransform((prev) => ({ ...prev, rotation: prev.rotation + delta }))
  }, [code, enableUserControl, applyTransform])

  const handleResetTransform = useCallback(() => {
    if (code) return
    setUserControlActive(false)
    applyTransform({ x: 0, y: 0, scale: 1, rotation: 0 })
  }, [code, applyTransform])

  // Auto-play when code changes
  useEffect(() => {
    if (code && modelRef.current) {
      // Kill any existing animations first
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      // Reset any manual transforms before playing generated animations
      setUserControlActive(false)
      setTransformState({ x: 0, y: 0, scale: 1, rotation: 0 })
      
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        executeAnimation(code)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [code, executeAnimation])

  // When code is cleared, stop any running timeline and reset transforms
  useEffect(() => {
    if (!code) {
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
      setUserControlActive(false)
      setTransformState({ x: 0, y: 0, scale: 1, rotation: 0 })
      if (modelRef.current) {
        gsap.set(modelRef.current, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 })
      }
    }
  }, [code])

  // Default demo animation when no code
  useEffect(() => {
    if (!code && modelRef.current && !userControlActive) {
      // Kill any previous timeline
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      
      gsap.set(modelRef.current, { clearProps: 'all' })
      
      // Simple bounce/jump demo for the default ball
      const demoTimeline = gsap.timeline({ repeat: -1, yoyo: true })
      demoTimeline.to(modelRef.current, {
        y: -40,
        scale: 1.05,
        duration: 0.6,
        ease: "bounce.out"
      }).to(modelRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power1.in"
      })
      timelineRef.current = demoTimeline

      return () => {
        if (demoTimeline) demoTimeline.kill()
      }
    }
  }, [code, userControlActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (modelRef.current) {
        gsap.killTweensOf(modelRef.current)
      }
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="preview-container">
      <div
        onClick={code ? playAnimation : undefined}
        onPointerDown={handlePointerDown}
        onWheel={handleWheel}
        style={{ cursor: code ? 'pointer' : 'grab' }}
      >
        <ModelRenderer ref={modelRef} prompt={prompt} />
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

