"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DebugErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("=== DEBUG ERROR BOUNDARY ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("Component Stack:", errorInfo.componentStack);
    console.error("=== END DEBUG ===");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "#1a1a2e",
            color: "#e94560",
            padding: "16px",
            fontSize: "12px",
            fontFamily: "monospace",
            maxHeight: "300px",
            overflow: "auto",
            borderTop: "2px solid #e94560",
          }}
        >
          <strong style={{ fontSize: "14px" }}>⚠ Error Boundary Caught:</strong>
          <pre style={{ whiteSpace: "pre-wrap", margin: "8px 0" }}>
            {this.state.error?.message}
          </pre>
          <details>
            <summary style={{ cursor: "pointer", color: "#fff" }}>
              Component Stack
            </summary>
            <pre style={{ whiteSpace: "pre-wrap", margin: "4px 0", color: "#aaa" }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
