import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Mail,
  Lock,
  Building2,
  User,
  Globe,
  Loader2,
  AlertCircle,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { ApiError } from "@/lib/api";
import { INDUSTRIES } from "@/types";

export default function OrgRegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    organizationName: "",
    industry: "",
    website: "",
    description: "",
    contactPerson: "",
    contactEmail: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.organizationName || formData.organizationName.length < 2) {
      errors.organizationName =
        "Organization name must be at least 2 characters";
    }
    if (!formData.industry) {
      errors.industry = "Please select an industry";
    }
    if (!formData.contactPerson || formData.contactPerson.length < 2) {
      errors.contactPerson = "Contact person name required";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email required";
    }
    if (!formData.password || formData.password.length < 8) {
      errors.password = "Min 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors highlighted below");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.contactPerson,
        organizationName: formData.organizationName,
        industry: formData.industry,
        website: formData.website || undefined,
        description: formData.description || undefined,
        contactPerson: formData.contactPerson,
        contactEmail: formData.contactEmail || formData.email,
      });

      toast.success("Welcome aboard!", {
        description: "Your organization account has been created.",
      });
      navigate("/org");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left Pane - Form */}
      <div className="relative flex flex-col justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary font-bold font-display text-xl mb-8"
            >
              <Zap className="h-5 w-5" /> DevThon
            </Link>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Partner Registration
            </h1>
            <p className="text-muted-foreground">
              Create an account to submit problem statements and connect with
              talent.
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="orgName"
                      placeholder="Acme Corp"
                      className="pl-9"
                      value={formData.organizationName}
                      onChange={(e) =>
                        updateField("organizationName", e.target.value)
                      }
                      aria-invalid={!!fieldErrors.organizationName}
                    />
                  </div>
                  {fieldErrors.organizationName && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.organizationName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => updateField("industry", value)}
                  >
                    <SelectTrigger
                      className={
                        fieldErrors.industry ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.industry && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.industry}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    className="pl-9"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPerson"
                      placeholder="John Doe"
                      className="pl-9"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        updateField("contactPerson", e.target.value)
                      }
                    />
                  </div>
                  {fieldErrors.contactPerson && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.contactPerson}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@acme.com"
                      className="pl-9"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                      onChange={(e) => updateField("password", e.target.value)}
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
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
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link
              to="/org/login"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Pane - Branding */}
      <div className="hidden lg:flex relative bg-primary flex-col justify-between p-12 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 mt-12">
          <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-8">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold leading-tight mb-6">
            Join the ecosystem of <br />
            future innovators.
          </h2>
          <div className="space-y-4 max-w-md text-primary-foreground/80">
            <p className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 mt-0.5 text-accent-foreground" />
              <span>Connect with pre-vetted student developers</span>
            </p>
            <p className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 mt-0.5 text-accent-foreground" />
              <span>Crowdsource solutions for R&D problems</span>
            </p>
            <p className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 mt-0.5 text-accent-foreground" />
              <span>Zero cost for submitting problem statements</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-md">
          <p className="text-lg italic mb-4">
            "DevThon helped us prototype a new AI feature in just 48 hours. The
            student team was phenomenal."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground">
              S
            </div>
            <div>
              <p className="font-semibold">Sarah Jenkins</p>
              <p className="text-xs text-primary-foreground/70">
                Product Lead, FinTech Solutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
