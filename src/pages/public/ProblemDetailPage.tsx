import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Code,
  Cpu,
  Mail,
  User,
  ExternalLink,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";

export default function ProblemDetailPage() {
  const { id } = useParams();

  const {
    data: problem,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => api.problems.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen py-16">
        <div className="container text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
          <Button asChild>
            <Link to="/problems">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Problems
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Back Link */}
        <Link
          to="/problems"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Problems
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-8 mb-6">
            {/* Featured Badge */}
            {problem.featured && (
              <div className="flex items-center gap-1 text-warning text-sm font-medium mb-4">
                <Star className="h-4 w-4 fill-current" />
                Featured Problem
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  problem.track === "software"
                    ? "track-badge-software"
                    : "track-badge-hardware"
                }`}
              >
                {problem.track === "software" ? (
                  <Code className="h-4 w-4" />
                ) : (
                  <Cpu className="h-4 w-4" />
                )}
                {problem.track === "software"
                  ? "Software Track"
                  : "Hardware Track"}
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  problem.difficulty === "easy"
                    ? "bg-success-light text-success-foreground"
                    : problem.difficulty === "medium"
                      ? "bg-warning-light text-warning-foreground"
                      : "bg-destructive/10 text-destructive"
                }`}
              >
                {problem.difficulty.charAt(0).toUpperCase() +
                  problem.difficulty.slice(1)}{" "}
                Difficulty
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">
              {problem.title}
            </h1>

            {/* Category & Industry */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{problem.category}</Badge>
              <Badge variant="outline">{problem.industry}</Badge>
            </div>

            {/* Organization Info */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{problem.organization.name}</p>
                <p className="text-sm text-muted-foreground">
                  {problem.industry} Industry
                </p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Problem Description
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {problem.description}
                </p>
              </div>

              {/* Expected Outcome */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Expected Outcome
                </h2>
                <p className="text-muted-foreground">
                  {problem.expectedOutcome}
                </p>
              </div>

              {/* Tech Stack */}
              {problem.techStack && problem.techStack.length > 0 && (
                <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5 text-accent" />
                    Suggested Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {problem.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {(problem.datasets ||
                problem.apiLinks ||
                (problem.referenceLinks &&
                  problem.referenceLinks.length > 0)) && (
                <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    Resources & Links
                  </h2>
                  <div className="space-y-4">
                    {problem.datasets && (
                      <div>
                        <p className="text-sm font-medium mb-1">Datasets</p>
                        <p className="text-sm text-muted-foreground">
                          {problem.datasets}
                        </p>
                      </div>
                    )}
                    {problem.apiLinks && (
                      <div>
                        <p className="text-sm font-medium mb-1">APIs</p>
                        <p className="text-sm text-muted-foreground">
                          {problem.apiLinks}
                        </p>
                      </div>
                    )}
                    {problem.referenceLinks &&
                      problem.referenceLinks.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Reference Links
                          </p>
                          <div className="space-y-1">
                            {problem.referenceLinks.map((link, i) => (
                              <a
                                key={i}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-primary hover:underline"
                              >
                                {link}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <h3 className="font-semibold mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      NDA Required
                    </span>
                    <Badge
                      variant={
                        problem.ndaRequired ? "destructive" : "secondary"
                      }
                    >
                      {problem.ndaRequired ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Mentors
                    </span>
                    <Badge
                      variant={
                        problem.mentorsProvided ? "default" : "secondary"
                      }
                    >
                      {problem.mentorsProvided ? (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Available
                        </span>
                      ) : (
                        "Not Available"
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {problem.contactPerson}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Contact Person
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium break-all">
                        {problem.contactEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning for NDA */}
              {problem.ndaRequired && (
                <div className="bg-warning-light rounded-2xl border border-warning/20 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning-foreground">
                        NDA Required
                      </p>
                      <p className="text-xs text-warning-foreground/80 mt-1">
                        This problem statement requires signing a Non-Disclosure
                        Agreement before receiving full details.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
