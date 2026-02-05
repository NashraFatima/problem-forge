import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Code, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SOFTWARE_CATEGORIES, HARDWARE_CATEGORIES, INDUSTRIES, Track, DifficultyLevel } from '@/types';

export default function SubmitProblemPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    track: 'software' as Track,
    category: '',
    title: '',
    description: '',
    industry: '',
    expectedOutcome: '',
    techStack: '',
    difficulty: 'medium' as DifficultyLevel,
    datasets: '',
    apiLinks: '',
    referenceLinks: '',
    ndaRequired: false,
    mentorsProvided: false,
    contactPerson: '',
    contactEmail: '',
  });

  const categories = formData.track === 'software' ? SOFTWARE_CATEGORIES : HARDWARE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Problem Statement Submitted!',
      description: 'Your submission is now pending admin review.',
    });

    setIsSubmitting(false);
    navigate('/org/problems');
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/org')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-display font-bold mb-1">Submit Problem Statement</h1>
        <p className="text-muted-foreground">
          Fill out the form below to submit a new problem statement for the hackathon
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Track Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Track</CardTitle>
              <CardDescription>Choose the primary track for your problem statement</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.track}
                onValueChange={(v) => {
                  updateField('track', v);
                  updateField('category', '');
                }}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="software"
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.track === 'software' 
                      ? 'border-software bg-software-light' 
                      : 'border-border hover:border-software/50'
                  }`}
                >
                  <RadioGroupItem value="software" id="software" className="sr-only" />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.track === 'software' ? 'bg-software text-white' : 'bg-muted'
                  }`}>
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Software</p>
                    <p className="text-xs text-muted-foreground">AI, Web, Mobile, Cloud</p>
                  </div>
                </Label>

                <Label
                  htmlFor="hardware"
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.track === 'hardware' 
                      ? 'border-hardware bg-hardware-light' 
                      : 'border-border hover:border-hardware/50'
                  }`}
                >
                  <RadioGroupItem value="hardware" id="hardware" className="sr-only" />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.track === 'hardware' ? 'bg-hardware text-white' : 'bg-muted'
                  }`}>
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Hardware</p>
                    <p className="text-xs text-muted-foreground">IoT, Robotics, Embedded</p>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        {/* Problem Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Problem Details</CardTitle>
              <CardDescription>Describe your problem statement clearly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Problem Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, concise title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem, its context, and what you're looking for..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedOutcome">Expected Outcome *</Label>
                <Textarea
                  id="expectedOutcome"
                  placeholder="What should the final solution achieve or demonstrate?"
                  rows={3}
                  value={formData.expectedOutcome}
                  onChange={(e) => updateField('expectedOutcome', e.target.value)}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="techStack">Suggested Tech Stack</Label>
                  <Input
                    id="techStack"
                    placeholder="e.g., Python, React, TensorFlow"
                    value={formData.techStack}
                    onChange={(e) => updateField('techStack', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select value={formData.difficulty} onValueChange={(v) => updateField('difficulty', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resources (Optional)</CardTitle>
              <CardDescription>Provide any datasets, APIs, or reference links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="datasets">Datasets</Label>
                <Input
                  id="datasets"
                  placeholder="Describe available datasets or how they'll be provided"
                  value={formData.datasets}
                  onChange={(e) => updateField('datasets', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiLinks">APIs</Label>
                <Input
                  id="apiLinks"
                  placeholder="Any APIs that will be provided or can be used"
                  value={formData.apiLinks}
                  onChange={(e) => updateField('apiLinks', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceLinks">Reference Links</Label>
                <Input
                  id="referenceLinks"
                  placeholder="Comma-separated URLs for reference materials"
                  value={formData.referenceLinks}
                  onChange={(e) => updateField('referenceLinks', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium">NDA Required</p>
                  <p className="text-sm text-muted-foreground">Participants must sign an NDA</p>
                </div>
                <Switch
                  checked={formData.ndaRequired}
                  onCheckedChange={(v) => updateField('ndaRequired', v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-medium">Mentors Provided</p>
                  <p className="text-sm text-muted-foreground">Your org will provide mentors</p>
                </div>
                <Switch
                  checked={formData.mentorsProvided}
                  onCheckedChange={(v) => updateField('mentorsProvided', v)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <CardDescription>Point of contact for this problem statement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Full name"
                    value={formData.contactPerson}
                    onChange={(e) => updateField('contactPerson', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Official Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="email@organization.com"
                    value={formData.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/org')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
