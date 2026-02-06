import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Code,
  Cpu,
  Loader2,
  Calendar,
  Building2,
  Mail,
  User,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { api, type ProblemStatement } from "@/lib/api";

// Helper function to format date with day, date, and time
function formatDateTime(dateString: string | Date): {
  day: string;
  date: string;
  time: string;
  relative: string;
} {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  let relative = "";
  if (diffMinutes < 1) {
    relative = "Just now";
  } else if (diffMinutes < 60) {
    relative = `${diffMinutes} min ago`;
  } else if (diffHours < 24) {
    relative = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    relative = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else {
    relative = date.toLocaleDateString();
  }

  return {
    day: date.toLocaleDateString("en-US", { weekday: "long" }),
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    relative,
  };
}

export default function AdminPendingPage() {
  const queryClient = useQueryClient();
  const [selectedProblem, setSelectedProblem] =
    useState<ProblemStatement | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const { data: problems = [], isLoading } = useQuery({
    queryKey: ["admin", "problems", "pending"],
    queryFn: () => api.admin.getPendingProblems(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: "approved" | "rejected";
      adminNotes?: string;
    }) => api.admin.reviewProblem(id, status, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "problems"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  const handleApprove = () => {
    if (!selectedProblem) return;
    reviewMutation.mutate(
      { id: selectedProblem.id, status: "approved" },
      {
        onSuccess: () => {
          toast.success("Problem Approved", {
            description: "The problem statement is now visible to students.",
          });
          setShowApproveDialog(false);
          setSelectedProblem(null);
        },
        onError: () => {
          toast.error("Error", {
            description: "Failed to approve problem",
          });
        },
      },
    );
  };

  const handleReject = () => {
    if (!selectedProblem) return;
    reviewMutation.mutate(
      {
        id: selectedProblem.id,
        status: "rejected",
        adminNotes: rejectNotes || "Rejected by admin",
      },
      {
        onSuccess: () => {
          toast.success("Problem Rejected", {
            description: "The problem statement has been rejected.",
          });
          setShowRejectDialog(false);
          setSelectedProblem(null);
          setRejectNotes("");
        },
        onError: () => {
          toast.error("Error", {
            description: "Failed to reject problem",
          });
        },
      },
    );
  };

  const openApproveDialog = (problem: ProblemStatement) => {
    setSelectedProblem(problem);
    setShowApproveDialog(true);
  };

  const openRejectDialog = (problem: ProblemStatement) => {
    setSelectedProblem(problem);
    setRejectNotes("");
    setShowRejectDialog(true);
  };

  const openViewDialog = (problem: ProblemStatement) => {
    setSelectedProblem(problem);
    setShowViewDialog(true);
  };

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
        <div className="w-10 h-10 rounded-xl bg-pending/10 flex items-center justify-center">
          <Clock className="h-5 w-5 text-pending" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Pending Review</h1>
          <p className="text-muted-foreground">
            {problems.length} problem statements awaiting approval
          </p>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {problems.map((problem, index) => {
          const dateInfo = formatDateTime(problem.createdAt);
          return (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-1 min-w-0">
                      {/* Date/Time Header */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="font-medium">{dateInfo.day}</span>
                        <span>•</span>
                        <span>{dateInfo.date}</span>
                        <span>•</span>
                        <span>{dateInfo.time}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {dateInfo.relative}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge
                          className={
                            problem.track === "software"
                              ? "track-badge-software"
                              : "track-badge-hardware"
                          }
                        >
                          {problem.track === "software" ? (
                            <Code className="h-3 w-3 mr-1" />
                          ) : (
                            <Cpu className="h-3 w-3 mr-1" />
                          )}
                          {problem.track}
                        </Badge>
                        <Badge variant="outline">{problem.category}</Badge>
                        <Badge variant="outline">{problem.industry}</Badge>
                        <Badge
                          variant="outline"
                          className={
                            problem.difficulty === "easy"
                              ? "border-success text-success"
                              : problem.difficulty === "medium"
                                ? "border-warning text-warning"
                                : "border-destructive text-destructive"
                          }
                        >
                          {problem.difficulty}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-1">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        by{" "}
                        <span className="font-medium text-foreground">
                          {problem.organization.name}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {problem.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {problem.ndaRequired && (
                          <Badge variant="secondary">NDA Required</Badge>
                        )}
                        {problem.mentorsProvided && (
                          <Badge variant="secondary">Mentors Provided</Badge>
                        )}
                        {problem.techStack && problem.techStack.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {problem.techStack.length} tech stack items
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewDialog(problem)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full
                      </Button>
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90"
                        onClick={() => openApproveDialog(problem)}
                        disabled={reviewMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openRejectDialog(problem)}
                        disabled={reviewMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {problems.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground mb-4">
                No problem statements are pending review.
              </p>
              <Button variant="outline" asChild>
                <Link to="/admin/problems">View All Problems</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Full Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedProblem?.title}
            </DialogTitle>
            <DialogDescription>
              Submitted by {selectedProblem?.organization.name}
              {selectedProblem?.createdAt && (
                <span className="ml-2">
                  on {formatDateTime(selectedProblem.createdAt).date} at{" "}
                  {formatDateTime(selectedProblem.createdAt).time}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedProblem && (
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={
                      selectedProblem.track === "software"
                        ? "track-badge-software"
                        : "track-badge-hardware"
                    }
                  >
                    {selectedProblem.track === "software" ? (
                      <Code className="h-3 w-3 mr-1" />
                    ) : (
                      <Cpu className="h-3 w-3 mr-1" />
                    )}
                    {selectedProblem.track}
                  </Badge>
                  <Badge variant="outline">{selectedProblem.category}</Badge>
                  <Badge variant="outline">{selectedProblem.industry}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      selectedProblem.difficulty === "easy"
                        ? "border-success text-success"
                        : selectedProblem.difficulty === "medium"
                          ? "border-warning text-warning"
                          : "border-destructive text-destructive"
                    }
                  >
                    {selectedProblem.difficulty}
                  </Badge>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedProblem.description}
                  </p>
                </div>

                {/* Expected Outcome */}
                <div>
                  <h4 className="font-semibold mb-2">Expected Outcome</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedProblem.expectedOutcome}
                  </p>
                </div>

                {/* Tech Stack */}
                {selectedProblem.techStack &&
                  selectedProblem.techStack.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProblem.techStack.map((tech, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Datasets */}
                {selectedProblem.datasets && (
                  <div>
                    <h4 className="font-semibold mb-2">Datasets</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedProblem.datasets}
                    </p>
                  </div>
                )}

                {/* API Links */}
                {selectedProblem.apiLinks && (
                  <div>
                    <h4 className="font-semibold mb-2">API Links</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedProblem.apiLinks}
                    </p>
                  </div>
                )}

                {/* Reference Links */}
                {selectedProblem.referenceLinks &&
                  selectedProblem.referenceLinks.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Reference Links</h4>
                      <div className="space-y-1">
                        {selectedProblem.referenceLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                <Separator />

                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Contact: </span>
                      {selectedProblem.contactPerson}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Email: </span>
                      <a
                        href={`mailto:${selectedProblem.contactEmail}`}
                        className="text-primary hover:underline"
                      >
                        {selectedProblem.contactEmail}
                      </a>
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-4">
                  {selectedProblem.ndaRequired && (
                    <Badge variant="secondary">NDA Required</Badge>
                  )}
                  {selectedProblem.mentorsProvided && (
                    <Badge variant="secondary">Mentors Provided</Badge>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            <Button
              className="bg-success hover:bg-success/90"
              onClick={() => {
                setShowViewDialog(false);
                if (selectedProblem) openApproveDialog(selectedProblem);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowViewDialog(false);
                if (selectedProblem) openRejectDialog(selectedProblem);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Problem Statement?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve "{selectedProblem?.title}"? This
              will make it visible to all students and participants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-success hover:bg-success/90"
              onClick={handleApprove}
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Yes, Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Problem Statement?</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject "{selectedProblem?.title}"? Please
              provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectNotes">Rejection Reason (Optional)</Label>
              <Textarea
                id="rejectNotes"
                placeholder="Enter the reason for rejection..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Yes, Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
