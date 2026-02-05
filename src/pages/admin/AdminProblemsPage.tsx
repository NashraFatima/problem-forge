import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  MoreHorizontal,
  Code,
  Cpu,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockProblems } from '@/data/mockData';
import { ProblemStatement, ProblemStatus } from '@/types';

export default function AdminProblemsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProblemStatus | 'all'>('all');
  const [problems, setProblems] = useState(mockProblems);

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = 
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.organizationName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || problem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' as ProblemStatus } : p));
    toast({ title: 'Problem Approved', description: 'The problem statement is now visible to students.' });
  };

  const handleReject = (id: string) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' as ProblemStatus } : p));
    toast({ title: 'Problem Rejected', description: 'The problem statement has been rejected.' });
  };

  const handleFeature = (id: string) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
    toast({ title: 'Featured status updated' });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">Problem Statements</h1>
        <p className="text-muted-foreground">Manage all submitted problem statements</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or organization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ProblemStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem Statement</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {problem.featured && (
                        <Star className="h-4 w-4 text-warning fill-warning shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[300px]">{problem.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {problem.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{problem.organizationName}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={problem.track === 'software' ? 'track-badge-software' : 'track-badge-hardware'}>
                      {problem.track === 'software' ? <Code className="h-3 w-3 mr-1" /> : <Cpu className="h-3 w-3 mr-1" />}
                      {problem.track}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      problem.difficulty === 'easy' ? 'border-success text-success' :
                      problem.difficulty === 'medium' ? 'border-warning text-warning' :
                      'border-destructive text-destructive'
                    }>
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      problem.status === 'approved' ? 'status-badge-approved' :
                      problem.status === 'pending' ? 'status-badge-pending' :
                      'status-badge-rejected'
                    }>
                      {problem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {problem.status !== 'approved' && (
                          <DropdownMenuItem onClick={() => handleApprove(problem.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-success" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {problem.status !== 'rejected' && (
                          <DropdownMenuItem onClick={() => handleReject(problem.id)}>
                            <XCircle className="mr-2 h-4 w-4 text-destructive" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleFeature(problem.id)}>
                          <Star className={`mr-2 h-4 w-4 ${problem.featured ? 'text-warning fill-warning' : ''}`} />
                          {problem.featured ? 'Remove Feature' : 'Feature'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProblems.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No problems found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
