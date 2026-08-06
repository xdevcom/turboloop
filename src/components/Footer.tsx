import { Logo } from "@/components/Logo";
import { Send, MessageCircle, Users } from "lucide-react";

const LINKS = [
  ["Investment Plans", "#plans"],
  ["Calculator", "#calculator"],
  ["Referral", "#referral"],
  ["FAQ", "#faq"],
] as const;

const COMMUNITY = [
  { I: MessageCircle, href: "https://chat.whatsapp.com/Ib3Dn58I2624DUBqxDLK0v", label: "WhatsApp" },
  { I: Send, href: "https://t.me/TurboAlliance", label: "Telegram" },
  { I: Users, href: "https://t.me/+9647502606799", label: "Leader community" },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-primary/10 bg-background/40 backdrop-blur-md">
      <div className="container mx-auto grid gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-3 sm:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Decentralized liquidity aggregation protocol powered by PancakeSwap V3 on BNB Smart
            Chain.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-primary">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Community</h4>
          <div className="flex gap-2">
            {COMMUNITY.map(({ I, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-md border border-primary/15 bg-card/50 text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary/10 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TurboLoop
      </div>
    </footer>
  );
}
