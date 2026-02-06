import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PublicNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/problems", label: "Problem Statements" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight">
              DevThon
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground -mt-1 font-medium">
              by DevUp Society
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-secondary/50 rounded-full border border-border/50">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                location.pathname === link.href
                  ? "text-primary bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            size="sm"
            asChild
            className="rounded-full px-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
          >
            <Link to="/org/register">
              <Sparkles className="w-4 h-4 mr-2" />
              Submit Problem
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="ml-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="mb-8 text-left">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold">DevThon</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6">
              <nav className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground/80"
                    }`}
                  >
                    {link.label}
                    {location.pathname === link.href && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="h-px bg-border" />

              <div className="flex flex-col gap-3">
                <Button asChild className="w-full justify-start">
                  <Link to="/org/register" onClick={() => setIsOpen(false)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Submit Problem Statement
                  </Link>
                </Button>
              </div>

              <div className="mt-auto pt-8">
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-sm font-medium mb-1">DevUp Society</p>
                  <p className="text-xs text-muted-foreground">
                    Empowering student developers to build the future.
                  </p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
