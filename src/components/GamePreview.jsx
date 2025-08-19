import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Code, Monitor, AlertTriangle } from 'lucide-react';
import { createGameBlob, revokeBlobUrl } from '@/lib/extractGameHtml';

export function GamePreview({ gameHtml, onViewCode }) {
  const iframeRef = useRef(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (gameHtml) {
      // Clean up previous blob URL
      if (blobUrl) {
        revokeBlobUrl(blobUrl);
      }

      // Create new blob URL
      const newBlobUrl = createGameBlob(gameHtml);
      setBlobUrl(newBlobUrl);
      setIframeError(false);
    }

    // Cleanup on unmount
    return () => {
      if (blobUrl) {
        revokeBlobUrl(blobUrl);
      }
    };
  }, [gameHtml]);

  const handleReset = () => {
    if (iframeRef.current && blobUrl) {
      setIframeError(false);
      // Force iframe reload
      iframeRef.current.src = blobUrl;
    }
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  if (!gameHtml) {
    return (
      <Card className="p-8 bg-gradient-card border-border/50">
        <div className="text-center space-y-4">
          <Monitor className="mx-auto h-16 w-16 text-muted-foreground animate-pulse" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Game Preview</h3>
            <p className="text-muted-foreground">Your generated game will appear here</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          Game Preview
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="hover:shadow-glow transition-all duration-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewCode}
            className="hover:shadow-glow transition-all duration-300"
          >
            <Code className="mr-2 h-4 w-4" />
            View Code
          </Button>
        </div>
      </div>

      <Card className="p-1 bg-gradient-card border-border/50 shadow-game">
        {iframeError ? (
          <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-md">
            <div className="text-center space-y-4">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
              <div>
                <h4 className="font-semibold text-foreground">Game Load Error</h4>
                <p className="text-sm text-muted-foreground">The game failed to load. Try resetting or generating a new game.</p>
              </div>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={blobUrl}
            className="w-full h-[600px] rounded-md bg-background"
            sandbox="allow-scripts allow-pointer-lock allow-same-origin"
            referrerPolicy="no-referrer"
            title="Generated Game"
            onError={handleIframeError}
          />
        )}
      </Card>
    </div>
  );
}