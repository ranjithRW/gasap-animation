import { useState } from 'react'
import { generateAnimationCode } from './services/openai'
import AnimationPreview from './components/AnimationPreview'
import CodeDisplay from './components/CodeDisplay'
import PromptInput from './components/PromptInput'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter an animation prompt')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const code = await generateAnimationCode(prompt)
      setGeneratedCode(code)
    } catch (err) {
      setError(err.message || 'Failed to generate animation code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🎬 AI Motion Director</h1>
          <p className="subtitle">Design Animations with Text Prompts</p>
        </header>

        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="content-grid">
          <div className="preview-section">
            <h2>Live Preview</h2>
            <AnimationPreview code={generatedCode} prompt={prompt} />
          </div>

          <div className="code-section">
            <h2>Generated Code</h2>
            <CodeDisplay code={generatedCode} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

