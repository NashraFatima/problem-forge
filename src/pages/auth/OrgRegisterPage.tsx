import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Building2, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { INDUSTRIES } from '@/types';

export default function OrgRegisterPage() {
  const navigate = useNavigate();
  const { setMockRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    organizationName: '',
    industry: '',
    website: '',
    description: '',
    contactPerson: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMockRole('organization');
    toast({ title: 'Registration Successful!', description: 'Welcome to DevUp!' });
    navigate('/org');
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-background via-background to-accent/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">DevUp</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl font-display">Register Organization</CardTitle>
            <CardDescription>
              Create an account to submit problem statements for the hackathon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress */}
            <div className="flex gap-2 mb-6">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="organizationName"
                        placeholder="Your Organization"
                        className="pl-10"
                        value={formData.organizationName}
                        onChange={(e) => updateField('organizationName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
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
                        placeholder="https://yourcompany.com"
                        className="pl-10"
                        value={formData.website}
                        onChange={(e) => updateField('website', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Brief Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your organization..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setStep(2)}
                    disabled={!formData.organizationName || !formData.industry}
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactPerson"
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.contactPerson}
                        onChange={(e) => updateField('contactPerson', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@organization.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/org/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:underline">Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}
