import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
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

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-white">
      {/* Subtle Grey Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-slate-100 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-gray-100 rounded-full blur-[120px]"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative border border-slate-200 rounded-2xl bg-white p-8 overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all duration-300"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 0, 0, 0.03),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100 mb-6`}
        >
          <feature.icon className="w-6 h-6 text-slate-900" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900">
          {feature.title}
        </h3>
        <p className="text-slate-600 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to Feb 28, 2026 (or slightly in future from "current date" Feb 7)
    const targetDate = new Date("2026-02-28T09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef });

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
    },
    {
      title: "Real-time Execution",
      description:
        "Secure, sandboxed environments for safe code execution across multiple programming languages.",
      icon: Terminal,
    },
    {
      title: "Global Talent Pool",
      description:
        "Connect with developers worldwide and identify top talent through competitive programming.",
      icon: Globe,
    },
    {
      title: "AI-Powered Insights",
      description:
        "Advanced analytics to track problem quality, submission trends, and candidate performance.",
      icon: Brain,
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
      className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200 overflow-hidden"
      ref={containerRef}
    >
      <HeroBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24 lg:pt-48 lg:pb-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-5xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white shadow-sm text-slate-600 text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>The Future of Tech Assessment</span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6 text-slate-900">
                Redefine Potential with <br className="hidden md:block" />
                <span className="text-slate-900 relative">
                  Problem Forge
                  <span className="absolute -bottom-2 left-0 w-full h-2 bg-slate-200/50 -skew-x-12 -z-10"></span>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
                The ultimate platform for competitive programming, technical
                hiring, and developer skill enhancement. Join{" "}
                <span className="text-slate-900 font-semibold">
                  DevThon 2026
                </span>{" "}
                and shape the future.
              </p>

              {/* Countdown Timer */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-white border border-slate-200 rounded-xl p-4 min-w-[90px] shadow-lg shadow-slate-200/50"
                  >
                    <span className="text-3xl font-mono font-bold text-slate-900">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all font-semibold shadow-xl shadow-slate-900/10"
                  asChild
                >
                  <Link to="/problems">Start Solving</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-900 shadow-sm"
                  asChild
                >
                  <Link to="/org/register">For Organizations</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats - Glass Bento Grid */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-5 h-5 text-slate-900" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Spotlight Effect */}
      <section className="relative z-10 py-24 px-4 bg-slate-50/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-slate-900">
              Why Problem Forge?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Built for the next generation of technical hiring and skill
              assessment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* DevUp Society & Footer CTA */}
      <section className="relative z-10 py-24 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 p-8 md:p-16 text-center overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-slate-900" />
              </div>

              <h2 className="font-display text-4xl md:text-6xl font-bold text-slate-900">
                Ready to start <br /> your journey?
              </h2>

              <p className="text-slate-600 max-w-xl mx-auto text-lg">
                Join thousands of developers pushing the boundaries of what's
                possible. Powered by{" "}
                <span className="text-slate-900 font-semibold">
                  DevUp Society
                </span>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-semibold shadow-lg"
                  asChild
                >
                  <Link to="/org/register">Join as Organization</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-full border-slate-200 hover:bg-slate-50 text-slate-900"
                  asChild
                >
                  <a
                    href="https://www.devupvjit.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit DevUp Society
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-12 text-center border-t border-slate-200 bg-white text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Terminal className="w-4 h-4 text-slate-900" />
          <span className="font-semibold tracking-wide text-slate-900">
            PROBLEM FORGE
          </span>
        </div>
        <p>&copy; 2026 DevThon. All rights reserved.</p>
      </footer>
    </div>
  );
}
