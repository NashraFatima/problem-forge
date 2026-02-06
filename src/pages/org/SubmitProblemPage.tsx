import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, Code, Cpu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { api, ApiError } from "@/lib/api";
import {
  SOFTWARE_CATEGORIES,
  HARDWARE_CATEGORIES,
  INDUSTRIES,
  Track,
  DifficultyLevel,
} from "@/types";

export default function SubmitProblemPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    track: "software" as Track,
    category: "",
    title: "",
    description: "",
    industry: "",
    expectedOutcome: "",
    techStack: "",
    difficulty: "medium" as DifficultyLevel,
    datasets: "",
    apiLinks: "",
    referenceLinks: "",
    ndaRequired: false,
    mentorsProvided: false,
    contactPerson: "",
    contactEmail: "",
  });

  const categories =
    formData.track === "software" ? SOFTWARE_CATEGORIES : HARDWARE_CATEGORIES;

  const submitMutation = useMutation({
    mutationFn: (data: Parameters<typeof api.org.createProblem>[0]) =>
      api.org.createProblem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org", "problems"] });
      queryClient.invalidateQueries({ queryKey: ["org", "dashboard"] });
      toast.success("Problem Statement Submitted!", {
        description: "Your submission is now pending admin review.",
      });
      navigate("/org/problems");
    },
    onError: (error) => {
      if (error instanceof ApiError && error.errors) {
        // Field-specific validation errors from backend
        setFieldErrors(error.errors);
        toast.error("Validation Error", {
          description: "Please fix the highlighted fields below.",
        });
      } else {
        const message =
          error instanceof ApiError
            ? error.message
            : "Failed to submit problem";
        toast.error("Submission Failed", {
          description: message,
        });
      }
    },
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Title validation: min 5, max 200 characters
    if (!formData.title || formData.title.length < 5) {
      errors.title = "Title must be at least 5 characters";
    } else if (formData.title.length > 200) {
      errors.title = "Title cannot exceed 200 characters";
    }

    // Description validation: min 50, max 5000 characters
    if (!formData.description || formData.description.length < 50) {
      errors.description = "Description must be at least 50 characters";
    } else if (formData.description.length > 5000) {
      errors.description = "Description cannot exceed 5000 characters";
    }

    // Category validation
    if (!formData.category) {
      errors.category = "Please select a category";
    }

    // Industry validation
    if (!formData.industry) {
      errors.industry = "Please select an industry";
    }

    // Expected outcome validation: min 20, max 2000 characters
    if (!formData.expectedOutcome || formData.expectedOutcome.length < 20) {
      errors.expectedOutcome =
        "Expected outcome must be at least 20 characters";
    } else if (formData.expectedOutcome.length > 2000) {
      errors.expectedOutcome = "Expected outcome cannot exceed 2000 characters";
    }

    // Contact person validation: min 2 characters
    if (!formData.contactPerson || formData.contactPerson.length < 2) {
      errors.contactPerson =
        "Contact person name must be at least 2 characters";
    }

    // Contact email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.contactEmail) {
      errors.contactEmail = "Contact email is required";
    } else if (!emailRegex.test(formData.contactEmail)) {
      errors.contactEmail = "Please enter a valid email address";
    }

    // Reference links validation (if provided)
    if (formData.referenceLinks) {
      const links = formData.referenceLinks
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const urlRegex = /^https?:\/\/.+/;
      const invalidLinks = links.filter((link) => !urlRegex.test(link));
      if (invalidLinks.length > 0) {
        errors.referenceLinks =
          "Each reference link must be a valid URL (starting with http:// or https://)";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return errors;
    }

    setFieldErrors({});
    return null;
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      title: "Title",
      description: "Description",
      category: "Category",
      industry: "Industry",
      expectedOutcome: "Expected Outcome",
      contactPerson: "Contact Person",
      contactEmail: "Contact Email",
      referenceLinks: "Reference Links",
    };
    return labels[field] || field;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const errors = validateForm();
    if (errors) {
      // Get list of fields with errors
      const errorFields = Object.keys(errors).map(getFieldLabel);
      toast.error("Validation Error", {
        description: `Please fix: ${errorFields.join(", ")}`,
        duration: 5000,
      });

      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    submitMutation.mutate({
      title: formData.title,
      description: formData.description,
      track: formData.track,
      category: formData.category,
      industry: formData.industry,
      expectedOutcome: formData.expectedOutcome,
      techStack: formData.techStack
        ? formData.techStack.split(",").map((s) => s.trim())
        : undefined,
      difficulty: formData.difficulty,
      datasets: formData.datasets || undefined,
      apiLinks: formData.apiLinks || undefined,
      referenceLinks: formData.referenceLinks
        ? formData.referenceLinks.split(",").map((s) => s.trim())
        : undefined,
      ndaRequired: formData.ndaRequired,
      mentorsProvided: formData.mentorsProvided,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/org")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-display font-bold mb-1">
          Submit Problem Statement
        </h1>
        <p className="text-muted-foreground">
          Fill out the form below to submit a new problem statement for DevThon
          2026
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Track Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Track</CardTitle>
              <CardDescription>
                Choose the primary track for your problem statement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.track}
                onValueChange={(v) => {
                  updateField("track", v);
                  updateField("category", "");
                }}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="software"
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.track === "software"
                      ? "border-software bg-software-light"
                      : "border-border hover:border-software/50"
                  }`}
                >
                  <RadioGroupItem
                    value="software"
                    id="software"
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.track === "software"
                        ? "bg-software text-white"
                        : "bg-muted"
                    }`}
                  >
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Software</p>
                    <p className="text-xs text-muted-foreground">
                      AI, Web, Mobile, Cloud
                    </p>
                  </div>
                </Label>

                <Label
                  htmlFor="hardware"
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.track === "hardware"
                      ? "border-hardware bg-hardware-light"
                      : "border-border hover:border-hardware/50"
                  }`}
                >
                  <RadioGroupItem
                    value="hardware"
                    id="hardware"
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.track === "hardware"
                        ? "bg-hardware text-white"
                        : "bg-muted"
                    }`}
                  >
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Hardware</p>
                    <p className="text-xs text-muted-foreground">
                      IoT, Robotics, Embedded
                    </p>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        {/* Problem Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Problem Details</CardTitle>
              <CardDescription>
                Describe your problem statement clearly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div id="category" className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => {
                      updateField("category", v);
                      if (fieldErrors.category)
                        setFieldErrors((prev) => ({ ...prev, category: "" }));
                    }}
                  >
                    <SelectTrigger
                      className={fieldErrors.category ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.category && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.category}
                    </p>
                  )}
                </div>

                <div id="industry" className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(v) => {
                      updateField("industry", v);
                      if (fieldErrors.industry)
                        setFieldErrors((prev) => ({ ...prev, industry: "" }));
                    }}
                  >
                    <SelectTrigger
                      className={fieldErrors.industry ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select industry" />
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
                    <p className="text-sm text-red-500">
                      {fieldErrors.industry}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Problem Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, concise title (min 5 characters)"
                  value={formData.title}
                  onChange={(e) => {
                    updateField("title", e.target.value);
                    if (fieldErrors.title)
                      setFieldErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  className={fieldErrors.title ? "border-red-500" : ""}
                  required
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {fieldErrors.title && (
                      <span className="text-red-500">{fieldErrors.title}</span>
                    )}
                  </span>
                  <span>{formData.title.length}/200</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem, its context, and what you're looking for... (min 50 characters)"
                  rows={6}
                  value={formData.description}
                  onChange={(e) => {
                    updateField("description", e.target.value);
                    if (fieldErrors.description)
                      setFieldErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  className={fieldErrors.description ? "border-red-500" : ""}
                  required
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {fieldErrors.description && (
                      <span className="text-red-500">
                        {fieldErrors.description}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      formData.description.length < 50 ? "text-orange-500" : ""
                    }
                  >
                    {formData.description.length}/5000
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedOutcome">Expected Outcome *</Label>
                <Textarea
                  id="expectedOutcome"
                  placeholder="What should the final solution achieve or demonstrate? (min 20 characters)"
                  rows={3}
                  value={formData.expectedOutcome}
                  onChange={(e) => {
                    updateField("expectedOutcome", e.target.value);
                    if (fieldErrors.expectedOutcome)
                      setFieldErrors((prev) => ({
                        ...prev,
                        expectedOutcome: "",
                      }));
                  }}
                  className={
                    fieldErrors.expectedOutcome ? "border-red-500" : ""
                  }
                  required
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {fieldErrors.expectedOutcome && (
                      <span className="text-red-500">
                        {fieldErrors.expectedOutcome}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      formData.expectedOutcome.length < 20
                        ? "text-orange-500"
                        : ""
                    }
                  >
                    {formData.expectedOutcome.length}/2000
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="techStack">Suggested Tech Stack</Label>
                  <Input
                    id="techStack"
                    placeholder="e.g., Python, React, TensorFlow"
                    value={formData.techStack}
                    onChange={(e) => updateField("techStack", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(v) => updateField("difficulty", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resources (Optional)</CardTitle>
              <CardDescription>
                Provide any datasets, APIs, or reference links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="datasets">Datasets</Label>
                <Input
                  id="datasets"
                  placeholder="Describe available datasets or how they'll be provided"
                  value={formData.datasets}
                  onChange={(e) => updateField("datasets", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiLinks">APIs</Label>
                <Input
                  id="apiLinks"
                  placeholder="Any APIs that will be provided or can be used"
                  value={formData.apiLinks}
                  onChange={(e) => updateField("apiLinks", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceLinks">Reference Links</Label>
                <Input
                  id="referenceLinks"
                  placeholder="Comma-separated URLs (e.g., https://example.com, https://docs.example.org)"
                  value={formData.referenceLinks}
                  onChange={(e) => {
                    updateField("referenceLinks", e.target.value);
                    if (fieldErrors.referenceLinks)
                      setFieldErrors((prev) => ({
                        ...prev,
                        referenceLinks: "",
                      }));
                  }}
                  className={fieldErrors.referenceLinks ? "border-red-500" : ""}
                />
                {fieldErrors.referenceLinks && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.referenceLinks}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium">NDA Required</p>
                  <p className="text-sm text-muted-foreground">
                    Participants must sign an NDA
                  </p>
                </div>
                <Switch
                  checked={formData.ndaRequired}
                  onCheckedChange={(v) => updateField("ndaRequired", v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium">Mentors Provided</p>
                  <p className="text-sm text-muted-foreground">
                    Your org will provide mentors
                  </p>
                </div>
                <Switch
                  checked={formData.mentorsProvided}
                  onCheckedChange={(v) => updateField("mentorsProvided", v)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <CardDescription>
                Point of contact for this problem statement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Full name (min 2 characters)"
                    value={formData.contactPerson}
                    onChange={(e) => {
                      updateField("contactPerson", e.target.value);
                      if (fieldErrors.contactPerson)
                        setFieldErrors((prev) => ({
                          ...prev,
                          contactPerson: "",
                        }));
                    }}
                    className={
                      fieldErrors.contactPerson ? "border-red-500" : ""
                    }
                    required
                  />
                  {fieldErrors.contactPerson && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.contactPerson}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Official Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="email@organization.com"
                    value={formData.contactEmail}
                    onChange={(e) => {
                      updateField("contactEmail", e.target.value);
                      if (fieldErrors.contactEmail)
                        setFieldErrors((prev) => ({
                          ...prev,
                          contactEmail: "",
                        }));
                    }}
                    className={fieldErrors.contactEmail ? "border-red-500" : ""}
                    required
                  />
                  {fieldErrors.contactEmail && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.contactEmail}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/org")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="flex-1"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
