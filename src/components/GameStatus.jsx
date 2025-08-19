import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Info, RefreshCw } from 'lucide-react';

export function GameStatus({ status, message, onRetry }) {
  if (!status || status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />,
          variant: 'default',
          showRetry: false
        };
      case 'success':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'default',
          className: 'border-game-success/50 bg-game-success/10',
          showRetry: false
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          variant: 'destructive',
          showRetry: true
        };
      default:
        return {
          icon: <Info className="h-4 w-4" />,
          variant: 'default',
          showRetry: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Alert variant={config.variant} className={`transition-all duration-300 ${config.className || ''}`}>
      <div className="flex items-center gap-2">
        {config.icon}
        <AlertDescription className="flex-1">
          {message}
        </AlertDescription>
        {config.showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-auto"
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Try Again
          </Button>
        )}
      </div>
    </Alert>
  );
}