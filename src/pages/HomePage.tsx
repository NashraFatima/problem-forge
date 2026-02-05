import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Users, Zap, Award, Globe, Code, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProblems } from '@/data/mockData';

const stats = [
  { label: 'Problem Statements', value: '50+', icon: Code },
  { label: 'Partner Organizations', value: '25+', icon: Building2 },
  { label: 'Participants', value: '1000+', icon: Users },
  { label: 'Categories', value: '12', icon: Award },
];

const features = [
  {
    title: 'Real-World Challenges',
    description: 'Work on actual industry problems from leading companies, startups, and research labs.',
    icon: Globe,
  },
  {
    title: 'Software & Hardware Tracks',
    description: 'Choose from AI, FinTech, IoT, Robotics, and many more specialized categories.',
    icon: Cpu,
  },
  {
    title: 'Expert Mentorship',
    description: 'Get guidance from industry professionals throughout your hackathon journey.',
    icon: Award,
  },
];

export default function HomePage() {
  const featuredProblems = mockProblems.filter(p => p.featured && p.status === 'approved').slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Industry x Student Collaboration
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6">
              Solve{' '}
              <span className="gradient-text">Real Problems</span>
              <br />
              Build Real Impact
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Connect with leading organizations and tackle industry-grade challenges. 
              Choose from software and hardware tracks designed for the next generation of innovators.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base px-8">
                <Link to="/problems">
                  Browse Problems
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8">
                <Link to="/org/register">
                  <Building2 className="mr-2 h-5 w-5" />
                  Submit a Challenge
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl md:text-4xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Participate?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join a platform that bridges the gap between academic learning and industry needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Featured Challenges
              </h2>
              <p className="text-muted-foreground">
                Hand-picked problem statements from our partner organizations
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/problems">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={`/problems/${problem.id}`}
                  className="block p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all group"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      problem.track === 'software' ? 'track-badge-software' : 'track-badge-hardware'
                    }`}>
                      {problem.track === 'software' ? 'Software' : 'Hardware'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      problem.difficulty === 'easy' ? 'bg-success-light text-success-foreground' :
                      problem.difficulty === 'medium' ? 'bg-warning-light text-warning-foreground' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {problem.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {problem.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {problem.organizationName}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center"
            style={{ background: 'var(--gradient-hero)' }}
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Have a Challenge for Students?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Organizations of all sizes can submit problem statements. Connect with talented students
                and get fresh perspectives on your real-world challenges.
              </p>
              <Button size="lg" variant="secondary" asChild className="text-base">
                <Link to="/org/register">
                  Register Your Organization
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
