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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [step, setStep] = useState(1);
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
    // Clear field error when user starts typing
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
      errors.contactPerson =
        "Contact person name must be at least 2 characters";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors below");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      toast.error("Validation Error", {
        description: "Passwords do not match",
      });
      return;
    }

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

      toast.success("Registration Successful!", {
        description: "Welcome to DevUp! Your account has been created.",
      });
      navigate("/org");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) {
          setFieldErrors(err.errors);
          // Build a detailed error message
          const errorMessages = Object.entries(err.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(", ");
          toast.error("Validation Failed", {
            description: errorMessages || err.message,
          });
        } else {
          toast.error("Registration Failed", {
            description: err.message,
          });
        }
      } else {
        setError("Registration failed");
        toast.error("Registration Failed", {
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-background via-background to-accent/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">DevUp</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl font-display">
              Register Organization
            </CardTitle>
            <CardDescription>
              Create an account to submit problem statements for DevThon 2026
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress */}
            <div className="flex gap-2 mb-6">
              <div
                className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}
              />
              <div
                className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      Organization Name *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="organizationName"
                        placeholder="Your Organization"
                        className={`pl-10 ${fieldErrors.organizationName ? "border-destructive" : ""}`}
                        value={formData.organizationName}
                        onChange={(e) =>
                          updateField("organizationName", e.target.value)
                        }
                        required
                      />
                    </div>
                    {fieldErrors.organizationName && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.organizationName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(v) => updateField("industry", v)}
                    >
                      <SelectTrigger
                        className={
                          fieldErrors.industry ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select your industry" />
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
                      <p className="text-sm text-destructive">
                        {fieldErrors.industry}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        placeholder="https://yourcompany.com"
                        className="pl-10"
                        value={formData.website}
                        onChange={(e) => updateField("website", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Brief Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your organization..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setStep(2)}
                    disabled={!formData.organizationName || !formData.industry}
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactPerson"
                        placeholder="John Doe"
                        className={`pl-10 ${fieldErrors.contactPerson ? "border-destructive" : ""}`}
                        value={formData.contactPerson}
                        onChange={(e) =>
                          updateField("contactPerson", e.target.value)
                        }
                        required
                      />
                    </div>
                    {fieldErrors.contactPerson && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.contactPerson}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@organization.com"
                        className={`pl-10 ${fieldErrors.email ? "border-destructive" : ""}`}
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 ${fieldErrors.password ? "border-destructive" : ""}`}
                        value={formData.password}
                        onChange={(e) =>
                          updateField("password", e.target.value)
                        }
                        required
                      />
                    </div>
                    {fieldErrors.password && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.password}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Min 8 chars, 1 uppercase, 1 lowercase, 1 number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 ${fieldErrors.confirmPassword ? "border-destructive" : ""}`}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          updateField("confirmPassword", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                to="/org/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:underline">
            Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
