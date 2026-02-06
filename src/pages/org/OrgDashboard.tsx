import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function OrgDashboard() {
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["org", "dashboard"],
    queryFn: () => api.org.getDashboard(),
  });

  const { data: orgProblems = [], isLoading: isLoadingProblems } = useQuery({
    queryKey: ["org", "problems"],
    queryFn: () => api.org.getProblems(),
  });

  const isLoading = isLoadingDashboard || isLoadingProblems;

  const stats = [
    {
      label: "Total Submissions",
      value: dashboardData?.totalProblems ?? 0,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pending Review",
      value: dashboardData?.pendingProblems ?? 0,
      icon: Clock,
      color: "text-pending",
      bg: "bg-pending/10",
    },
    {
      label: "Approved",
      value: dashboardData?.approvedProblems ?? 0,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Rejected",
      value: dashboardData?.rejectedProblems ?? 0,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">
            Organization Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your problem statement submissions
          </p>
        </div>
        <Button asChild>
          <Link to="/org/submit">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit New Problem
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-display font-bold mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Submissions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/org/problems">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orgProblems.slice(0, 5).map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{problem.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        problem.track === "software"
                          ? "track-badge-software"
                          : "track-badge-hardware"
                      }`}
                    >
                      {problem.track}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {problem.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    problem.status === "approved"
                      ? "status-badge-approved"
                      : problem.status === "pending"
                        ? "status-badge-pending"
                        : "status-badge-rejected"
                  }`}
                >
                  {problem.status.charAt(0).toUpperCase() +
                    problem.status.slice(1)}
                </span>
              </div>
            ))}

            {orgProblems.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  No problem statements submitted yet
                </p>
                <Button asChild>
                  <Link to="/org/submit">Submit Your First Problem</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
