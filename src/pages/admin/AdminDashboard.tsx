import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  Star,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockProblems, mockOrganizations, mockAuditLogs } from '@/data/mockData';

export default function AdminDashboard() {
  const totalProblems = mockProblems.length;
  const pendingCount = mockProblems.filter(p => p.status === 'pending').length;
  const approvedCount = mockProblems.filter(p => p.status === 'approved').length;
  const featuredCount = mockProblems.filter(p => p.featured).length;

  const stats = [
    { label: 'Total Problems', value: totalProblems, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Pending Review', value: pendingCount, icon: Clock, color: 'text-pending', bg: 'bg-pending/10' },
    { label: 'Approved', value: approvedCount, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Organizations', value: mockOrganizations.length, icon: Building2, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  const pendingProblems = mockProblems.filter(p => p.status === 'pending');
  const recentLogs = mockAuditLogs.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage problem statements, organizations, and platform settings</p>
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
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-display font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Pending Review</CardTitle>
                {pendingCount > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pending text-white text-xs font-medium">
                    {pendingCount}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/pending">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingProblems.length > 0 ? (
                  pendingProblems.slice(0, 4).map((problem) => (
                    <Link
                      key={problem.id}
                      to={`/admin/problems/${problem.id}`}
                      className="block p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{problem.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {problem.organizationName}
                          </p>
                        </div>
                        <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                          problem.track === 'software' ? 'track-badge-software' : 'track-badge-hardware'
                        }`}>
                          {problem.track}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                    <p className="text-muted-foreground">All caught up! No pending reviews.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/audit">
                  View Audit Logs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      log.action.includes('APPROVE') ? 'bg-success/10 text-success' :
                      log.action.includes('REJECT') ? 'bg-destructive/10 text-destructive' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {log.action.includes('APPROVE') ? <CheckCircle className="h-4 w-4" /> :
                       log.action.includes('REJECT') ? <XCircle className="h-4 w-4" /> :
                       <Star className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{log.details}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {log.adminName} • {log.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4" asChild>
                <Link to="/admin/problems">
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <span className="block font-medium">All Problems</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      View & manage all submissions
                    </span>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="h-auto py-4" asChild>
                <Link to="/admin/organizations">
                  <div className="text-center">
                    <Building2 className="h-6 w-6 mx-auto mb-2" />
                    <span className="block font-medium">Organizations</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Manage partner organizations
                    </span>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="h-auto py-4" asChild>
                <Link to="/admin/audit">
                  <div className="text-center">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                    <span className="block font-medium">Audit Logs</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      View all admin actions
                    </span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
