import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ArrowRight,
  Code,
  Cpu,
  Building2,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, type ProblemStatement } from "@/lib/api";
import {
  SOFTWARE_CATEGORIES,
  HARDWARE_CATEGORIES,
  Track,
  DifficultyLevel,
} from "@/types";

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<Track | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<
    DifficultyLevel | "all"
  >("all");

  const {
    data: problems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "problems",
      {
        track: trackFilter !== "all" ? trackFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
      },
    ],
    queryFn: () =>
      api.problems.list({
        track: trackFilter !== "all" ? trackFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
      }),
  });

  const categories =
    trackFilter === "software"
      ? SOFTWARE_CATEGORIES
      : trackFilter === "hardware"
        ? HARDWARE_CATEGORIES
        : [...SOFTWARE_CATEGORIES, ...HARDWARE_CATEGORIES];

  const filteredProblems = useMemo(() => {
    return problems.filter((problem: ProblemStatement) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.description.toLowerCase().includes(search.toLowerCase()) ||
        problem.organization.name.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [problems, search]);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Problem Statements
          </h1>
          <p className="text-muted-foreground">
            Browse and select challenges from our partner organizations
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems, organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Track Filter */}
            <Select
              value={trackFilter}
              onValueChange={(v) => {
                setTrackFilter(v as Track | "all");
                setCategoryFilter("all");
              }}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                <SelectItem value="software">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Software
                  </div>
                </SelectItem>
                <SelectItem value="hardware">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Hardware
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-[280px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select
              value={difficultyFilter}
              onValueChange={(v) =>
                setDifficultyFilter(v as DifficultyLevel | "all")
              }
            >
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading problems...
              </span>
            ) : (
              <>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredProblems.length}
                </span>{" "}
                problem statements
              </>
            )}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Failed to load problems
            </h3>
            <p className="text-muted-foreground mb-4">Please try again later</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Problems Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/problems/${problem.id}`}
                  className="block h-full p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all group"
                >
                  {/* Featured Badge */}
                  {problem.featured && (
                    <div className="flex items-center gap-1 text-warning text-xs font-medium mb-3">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        problem.track === "software"
                          ? "track-badge-software"
                          : "track-badge-hardware"
                      }`}
                    >
                      {problem.track === "software" ? "Software" : "Hardware"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty === "easy"
                          ? "bg-success-light text-success-foreground"
                          : problem.difficulty === "medium"
                            ? "bg-warning-light text-warning-foreground"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() +
                        problem.difficulty.slice(1)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {problem.title}
                  </h3>

                  {/* Category */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                    {problem.category}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {problem.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                        {problem.organization.name}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Tags */}
                  {problem.mentorsProvided && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <Badge variant="secondary" className="text-xs">
                        Mentors Available
                      </Badge>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProblems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No problems found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setTrackFilter("all");
                setCategoryFilter("all");
                setDifficultyFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
