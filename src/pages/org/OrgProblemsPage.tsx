import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockProblems } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Eye, Edit, Code, Cpu } from 'lucide-react';

export default function OrgProblemsPage() {
  // Filter problems for this org (mock: org-1)
  const orgProblems = mockProblems.filter(p => p.organizationId === 'org-1');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">My Problem Statements</h1>
          <p className="text-muted-foreground">View and manage your submitted problem statements</p>
        </div>
        <Button asChild>
          <Link to="/org/submit">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit New
          </Link>
        </Button>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {orgProblems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className={problem.track === 'software' ? 'track-badge-software' : 'track-badge-hardware'}>
                        {problem.track === 'software' ? <Code className="h-3 w-3 mr-1" /> : <Cpu className="h-3 w-3 mr-1" />}
                        {problem.track}
                      </Badge>
                      <Badge className={
                        problem.status === 'approved' ? 'status-badge-approved' :
                        problem.status === 'pending' ? 'status-badge-pending' :
                        'status-badge-rejected'
                      }>
                        {problem.status}
                      </Badge>
                      <Badge variant="outline" className={
                        problem.difficulty === 'easy' ? 'border-success text-success' :
                        problem.difficulty === 'medium' ? 'border-warning text-warning' :
                        'border-destructive text-destructive'
                      }>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{problem.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Category: {problem.category}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {problem.status === 'pending' && (
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {orgProblems.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't submitted any problem statements yet.</p>
              <Button asChild>
                <Link to="/org/submit">Submit Your First Problem</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
