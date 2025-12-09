/**
 * Detects the type of animation model from the user's prompt
 * Returns the model type and any relevant properties
 */
export function detectModelType(prompt = '') {
  const lowerPrompt = (prompt || '').toLowerCase()
  
  // Default to ball when nothing is provided
  if (!lowerPrompt.trim()) {
    return {
      type: 'ball',
      keywords: ['ball', 'bounce', 'sphere'],
      defaultSize: 80
    }
  }
  
  // Ball animations
  if (lowerPrompt.includes('ball') || lowerPrompt.includes('bounce') || lowerPrompt.includes('sphere')) {
    return {
      type: 'ball',
      keywords: ['ball', 'bounce', 'sphere'],
      defaultSize: 80
    }
  }
  
  // Car animations
  if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle') || lowerPrompt.includes('automobile')) {
    return {
      type: 'car',
      keywords: ['car', 'vehicle', 'automobile'],
      defaultSize: { width: 120, height: 60 }
    }
  }
  
  // Cloud animations
  if (lowerPrompt.includes('cloud') || lowerPrompt.includes('sky')) {
    return {
      type: 'cloud',
      keywords: ['cloud', 'sky'],
      defaultSize: 100
    }
  }
  
  // Plane animations
  if (lowerPrompt.includes('plane') || lowerPrompt.includes('airplane') || lowerPrompt.includes('aircraft')) {
    return {
      type: 'plane',
      keywords: ['plane', 'airplane', 'aircraft'],
      defaultSize: { width: 100, height: 50 }
    }
  }
  
  // Bird animations
  if (lowerPrompt.includes('bird') || lowerPrompt.includes('fly')) {
    return {
      type: 'bird',
      keywords: ['bird', 'fly'],
      defaultSize: 60
    }
  }
  
  // Star animations
  if (lowerPrompt.includes('star') || lowerPrompt.includes('twinkle')) {
    return {
      type: 'star',
      keywords: ['star', 'twinkle'],
      defaultSize: 50
    }
  }
  
  // Heart animations
  if (lowerPrompt.includes('heart') || lowerPrompt.includes('love')) {
    return {
      type: 'heart',
      keywords: ['heart', 'love'],
      defaultSize: 70
    }
  }
  
  // Rocket animations
  if (lowerPrompt.includes('rocket') || lowerPrompt.includes('spaceship')) {
    return {
      type: 'rocket',
      keywords: ['rocket', 'spaceship'],
      defaultSize: { width: 40, height: 100 }
    }
  }
  
  // Fallback: use ball as the generic model
  return {
    type: 'ball',
    keywords: ['ball', 'bounce', 'sphere'],
    defaultSize: 80
  }
}

