import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MobileErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('MobileErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MobileErrorBoundary error details:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-16 h-16 mx-auto text-destructive">
              <AlertTriangle className="w-full h-full" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Oops! Something went wrong
              </h2>
              <p className="text-muted-foreground">
                There was an error loading the mobile interface. Don't worry, we can fix this!
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>

            {this.state.error && (
              <details className="text-left">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}