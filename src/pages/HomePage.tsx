import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Users,
  Globe,
  Code,
  Sparkles,
  Rocket,
  Brain,
  Cpu,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useRef } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { data: publicStats } = useQuery({
    queryKey: ["problems", "stats", "public"],
    queryFn: () => api.problems.getPublicStats(),
  });

  const features = [
    {
      title: "Enterprise Assessment",
      description:
        "Create and manage coding problems with industry-standard test cases and evaluation metrics.",
      icon: Building2,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-blue-500/5",
    },
    {
      title: "Real-time Execution",
      description:
        "Secure, sandboxed environments for safe code execution across multiple programming languages.",
      icon: Terminal,
      color: "text-green-400",
      gradient: "from-green-500/20 to-emerald-500/5",
    },
    {
      title: "Global Talent Pool",
      description:
        "Connect with developers worldwide and identify top talent through competitive programming.",
      icon: Globe,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-indigo-500/5",
    },
    {
      title: "AI-Powered Insights",
      description:
        "Advanced analytics to track problem quality, submission trends, and candidate performance.",
      icon: Brain,
      color: "text-rose-400",
      gradient: "from-rose-500/20 to-orange-500/5",
    },
  ];

  const stats = [
    {
      label: "Active Problems",
      value: publicStats ? `${publicStats.totalProblems}+` : "100+",
      icon: Code,
    },
    {
      label: "Organizations",
      value: publicStats ? `${publicStats.totalOrganizations}+` : "50+",
      icon: Building2,
    },
    { label: "Developers", value: "10k+", icon: Users },
    { label: "Submissions", value: "500k+", icon: Cpu },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background text-foreground"
      ref={containerRef}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            style={{ y, opacity }}
            className="text-center max-w-5xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-muted-foreground">
                The Future of Code Assessment
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight"
            >
              Master the Art of
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 pb-4">
                Problem Solving
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed"
            >
              Problem Forge is the ultimate platform for developers to challenge
              themselves and organizations to discover world-class talent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 border-0"
                asChild
              >
                <Link to="/public">
                  Explore Problems <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-sm"
                asChild
              >
                <Link to="/auth/org/register">For Organizations</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-12 px-4 border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                  {stat.value}
                </h3>
                <p className="text-muted-foreground font-medium mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl font-bold"
            >
              Why Problem Forge?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Built for the next generation of technical hiring and skill
              assessment.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${feature.gradient} p-8 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-default`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                  <feature.icon className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-background/50 backdrop-blur-md border border-white/10 mb-6 ${feature.color}`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-b from-blue-900/20 to-purple-900/20 backdrop-blur-md">
            <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]" />

            <div className="relative z-10 py-20 px-8 md:px-20 text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm"
              >
                <Rocket className="w-8 h-8 text-blue-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-4xl md:text-6xl font-bold max-w-3xl mx-auto"
              >
                Ready to transform your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {" "}
                  coding journey?
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Join thousands of developers and top organizations on the most
                advanced problem-solving platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              >
                <Button
                  size="lg"
                  className="h-16 px-10 text-xl rounded-full bg-white text-black hover:bg-gray-200 border-0"
                  asChild
                >
                  <Link to="/auth/org/register">Get Started Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-16 px-10 text-xl rounded-full hover:bg-white/10"
                  asChild
                >
                  <Link to="/public">View Problem Set</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Decoration */}
      <footer className="relative z-10 py-12 text-center text-muted-foreground border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-foreground">Problem Forge</span>
        </div>
        <p>© 2026 Problem Forge. All rights reserved.</p>
      </footer>
    </div>
  );
}
