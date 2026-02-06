import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { api, type Organization } from "@/lib/api";

export default function AdminOrganizationsPage() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin", "organizations"],
    queryFn: () => api.admin.getOrganizations(),
  });

  const organizations = response?.organizations ?? [];

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      api.admin.verifyOrganization(id, verified),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] });
      toast.success(
        variables.verified ? "Organization Verified" : "Verification Removed",
        {
          description: variables.verified
            ? "The organization is now verified."
            : "The organization verification has been removed.",
        },
      );
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to update organization",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            {organizations.length} registered organizations
          </p>
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org, index) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{org.name}</h3>
                      {org.verified && (
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      )}
                    </div>
                    <Badge variant="secondary">{org.industry}</Badge>
                  </div>
                </div>

                {org.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {org.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{org.contactEmail}</span>
                  </div>
                  {org.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <a
                        href={org.website}
                        className="truncate hover:text-foreground transition-colors"
                      >
                        {org.website.replace("https://", "")}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant={org.verified ? "outline" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      verifyMutation.mutate({
                        id: org.id,
                        verified: !org.verified,
                      })
                    }
                    disabled={verifyMutation.isPending}
                  >
                    {org.verified ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Unverify
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {organizations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No organizations registered yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
