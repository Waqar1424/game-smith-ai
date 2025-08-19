import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Github, ExternalLink } from 'lucide-react';
import { PromptForm } from '@/components/PromptForm';
import { GamePreview } from '@/components/GamePreview';
import { GameStatus } from '@/components/GameStatus';
import { CodeModal } from '@/components/CodeModal';
import { generateGameWithRetry } from '@/api/openai';
import { extractGameHtml } from '@/lib/extractGameHtml';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [gameHtml, setGameHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { toast } = useToast();

  const handleGenerateGame = async (gameIdea) => {
    setIsLoading(true);
    setStatus('loading');
    setStatusMessage('Generating your game with AI...');
    setGameHtml('');

    try {
      const aiResponse = await generateGameWithRetry(gameIdea);
      const extractedHtml = extractGameHtml(aiResponse);
      
      setGameHtml(extractedHtml);
      setStatus('success');
      setStatusMessage('Game generated successfully! 🎮');
      
      toast({
        title: 'Game Ready!',
        description: 'Your game has been generated and is ready to play.',
      });
      
    } catch (error) {
      console.error('Game generation error:', error);
      setStatus('error');
      setStatusMessage(error.message || 'Failed to generate game. Please try again.');
      
      toast({
        title: 'Generation Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setStatusMessage('');
  };

  const handleViewCode = () => {
    if (gameHtml) {
      setShowCodeModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-game rounded-lg shadow-glow">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">GameSmith AI</h1>
                <p className="text-sm text-muted-foreground">HTML5 Phaser Game Maker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card border-border/50 shadow-game">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Create Your Game</h2>
                  <p className="text-muted-foreground">
                    Describe any game idea and watch AI generate a complete, playable HTML5 game with Phaser 3.
                  </p>
                </div>
                
                <PromptForm onSubmit={handleGenerateGame} isLoading={isLoading} />
              </div>
            </Card>

            {/* Status */}
            <GameStatus 
              status={status} 
              message={statusMessage} 
              onRetry={handleRetry}
            />

            {/* Features */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-game-electric rounded-full animate-pulse-glow"></div>
                  <span className="text-muted-foreground">Powered by OpenAI GPT models</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-game-neon rounded-full animate-pulse-glow" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-muted-foreground">Complete Phaser 3 games in seconds</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-game-warning rounded-full animate-pulse-glow" style={{animationDelay: '1s'}}></div>
                  <span className="text-muted-foreground">Self-contained HTML files</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-game-success rounded-full animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>
                  <span className="text-muted-foreground">Instant preview & download</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div>
            <GamePreview 
              gameHtml={gameHtml} 
              onViewCode={handleViewCode}
            />
          </div>
        </div>
      </main>

      {/* Code Modal */}
      <CodeModal 
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        gameHtml={gameHtml}
      />
    </div>
  );
};

export default Index;