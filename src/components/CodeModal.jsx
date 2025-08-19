import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CodeModal({ isOpen, onClose, gameHtml }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gameHtml);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Game HTML copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([gameHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded!',
      description: 'Game HTML saved as game.html',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-gradient-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            Generated Game HTML
          </DialogTitle>
          <DialogDescription>
            Copy or download the complete HTML file for your game
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="hover:shadow-glow transition-all duration-300"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-game-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="hover:shadow-glow transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <ScrollArea className="flex-1 rounded-md border bg-muted/30 p-4">
          <pre className="text-sm">
            <code className="text-foreground">{gameHtml}</code>
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}