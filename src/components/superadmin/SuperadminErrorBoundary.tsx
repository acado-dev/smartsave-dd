import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

export class SuperadminErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Superadmin] render failure", error, info);
  }

  resetDemo = () => {
    try {
      localStorage.removeItem("ithina.superadmin.v1");
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border border-white/10 bg-white/5 p-6 text-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold">Superadmin console failed to load</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Something went wrong while rendering this page. You can return to the dashboard or
            reset the demo data and try again.
          </p>
          {this.state.message && (
            <pre className="text-xs bg-black/30 p-2 rounded mb-4 overflow-auto max-h-32">
              {this.state.message}
            </pre>
          )}
          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link to="/superadmin">Return to dashboard</Link>
            </Button>
            <Button onClick={this.resetDemo} variant="destructive">
              Reset superadmin demo data
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
