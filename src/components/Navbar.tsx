import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "/pricing", isRoute: true },
  { label: "About", href: "/about", isRoute: true },
  { label: "FAQ", href: "/faq", isRoute: true },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (link: typeof navLinks[0]) => {
    setMobileOpen(false);
    if ((link as any).isRoute) {
      window.location.href = link.href;
    } else {
      const el = document.querySelector(link.href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? "pt-2" : "pt-4"}`}>
      <nav
        className="transition-all duration-300 w-[calc(100%-2rem)] max-w-6xl"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1)",
          padding: scrolled ? "0.5rem 1.5rem" : "0.75rem 1.5rem",
        }}
      >
        <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-xl md:text-2xl font-bold text-gradient-neon">
          Esther
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link)}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => (window.location.href = "/booking")}
            className="bg-primary text-primary-foreground font-bold hover:shadow-[0_0_20px_hsl(187_100%_50%/0.3)] hover:scale-105 transition-all duration-300"
          >
            Book a Call
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          {isMobile && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-foreground p-1"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobile && mobileOpen && (
        <div
          className="px-4 pb-4 pt-2 flex flex-col gap-3"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => navigate(link)}
              className="text-sm font-medium text-foreground/80 hover:text-primary text-left py-2 border-b border-white/10 last:border-0 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
      </nav>
    </div>
  );
};

export default Navbar;
