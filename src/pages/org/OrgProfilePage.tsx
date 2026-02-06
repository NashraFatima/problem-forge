import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Mail, User, Save, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { api, ApiError, Organization } from "@/lib/api";
import { INDUSTRIES } from "@/types";

export default function OrgProfilePage() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    description: "",
    contactPerson: "",
    contactEmail: "",
  });

  // Fetch organization profile
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["org", "profile"],
    queryFn: api.org.getProfile,
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        industry: profile.industry || "",
        website: profile.website || "",
        description: profile.description || "",
        contactPerson: profile.contactPerson || "",
        contactEmail: profile.contactEmail || "",
      });
    }
  }, [profile]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Organization>) => api.org.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["org", "dashboard"] });
      toast.success("Profile Updated", {
        description: "Your organization profile has been saved.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Failed to update profile";
      toast.error("Update Failed", {
        description: message,
      });
    },
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    updateMutation.mutate({
      name: formData.name,
      industry: formData.industry as Organization["industry"],
      website: formData.website || undefined,
      description: formData.description || undefined,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold mb-1">
            Organization Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's information
          </p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold mb-1">
            Organization Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's information
          </p>
        </div>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load profile. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">
          Organization Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your organization's information
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Organization Details</CardTitle>
            <CardDescription>
              This information will be displayed with your problem statements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(v) => updateField("industry", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  className="pl-10"
                  value={formData.website}
                  onChange={(e) => updateField("website", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactPerson"
                    className="pl-10"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      updateField("contactPerson", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    className="pl-10"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      updateField("contactEmail", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
