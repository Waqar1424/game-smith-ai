# GameSmith AI - HTML5 Phaser Game Maker

A powerful web application that generates complete, playable HTML5 games using AI and Phaser 3. Simply describe your game idea, and watch as AI creates a fully functional game in seconds.

![GameSmith AI](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=GameSmith+AI)

## ✨ Features

- **AI-Powered Game Generation**: Powered by OpenAI's GPT models
- **Complete Phaser 3 Games**: Generates fully playable games with physics, controls, and scoring
- **Instant Preview**: See your game running immediately in a sandboxed iframe
- **Self-Contained HTML**: Export complete HTML files that work offline
- **Quick Start Presets**: Racing, Puzzle, Snake, and Collecting game templates
- **Code Viewer**: Inspect and download the generated HTML source
- **Responsive Design**: Beautiful interface that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/account/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🎮 Usage

1. **Enter a game idea** in the text input (e.g., "racing game with obstacles")
2. **Click "Generate Game"** or use one of the preset buttons
3. **Wait for AI generation** (usually 10-30 seconds)
4. **Play your game** in the preview window
5. **View/Copy code** to export the complete HTML file

### Example Game Ideas

- "Snake game with growing tail and scoring"
- "Racing game with obstacles and lap counter"
- "Puzzle game with falling blocks"
- "Collecting game with coins and power-ups"
- "Platformer with jumping and enemies"
- "Space shooter with asteroids"

## 🛠️ Technical Details

### Architecture

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS with custom game-themed design system
- **UI Components**: shadcn/ui with custom variants
- **Game Engine**: Phaser 3 (loaded via CDN in generated games)
- **API**: OpenAI Chat Completions API

### Security Features

- **Sandboxed Execution**: Games run in iframes with restricted permissions
- **No External Requests**: Generated games are completely self-contained
- **Safe Rendering**: Blob URLs prevent code injection attacks

### AI System Prompt

The app uses a carefully crafted system prompt that instructs the AI to:
- Generate complete, self-contained HTML5 files
- Use Phaser 3 from CDN (no build tools required)
- Include proper game mechanics (controls, scoring, win/lose conditions)
- Output between specific HTML markers for reliable extraction
- Follow security best practices (no eval, no external requests)

## 📁 Project Structure

```
src/
├── api/
│   └── openai.js          # OpenAI API integration
├── components/
│   ├── CodeModal.jsx      # HTML code viewer/downloader
│   ├── GamePreview.jsx    # Iframe game renderer
│   ├── GameStatus.jsx     # Status messages and errors
│   └── PromptForm.jsx     # Game idea input form
├── lib/
│   └── extractGameHtml.js # HTML extraction utilities
└── pages/
    └── Index.tsx          # Main application page
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | Yes |

### API Settings

Default OpenAI settings (configurable in `src/api/openai.js`):
- **Model**: `gpt-4o-mini` (fast and cost-effective)
- **Temperature**: `0.7` (balanced creativity)
- **Max Tokens**: `4000` (sufficient for complete games)

## 🚨 Error Handling

The app handles various error scenarios:
- **Missing API Key**: Clear setup instructions
- **Rate Limits**: Automatic retry with exponential backoff
- **Invalid Responses**: Robust HTML extraction with validation
- **Network Issues**: User-friendly error messages
- **Game Load Errors**: Iframe fallbacks and reset options

## 🎨 Customization

### Design System

The app uses a game-themed design system with:
- **Electric Purple**: Primary brand color (`--game-electric`)
- **Neon Green**: Accent color (`--game-neon`)
- **Dark Theme**: Optimized for development environments
- **Animations**: Subtle glows and floating effects

### Adding New Presets

Edit `src/components/PromptForm.jsx` to add new preset games:

```javascript
const PRESET_GAMES = [
  { id: 'your-game', label: 'Your Game', emoji: '🎯' },
  // ... existing presets
];
```

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs on the GitHub issues page
- **API Limits**: Monitor your OpenAI usage at platform.openai.com

## 🔮 Roadmap

- [ ] Multiple AI model support (Claude, Llama, etc.)
- [ ] Game templates and themes
- [ ] Multiplayer game generation
- [ ] Advanced game customization options
- [ ] Game gallery and sharing features

---

Built with ❤️ using React, Vite, and OpenAI
