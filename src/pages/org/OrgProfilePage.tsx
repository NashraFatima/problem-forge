import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, Mail, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { INDUSTRIES } from '@/types';

export default function OrgProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: 'TechCorp Global',
    industry: 'Technology',
    website: 'https://techcorp.example.com',
    description: 'Leading technology solutions provider focused on AI and cloud computing.',
    contactPerson: 'John Smith',
    contactEmail: 'john@techcorp.example.com',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({ title: 'Profile Updated', description: 'Your organization profile has been saved.' });
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold mb-1">Organization Profile</h1>
        <p className="text-muted-foreground">Manage your organization's information</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Organization Details</CardTitle>
            <CardDescription>This information will be displayed with your problem statements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  className="pl-10"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactPerson"
                    className="pl-10"
                    value={formData.contactPerson}
                    onChange={(e) => updateField('contactPerson', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    className="pl-10"
                    value={formData.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
