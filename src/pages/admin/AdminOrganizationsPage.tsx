import { motion } from 'framer-motion';
import { Building2, CheckCircle, XCircle, Eye, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockOrganizations } from '@/data/mockData';

export default function AdminOrganizationsPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Organizations</h1>
          <p className="text-muted-foreground">{mockOrganizations.length} registered organizations</p>
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOrganizations.map((org, index) => (
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
                      <a href={org.website} className="truncate hover:text-foreground transition-colors">
                        {org.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Problems
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
