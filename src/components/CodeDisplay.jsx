import { useState } from 'react'
import './CodeDisplay.css'

function CodeDisplay({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (!code) return

    const componentCode = `import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

function AnimatedComponent() {
  const boxRef = useRef(null)

  useEffect(() => {
    if (!boxRef.current) return

    const tl = gsap.timeline()
${code
  .split('\n')
  .map((line) => `    ${line}`)
  .join('\n')}
    
    return () => {
      gsap.killTweensOf(boxRef.current)
    }
  }, [])

  return (
    <div ref={boxRef} style={{
      width: '120px',
      height: '120px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 600
    }}>
      Animate Me
    </div>
  )
}

export default AnimatedComponent`

    const blob = new Blob([componentCode], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'animated-component.jsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!code) {
    return (
      <div className="code-display-empty">
        <p>Generated code will appear here...</p>
      </div>
    )
  }

  return (
    <div className="code-display">
      <div className="code-actions">
        <button onClick={handleCopy} className="action-button">
          {copied ? '✓ Copied!' : 'Copy Code'}
        </button>
        <button onClick={handleDownload} className="action-button">
          Download Component
        </button>
      </div>
      <pre className="code-content">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeDisplay

