import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Mail,
  Lock,
  Shield,
  AlertCircle,
  Loader2,
  Server,
  Activity,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { ApiError } from "@/lib/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password, "admin");
      toast.success("Access Granted", {
        description: "Welcome to the command center.",
      });
      navigate("/admin");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Invalid credentials";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left Pane - Form */}
      <div className="relative flex flex-col justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary font-bold font-display text-xl mb-8"
            >
              <Zap className="h-5 w-5" /> DevThon
            </Link>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Admin Access
            </h1>
            <p className="text-muted-foreground">
              Restricted area. Please sign in with admin privileges.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@devthon.org"
                    className="pl-9"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Authenticating..." : "Authenticate"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Return to Public Site
            </Link>
          </p>
        </div>
      </div>

      {/* Right Pane - Branding */}
      <div className="hidden lg:flex relative bg-zinc-900 flex-col justify-between p-12 text-zinc-100 overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 mt-12">
          <div className="h-12 w-12 bg-zinc-800/50 backdrop-blur-md rounded-xl flex items-center justify-center mb-8 border border-zinc-700">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold leading-tight mb-6">
            Platform Control <br /> & Analytics
          </h2>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 backdrop-blur-sm">
              <Users className="h-5 w-5 mb-2 text-zinc-400" />
              <div className="text-2xl font-bold">12k+</div>
              <div className="text-xs text-zinc-500">Active Users</div>
            </div>
            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 backdrop-blur-sm">
              <Activity className="h-5 w-5 mb-2 text-zinc-400" />
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-xs text-zinc-500">Uptime</div>
            </div>
            <div className="col-span-2 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 backdrop-blur-sm flex items-center gap-3">
              <Server className="h-5 w-5 text-zinc-400" />
              <div>
                <div className="text-sm font-medium">System Status</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-zinc-500 text-xs font-mono">
            SECURE CONNECTION // 2048-BIT ENCRYPTION
          </p>
        </div>
      </div>
    </div>
  );
}
