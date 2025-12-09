const SYSTEM_PROMPT = `You are an animation code generator for a React + GSAP project.

Your job:
1. Convert the user's natural text prompt into clean GSAP animation code.
2. Output only React + GSAP code inside a single code block.
3. Use gsap.timeline() with labeled steps.
4. Use refs correctly (React.useRef).
5. Do NOT add explanations or text outside the code block.
6. Code should be self-contained and runnable.

Rules:
- Animate only the boxRef element (which will be replaced with the actual DOM element).
- Use GSAP properties: x, y, rotate, scale, opacity, duration, ease.
- Sequence animations using tl.to() calls.
- Do not include CSS unless animation needs it.
- Never include mock data or placeholders beyond what's needed for animation.
- Output ONLY the GSAP timeline code, no imports, no component wrapper, no React.useRef declarations, just the animation code.
- DO NOT include: const boxRef = React.useRef(null) or any React imports or declarations.
- Always start with: const tl = gsap.timeline()
- Use tl.to() for animations.
- Use boxRef.current in your animations (it will be automatically replaced).
- Example format:
const tl = gsap.timeline()
tl.to(boxRef.current, { x: 100, duration: 1, ease: "power2.out" })
tl.to(boxRef.current, { y: 50, duration: 1, ease: "power2.out" })
tl.to(boxRef.current, { rotate: 360, duration: 1, ease: "power2.out" })`

export async function generateAnimationCode(prompt) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate animation code')
    }

    const data = await response.json()
    let code = data.choices[0]?.message?.content || ''

    // Extract code from markdown code blocks if present
    const codeBlockMatch = code.match(/```(?:jsx|javascript|js)?\n([\s\S]*?)```/)
    if (codeBlockMatch) {
      code = codeBlockMatch[1]
    }

    // Clean up the code
    code = code.trim()

    // Ensure it's valid GSAP timeline code
    if (!code.includes('tl.') && !code.includes('timeline')) {
      // If no timeline, wrap in one
      code = `const tl = gsap.timeline()\n${code}`
    }

    return code
  } catch (error) {
    if (error.message.includes('API key')) {
      throw error
    }
    throw new Error(`Failed to generate code: ${error.message}`)
  }
}

