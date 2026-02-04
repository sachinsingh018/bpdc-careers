"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ScanErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Scan error:", error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      const err = this.state.error;
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-amber-800">Something went wrong</p>
          <p className="mt-2 text-sm text-amber-700">
            {err?.message || "An unexpected error occurred."}
          </p>
          {err?.stack && (
            <pre className="mt-3 max-h-32 overflow-auto rounded bg-amber-100/80 p-2 text-xs text-amber-900">
              {err.stack}
            </pre>
          )}
          <Button variant="secondary" className="mt-4" onClick={this.handleReset}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
