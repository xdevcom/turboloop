import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const NAV = [
  { hash: "#what", label: "About" },
  { hash: "#plans", label: "Plans" },
  { hash: "#calculator", label: "Calculator" },
  { hash: "#referral", label: "Referral" },
  { hash: "#leadership", label: "Leadership" },
  { hash: "#turbo-rewards", label: "$Turbo Rewards" },
  { hash: "#security", label: "Security" },
  { hash: "#faq", label: "FAQ" },
] as const;

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const isHome = path === "/";
  const linkFor = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <a
              key={n.hash}
              href={linkFor(n.hash)}
              className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden gradient-primary text-primary-foreground font-semibold sm:inline-flex"
          >
            <a href={linkFor("#register")}>Register Now</a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-primary/20 w-72">
              <SheetTitle className="text-left">
                <Logo />
              </SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                {NAV.map((n) => (
                  <a
                    key={n.hash}
                    href={linkFor(n.hash)}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-primary/10"
                  >
                    {n.label}
                  </a>
                ))}
                <Button
                  asChild
                  className="mt-4 w-full gradient-primary text-primary-foreground font-semibold"
                >
                  <a href={linkFor("#register")} onClick={() => setOpen(false)}>
                    Register Now
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
