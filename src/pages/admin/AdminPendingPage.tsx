import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Eye, Code, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockProblems } from '@/data/mockData';
import { useState } from 'react';
import { ProblemStatus } from '@/types';

export default function AdminPendingPage() {
  const { toast } = useToast();
  const [problems, setProblems] = useState(mockProblems.filter(p => p.status === 'pending'));

  const handleApprove = (id: string) => {
    setProblems(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Problem Approved', description: 'The problem statement is now visible to students.' });
  };

  const handleReject = (id: string) => {
    setProblems(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Problem Rejected', description: 'The problem statement has been rejected.' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-pending/10 flex items-center justify-center">
          <Clock className="h-5 w-5 text-pending" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Pending Review</h1>
          <p className="text-muted-foreground">{problems.length} problem statements awaiting approval</p>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={problem.track === 'software' ? 'track-badge-software' : 'track-badge-hardware'}>
                        {problem.track === 'software' ? <Code className="h-3 w-3 mr-1" /> : <Cpu className="h-3 w-3 mr-1" />}
                        {problem.track}
                      </Badge>
                      <Badge variant="outline">{problem.category}</Badge>
                      <Badge variant="outline" className={
                        problem.difficulty === 'easy' ? 'border-success text-success' :
                        problem.difficulty === 'medium' ? 'border-warning text-warning' :
                        'border-destructive text-destructive'
                      }>
                        {problem.difficulty}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-1">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      by <span className="font-medium text-foreground">{problem.organizationName}</span>
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{problem.description}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {problem.ndaRequired && (
                        <Badge variant="secondary">NDA Required</Badge>
                      )}
                      {problem.mentorsProvided && (
                        <Badge variant="secondary">Mentors Provided</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full
                    </Button>
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90"
                      onClick={() => handleApprove(problem.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(problem.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {problems.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground mb-4">No problem statements are pending review.</p>
              <Button variant="outline" asChild>
                <Link to="/admin/problems">View All Problems</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
