import React from "react";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for now — can be wired to an error tracking service
    // eslint-disable-next-line no-console
    console.error("Unhandled error in React tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
          padding: 20,
        }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap", maxWidth: 800 }}>{String(this.state.error)}</pre>
          <div>
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
