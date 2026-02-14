import React from 'react';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: unknown }
> {
  state = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('UI crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="card" role="alert">
            <div className="sectionTitle">Something went wrong</div>
            <div className="muted">Try reloading the page.</div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
