import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Mail,
  Lock,
  Building2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Lightbulb,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { ApiError } from "@/lib/api";

export default function OrgLoginPage() {
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
      await login(formData.email, formData.password, "organization");
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      navigate("/org");
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
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your organization dashboard to manage submissions.
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
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
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
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to DevThon?{" "}
            <Link
              to="/org/register"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Pane - Branding */}
      <div className="hidden lg:flex relative bg-zinc-900 flex-col justify-between p-12 text-zinc-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-zinc-900 to-zinc-900" />

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 mt-12">
          <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-8 border border-white/10">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold leading-tight mb-6">
            Innovate with the <br /> next generation.
          </h2>
          <p className="text-zinc-400 max-w-sm text-lg">
            Manage your problem statements, track submissions, and engage with
            top talent efficiently.
          </p>
        </div>

        <div className="relative z-10 grid gap-4">
          {/* Decorative Feature Cards */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 hover:bg-white/10 transition-colors cursor-default">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Problem Statements</h3>
              <p className="text-xs text-zinc-400">
                Submit and refine your challenges
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 hover:bg-white/10 transition-colors cursor-default">
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Talent Pool</h3>
              <p className="text-xs text-zinc-400">Connect with innovators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
