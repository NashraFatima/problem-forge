import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Users,
  Award,
  Globe,
  Code,
  Sparkles,
  Rocket,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { data: publicStats } = useQuery({
    queryKey: ["problems", "stats", "public"],
    queryFn: () => api.problems.getPublicStats(),
  });

  const stats = [
    {
      label: "Active Problems",
      value: publicStats ? `${publicStats.totalProblems}+` : "50+",
      icon: Code,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Partner Organizations",
      value: publicStats ? `${publicStats.totalOrganizations}+` : "25+",
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Total Participants",
      value: "1000+",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Prize Pool",
      value: "₹50 Lakhs+",
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl opacity-50" />

        <div className="container relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto text-center space-y-8"
          >
            <motion.div variants={item} className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                DevThon 2026 is Here
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Innovate for the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Future
              </span>
              <br />
              Solve Real Problems.
            </motion.h1>

            <motion.p
              variants={item}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              The ultimate platform connecting visionary organizations with
              talented developers. Tackle industry-grade challenges and showcase
              your innovation at{" "}
              <span className="font-semibold text-foreground">
                DevThon 2026
              </span>
              .
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                asChild
              >
                <Link to="/problems">
                  Browse Statements <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5 transition-all"
                asChild
              >
                <Link to="/org/register">Submit a Problem</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/40 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center text-center p-4 rounded-2xl hover:bg-background hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`p-4 rounded-2xl ${stat.bg} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold font-display text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Why Participate in DevThon?
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you are a student developer or an industry leader, DevThon
              offers unique opportunities to innovate and grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BrainCircuit,
                title: "Challenging Problems",
                desc: "Don't just build toy apps. Work on complex, real-world issues submitted by top organizations that require deep technical thinking.",
                color: "text-primary",
              },
              {
                icon: Rocket,
                title: "Career Launchpad",
                desc: "Showcase your skills directly to potential employers. Top performing teams often get internship and job offers.",
                color: "text-accent",
              },
              {
                icon: Globe,
                title: "Global Impact",
                desc: "Your solutions have the potential to scale. We partner with NGOs and Gov bodies to implement winning ideas.",
                color: "text-blue-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Organizations Section */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm border border-white/20">
                <Building2 className="h-4 w-4" /> For Organizations
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                Source Innovation from the Next Gen Talent
              </h2>
              <p className="text-lg text-gray-400">
                Submit your most pressing technical challenges and have hundreds
                of bright minds work on them over an intense 48-hour hackathon.
              </p>

              <ul className="space-y-4">
                {[
                  "Access to top-tier developer talent",
                  "Rapid prototyping of new ideas",
                  "Brand visibility among tech community",
                  "Keep IP rights to solutions",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="h-14 px-8 rounded-full bg-white text-foreground hover:bg-gray-100 mt-4"
                asChild
              >
                <Link to="/org/register">Register as Organization</Link>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-20 rounded-3xl blur-xl" />
              <div className="relative bg-background/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="space-y-6">
                  <div className="h-2 w-20 bg-primary rounded-full" />
                  <h3 className="text-2xl font-bold text-white">
                    "We found our best hires through DevThon."
                  </h3>
                  <p className="text-gray-300 italic">
                    "The quality of solutions presented was beyond our
                    expectations. Two of the winning team members are now
                    leading our R&D division."
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                      FS
                    </div>
                    <div>
                      <div className="font-bold text-white">Faizan Sk</div>
                      <div className="text-sm text-gray-400">
                        CEO, DevUp Society .inc
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-primary px-6 py-20 text-center md:px-20 text-primary-foreground">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Ready to make a difference?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/80">
                Join thousands of developers and organizations in the biggest
                problem solving event of the year.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 px-8 text-lg rounded-full text-primary"
                  asChild
                >
                  <Link to="/problems">Explore Problems</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground"
                  asChild
                >
                  <Link to="/org/register">Partner with us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="container md:flex justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">DevThon</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 DevUp Society. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground font-medium">
            <Link to="#" className="hover:text-foreground">
              About
            </Link>
            <Link to="#" className="hover:text-foreground">
              Sponsorship
            </Link>
            <Link to="#" className="hover:text-foreground">
              Code of Conduct
            </Link>
            <Link to="#" className="hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
