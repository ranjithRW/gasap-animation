# 🎬 AI Motion Director - GSAP Animation Generator

An AI-powered tool that converts natural language prompts into GSAP animation code with live preview.

## Features

- ✨ Natural language to GSAP code conversion
- 🎥 Live animation preview
- 📥 Download generated React components
- 🎨 Beautiful, modern UI
- ⚡ Powered by OpenAI GPT-4

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Usage

1. Enter an animation prompt in the text area (e.g., "Make the card bounce, fade, and rotate in sequence")
2. Click "Generate Animation" or press Enter
3. Watch the live preview
4. Copy or download the generated code

## Tech Stack

- React 18
- GSAP 3.12
- Vite
- OpenAI API

## Example Prompts

- "Make the card bounce, fade, and rotate in sequence"
- "Slide in from the left, then scale up and fade in"
- "Rotate 360 degrees, then bounce up and down"
- "Fade out, move to the right, then fade back in"

