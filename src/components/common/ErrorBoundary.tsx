import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-tight text-white font-display">
                Something went wrong
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                An unexpected interface issue occurred. Our resilience engine caught it to prevent interruptions.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-left overflow-x-auto max-h-60">
                <p className="text-[11px] font-mono text-red-400 break-words font-bold">
                  {this.state.error.name || 'Error'}: {this.state.error.message || this.state.error.toString()}
                </p>
                {this.state.error.stack && (
                  <pre className="mt-2 text-[9px] font-mono text-zinc-400 whitespace-pre-wrap leading-tight">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-black uppercase tracking-wider transition-all transform active:scale-95 shadow-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Home className="w-3.5 h-3.5" /> Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
