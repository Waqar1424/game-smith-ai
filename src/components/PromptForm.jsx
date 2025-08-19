import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Sparkles, Loader2 } from 'lucide-react';

const PRESET_GAMES = [
  { id: 'racing', label: 'Racing', emoji: '🏎️' },
  { id: 'puzzle', label: 'Puzzle', emoji: '🧩' },
  { id: 'snake', label: 'Snake', emoji: '🐍' },
  { id: 'collecting', label: 'Collecting', emoji: '💎' }
];

export function PromptForm({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handlePresetClick = (presetId) => {
    if (!isLoading) {
      const presetGame = PRESET_GAMES.find(game => game.id === presetId);
      const gamePrompt = `${presetGame.label} game`;
      setPrompt(gamePrompt);
      onSubmit(gamePrompt);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Gamepad2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'create a snake game' / 'racing game with obstacles'"
            className="pl-10 h-12 bg-gradient-card border-border/50 focus:border-primary transition-all duration-300"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!prompt.trim() || isLoading}
          className="w-full h-12 bg-gradient-game hover:shadow-glow transition-all duration-300 font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Game...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Game
            </>
          )}
        </Button>
      </form>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground font-medium">Quick Start:</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_GAMES.map((game) => (
            <Badge
              key={game.id}
              variant="secondary"
              className="cursor-pointer hover:bg-accent hover:shadow-glow transition-all duration-300 px-3 py-2 text-sm font-medium animate-float"
              style={{ animationDelay: `${PRESET_GAMES.indexOf(game) * 0.2}s` }}
              onClick={() => handlePresetClick(game.id)}
            >
              <span className="mr-1">{game.emoji}</span>
              {game.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}