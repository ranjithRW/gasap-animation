import './PromptInput.css'

function PromptInput({ prompt, setPrompt, onGenerate, isLoading }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onGenerate()
    }
  }

  return (
    <div className="prompt-input-container">
      <div className="input-wrapper">
        <textarea
          className="prompt-input"
          placeholder="Describe your animation... (e.g., 'Make the model bounce, fade, and rotate in sequence')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={3}
        />
        <button
          className="generate-button"
          onClick={onGenerate}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Animation'}
        </button>
      </div>
    </div>
  )
}

export default PromptInput

