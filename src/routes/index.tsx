import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Zap,
  Users,
  Crown,
  Gift,
  Lock,
  Network,
  FileCheck2,
  Eye,
  Handshake,
  Play,
  MessageCircle,
  Send,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const PLANS = [
  { id: "sprint", name: "Sprint Loop", days: 7, daily: 0.428, totalRoi: 3, freeTurbo: false },
  { id: "accelerate", name: "Accelerate Loop", days: 14, daily: 0.714, totalRoi: 10, freeTurbo: false },
  { id: "power", name: "Power Loop", days: 30, daily: 0.8, totalRoi: 24, freeTurbo: true },
  { id: "ultimate", name: "Ultimate Loop", days: 60, daily: 0.9, totalRoi: 54, freeTurbo: true },
];

const REFERRAL_LEVELS = [
  { level: "1", requirement: "1 active direct + self AUM 100 USDT", commission: "12%" },
  { level: "2", requirement: "2 active direct + self AUM 100 USDT", commission: "8%" },
  { level: "3", requirement: "3 active direct + self AUM 100 USDT", commission: "5%" },
  { level: "4", requirement: "3 active direct + self AUM 100 USDT", commission: "4%" },
  { level: "5", requirement: "3 active direct + self AUM 150 USDT", commission: "3%" },
  { level: "6–8", requirement: "3–5 active direct + self AUM 150–200 USDT", commission: "2%" },
  { level: "9–10", requirement: "5 active direct + self AUM 250 USDT", commission: "1.5%" },
  { level: "11–20", requirement: "7 active direct + self AUM 300–500 USDT", commission: "1%" },
];

const LEADERSHIP_RANKS = [
  { rank: "Turbo Partner", team: "250", deposit: "10,000", reward: "1%" },
  { rank: "Turbo Influencer", team: "500", deposit: "25,000", reward: "2%" },
  { rank: "Turbo Leader", team: "1,000", deposit: "50,000", reward: "3%" },
  { rank: "Turbo Manager", team: "2,500", deposit: "100,000", reward: "4%" },
  { rank: "Turbo Ambassador", team: "5,000", deposit: "200,000", reward: "6%" },
  { rank: "Turbo Champion", team: "7,500", deposit: "500,000", reward: "8%" },
  { rank: "Turbo Legend", team: "10,000", deposit: "1,000,000", reward: "10%" },
];

const ONBOARDING_BONUS = [
  { range: "100 – 199 USDT", bonus: "3 USDT" },
  { range: "200 – 499 USDT", bonus: "5 USDT" },
  { range: "500 – 999 USDT", bonus: "10 USDT" },
  { range: "1,000 – 4,999 USDT", bonus: "20 USDT" },
  { range: "5,000 – 9,999 USDT", bonus: "30 USDT" },
  { range: "10,000 – 24,999 USDT", bonus: "50 USDT" },
  { range: "25,000+ USDT", bonus: "100 USDT" },
];

const TURBO_REWARDS_STEPS = [
  {
    title: "Step 01 – Deposit in Power or Ultimate",
    desc: "Only 30-day and 60-day plans qualify. Minimum qualifying deposit: 100 USDT",
  },
  {
    title: "Step 02 – Receive $Turbo Additional Allocation",
    desc: "The protocol allocates an additional percentage of deposit value in $Turbo based on deposit size – on top of fixed plan yield",
  },
  {
    title: "Step 03 – Split User & Upline",
    desc: "70% of the additional token reward goes to the investor and 30% goes to the referrer / upline",
  },
  {
    title: "Step 04 – Vest Monthly by Rank",
    desc: "First tranche can be claimable immediately, then remaining tokens unlock monthly by rank",
  },
];

const TURBO_ALLOCATION = [
  { range: "100–499 USDT", total: "0.8%", user: "0.56%", upline: "0.24%" },
  { range: "500–999 USDT", total: "1%", user: "0.7%", upline: "0.3%" },
  { range: "1,000–4,999 USDT", total: "1.2%", user: "0.84%", upline: "0.36%" },
  { range: "5,000–9,999 USDT", total: "1.4%", user: "0.98%", upline: "0.42%" },
  { range: "10,000–24,999 USDT", total: "1.5%", user: "1.05%", upline: "0.45%" },
  { range: "25,000+ USDT", total: "1.6%", user: "1.12%", upline: "0.48%" },
];

const VESTING_BY_RANK = [
  { rank: "No Rank", vesting: "10%" },
  { rank: "Partner", vesting: "11%" },
  { rank: "Influencer", vesting: "12%" },
  { rank: "Leader", vesting: "14%" },
  { rank: "Manager", vesting: "15%" },
  { rank: "Ambassador", vesting: "16%" },
  { rank: "Champion", vesting: "18%" },
  { rank: "Legend", vesting: "20%" },
];

const SECURITY_CARDS = [
  {
    I: Lock,
    title: "Decentralized",
    desc: "All processes are governed by unmodifiable smart contracts, providing certainty and full autonomy to users",
  },
  {
    I: Network,
    title: "Blockchain Technology",
    desc: "Built on the trusted BNB Smart Chain network, ensuring every transaction is fast, secure and transparent",
  },
  {
    I: FileCheck2,
    title: "Verified Smart Contract",
    desc: "The contract code has been verified on BSCScan, is open to the public and has been audited by independent parties",
  },
  {
    I: Eye,
    title: "Transparent",
    desc: "All transaction data, profit distribution and referral activity can be tracked directly through the blockchain network",
  },
  {
    I: Handshake,
    title: "Peer-to-Peer (P2P)",
    desc: "All financial interactions run directly between users and smart contracts",
  },
  {
    I: ShieldCheck,
    title: "Non-Custodial Architecture",
    desc: "Funds are dynamically allocated to decentralized liquidity pools and never sit idle in centralized vaults",
  },
];

const AUDITS = [
  {
    title: "HazeCrypto Security Audit",
    desc: "Full smart contract audit by HazeCrypto",
    href: "https://hazecrypto.net/audit/TurboLoop",
  },
  {
    title: "Audit Token Contract by HazeCrypto",
    desc: "Thorough audit of token smart contracts by HazeCrypto",
    href: "https://hazecrypto.net/audit/TurboToken",
  },
  {
    title: "SolidityScan Security Audit",
    desc: "Automated smart contract security scan by SolidityScan",
    href: "https://solidityscan.com/quickscan/0xc90E5785632dAaB9Cb61F5050dA393090541A76D/bscscan/mainnet",
  },
];

const REGISTER_LINK = "https://turboloop.io?ref=Entrepreneur";

const REGISTER_STEPS = [
  "Set up a crypto wallet (such as SafePal) that supports BNB Smart Chain",
  "Fund it with at least 1 USDT + a small amount of BNB for gas fees",
  "Open the DApps browser and paste your TurboLoop link",
  "Connect your wallet to TurboLoop",
  "Select a plan, enter the investment amount and confirm",
  "Daily profits will automatically appear on your dashboard",
  "Share your referral link and earn more income from referral and leadership bonuses",
];

const FAQ_CATEGORIES = [
  {
    category: "General Questions",
    items: [
      {
        q: "What is TurboLoop?",
        a: "TurboLoop is a decentralized liquidity protocol on BNB Smart Chain that automatically deploys deposits into PancakeSwap V3 liquidity pools. It combines fixed-term investment plans, a 20-level referral system and a 7-tier leadership program – everything runs on-chain through smart contracts.",
      },
      {
        q: "Which blockchain does TurboLoop run on?",
        a: "TurboLoop runs on BNB Smart Chain. All processes are executed on-chain.",
      },
      {
        q: "Is TurboLoop custodial?",
        a: "No. TurboLoop is fully non-custodial. Your assets remain under your control at all times.",
      },
      {
        q: "Which wallets are supported?",
        a: "MetaMask, Trust Wallet, SafePal, Binance Wallet and any other BEP-20 compatible wallet.",
      },
      {
        q: "Do I need BNB to interact?",
        a: "Yes. A small amount of BNB is required to cover gas fees on the BNB Smart Chain network.",
      },
    ],
  },
  {
    category: "Staking & Plans",
    items: [
      {
        q: "What plans are available?",
        a: "Four plans are available: Sprint Loop, Accelerate Loop, Power Loop and Ultimate Loop. See the Investment Plan section for full details.",
      },
      {
        q: "What is the minimum deposit?",
        a: "The minimum deposit is 1 USDT.",
      },
      {
        q: "Can I stake multiple times?",
        a: "Yes. You may hold up to 400 active positions per wallet.",
      },
      {
        q: "How is ROI calculated?",
        a: "The fixed Total ROI is calculated continuously by the smart contract. Principal + ROI are locked until maturity, then become available to claim or compound.",
      },
      {
        q: "Do I need to approve USDT first?",
        a: "Yes. You need to approve the contract to spend USDT before your first deposit.",
      },
    ],
  },
  {
    category: "Referral System",
    items: [
      {
        q: "How many referral levels are there?",
        a: "TurboLoop provides a 20-level referral system.",
      },
      {
        q: "What are the qualification rules?",
        a: "Each level requires a specific number of Qualified Directs and an Active Deposit (self AUM). See the referral table for the full breakdown.",
      },
      {
        q: "How do I get my referral link?",
        a: "After registering, you get a unique referral link that you can share with your network.",
      },
      {
        q: "When are referral bonuses paid?",
        a: "Referral bonuses are auto-credited after the smart contract processes downline ROI. You can claim or compound them at any time.",
      },
    ],
  },
  {
    category: "Leadership Program",
    items: [
      {
        q: "How do I qualify for a leadership rank?",
        a: "You must meet both the Total Team Count and Total Team Active Deposit requirements for the target rank.",
      },
      {
        q: "How often can I claim leadership rewards?",
        a: "Rewards become automatically available after the smart contract processes them.",
      },
      {
        q: "Do I keep earning if I drop below the threshold?",
        a: "No. If your team no longer meets the criteria, your rank is automatically reduced.",
      },
    ],
  },
  {
    category: "Withdrawals & Fees",
    items: [
      {
        q: "When can I withdraw my capital?",
        a: "After your plan reaches maturity, principal + ROI are released together.",
      },
      {
        q: "Can I withdraw ROI before the plan ends?",
        a: "No. ROI withdrawals before plan maturity are not permitted.",
      },
      {
        q: "What if a transaction fails?",
        a: "The transaction auto-reverts. Your funds remain safe – only the standard gas fee is spent.",
      },
    ],
  },
];

type CommunityItem = { type: "image" | "youtube"; src: string; alt: string };

const FALLBACK_COMMUNITY: CommunityItem[] = [
  { type: "image", src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1200&q=80", alt: "Community meetup" },
  { type: "image", src: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?auto=format&fit=crop&w=1200&q=80", alt: "Community event" },
  { type: "image", src: "https://images.unsplash.com/photo-1591115765373-5207764f72e5?auto=format&fit=crop&w=1200&q=80", alt: "Community workshop" },
  { type: "image", src: "https://images.unsplash.com/photo-1591115765373-5207764f72e6?auto=format&fit=crop&w=1200&q=80", alt: "Community gathering" },
  { type: "image", src: "https://images.unsplash.com/photo-1591115765373-5207764f72e8?auto=format&fit=crop&w=1200&q=80", alt: "Community leaders" },
];

function YouTube({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl glass border-primary/20">
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play ${title}`}
          className="absolute inset-0 h-full w-full group"
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 grid place-items-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <span className="h-16 w-16 rounded-full gradient-primary grid place-items-center shadow-lg">
              <Play className="h-7 w-7 text-primary-foreground fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function FAQCategorySection({ cat }: { cat: (typeof FAQ_CATEGORIES)[0] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-primary mb-3">{cat.category}</h3>
      <Card className="glass border-primary/15 px-6">
        <Accordion type="single" collapsible className="w-full">
          {cat.items.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`${cat.category}-${idx}`}
              className="border-primary/10"
            >
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}

function HomePage() {
  const [amount, setAmount] = useState<string>("1000");
  const [planId, setPlanId] = useState<string>(PLANS[3].id);
  const [seeAllMedia, setSeeAllMedia] = useState(false);
  const [copied, setCopied] = useState(false);
  const [media, setMedia] = useState<CommunityItem[]>(FALLBACK_COMMUNITY);
  const [podcastApi, setPodcastApi] = useState<CarouselApi>();
  const [podcastIndex, setPodcastIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("community_media")
      .select("type, url, alt")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled || !data || data.length === 0) return;
        setMedia(
          data.map((r) => ({
            type: r.type as "image" | "youtube",
            src: r.url,
            alt: r.alt ?? "",
          })),
        );
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!podcastApi) return;
    const onSelect = (api: CarouselApi) => {
      if (api) setPodcastIndex(api.selectedScrollSnap());
    };
    onSelect(podcastApi);
    podcastApi.on("select", onSelect);
    return () => { podcastApi.off("select", onSelect); };
  }, [podcastApi]);

  const selectedPlan = useMemo(
    () => PLANS.find((p) => p.id === planId) ?? PLANS[0],
    [planId],
  );
  const totalProfit = useMemo(() => {
    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0) return 0;
    return (a * selectedPlan.totalRoi) / 100;
  }, [amount, selectedPlan]);

  const totalReturn = useMemo(() => {
    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0) return 0;
    return a + totalProfit;
  }, [amount, totalProfit]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(REGISTER_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  const visibleMedia = seeAllMedia ? media : media.slice(0, 5);

  return (
    <PageShell>
      {/* ================= HERO / EXPLANATION ================= */}
      <section id="top" className="relative overflow-hidden border-b border-primary/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Launching 11 March 2026
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[0.97] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-7xl">
              Earn on <span className="text-gradient">TurboLoop</span>
              <br />
              with Choexo
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
              A decentralized liquidity aggregation protocol powered by PancakeSwap V3 on BNB Smart Chain.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="#register">
                <Button size="lg" className="gradient-primary px-7 font-semibold text-primary-foreground shadow-[0_14px_44px_-14px_rgb(0_229_255_/_0.75)] transition-transform hover:-translate-y-0.5 active:translate-y-0">
                  Register now
                </Button>
              </a>
              <a href="#security" className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">
                Explore the protocol
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-3xl lg:-mr-10 lg:justify-self-end">
            <div className="absolute inset-[15%] rounded-full bg-primary/25 blur-3xl" />
            <img
              src="/turbo-loop-network-v2.png"
              alt="TurboLoop ecosystem connecting Turbo Buy, Turbo Swap, Yield Farming, Referral Network, Leadership Program, and Smart Contract Security"
              className="relative h-auto w-full scale-[1.08] drop-shadow-[0_0_34px_rgb(0_229_255_/_0.42)]"
            />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-primary/10 bg-card/40 py-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 text-sm font-semibold">
              {PLANS.map((p) => (
                <span key={p.id} className="flex items-center gap-2 text-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  {p.name} <span className="text-primary">• {p.days} Days • {p.totalRoi}% ROI</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHAT IS TURBOLOOP ================= */}
      <section id="what" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            What is <span className="text-gradient">TurboLoop</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            TurboLoop is a next-generation decentralized liquidity aggregation
            protocol that synergizes automated PancakeSwap V3 market-making with
            a sophisticated, multi-tiered network compensation architecture. By
            dynamically deploying USDT into active decentralized exchange
            liquidity pools, TurboLoop generates sustainable, market-driven
            yields, which are then algorithmically distributed through a highly
            structured, rank-based affiliate matrix.
          </p>
        </div>
        <div className="mt-10 max-w-4xl mx-auto">
          <YouTube id="e7Hyq6rr_F8" title="What is TurboLoop" />
        </div>
      </section>

      {/* ================= EXCLUSIVE PODCAST ================= */}
      <section id="podcast" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Exclusive Podcast with <span className="text-gradient">David (CEO & Global Ambassador)</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A 20-Minute Breakdown Covering Security Audits, Smart Contract Architecture and How Your USDT Earns a Fixed Return on the BNB Smart Chain
          </p>
        </div>
        <div className="mt-10 max-w-4xl mx-auto">
          <Carousel setApi={setPodcastApi} opts={{ loop: false }}>
            <CarouselContent>
              <CarouselItem>
                <YouTube id="8iD2dP-9wvc" title="Exclusive Podcast with David" />
              </CarouselItem>
              <CarouselItem>
                <YouTube id="naSg5kP1bsY" title="Exclusive Podcast with David - Part 2" />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => podcastApi?.scrollTo(0)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                podcastIndex === 0
                  ? "gradient-primary text-primary-foreground shadow-lg"
                  : "border border-primary/40 text-primary hover:bg-primary/10"
              }`}
            >
              Part 1
            </button>
            <button
              type="button"
              onClick={() => podcastApi?.scrollTo(1)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                podcastIndex === 1
                  ? "gradient-primary text-primary-foreground shadow-lg"
                  : "border border-primary/40 text-primary hover:bg-primary/10"
              }`}
            >
              Part 2
            </button>
          </div>
        </div>
      </section>

      {/* ================= INVESTMENT PLAN ================= */}
      <section id="plans" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Investment <span className="text-gradient">Plan</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Choose a Plan that Fits Your Investment Goals and Strategy
          </p>
        </div>


        <div className="mt-10 overflow-x-auto no-scrollbar" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', display: 'block' }}>
          <div className="glass rounded-2xl overflow-hidden" style={{ minWidth: '720px', width: '100%' }}>
            <table className="w-full text-sm">
              <thead className="bg-primary/5 text-foreground">
                <tr>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Plan</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Duration</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Daily Estimate</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Total ROI</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Free Turbo Tokens</th>
                </tr>
              </thead>
              <tbody>
                {PLANS.map((p) => (
                  <tr key={p.id} className="border-t border-primary/10">
                    <td className="px-6 py-4 font-semibold text-primary whitespace-nowrap">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.days} Days</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.daily}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.totalRoi}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={p.freeTurbo ? "font-semibold text-emerald-400" : "font-semibold text-red-400"}>
                        {p.freeTurbo ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= PROFIT CALCULATOR ================= */}
      <section id="calculator" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Calculate Your <span className="text-gradient">Potential Return</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Enter Your Deposit Amount, Select a Loop Plan and Preview Your
            Estimated Total Return Before Depositing
          </p>
        </div>

        <Card className="glass mt-10 max-w-3xl mx-auto p-5 sm:p-8 border-primary/20">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="calc-amount" className="mb-2 block">
                Investment Amount (USDT)
              </Label>
              <Input
                id="calc-amount"
                type="number"
                min="0"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1000"
              />
            </div>
            <div>
              <Label htmlFor="calc-plan" className="mb-2 block">
                Investment Plan
              </Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger id="calc-plan">
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  {PLANS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} – {p.days} Days ({p.totalRoi}% ROI)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-xl p-5 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Total Profit
              </p>
              <p className="mt-2 text-2xl font-bold text-primary">
                {totalProfit.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT
              </p>
            </div>
            <div className="glass rounded-xl p-5 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Total Return
              </p>
              <p className="mt-2 text-2xl font-bold text-gradient">
                {totalReturn.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* ================= REFERRAL SYSTEM ================= */}
      <section id="referral" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Build Your Network Across <span className="text-gradient">20 Referral Levels</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Invite Users, Grow Your Active Network and Unlock Commission Levels
            Based on Your Own Active Deposit and Active Direct Referrals
          </p>
        </div>

        <div className="mt-10 overflow-x-auto no-scrollbar" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', display: 'block' }}>
          <div className="glass rounded-2xl overflow-hidden" style={{ minWidth: '720px', width: '100%' }}>
            <table className="w-full text-sm">
              <thead className="bg-primary/5 text-foreground">
                <tr>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Level</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Requirement</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Commission</th>
                </tr>
              </thead>
              <tbody>
                {REFERRAL_LEVELS.map((row) => (
                  <tr key={row.level} className="border-t border-primary/10">
                    <td className="px-6 py-4 font-semibold text-primary whitespace-nowrap">{row.level}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{row.requirement}</td>
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">{row.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          Note: 20-level referral bonus is calculated from a fraction of your
          downline's daily ROI, not from their deposit amount
        </p>
      </section>

      {/* ================= LEADERSHIP SYSTEM ================= */}
      <section id="leadership" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Earn <span className="text-gradient">Leadership Ranks</span> as Your Team Grows
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each Rank Unlocks Different Reward Percentages and Additional Status
            Within the Platform
          </p>
        </div>

        <div className="mt-10 overflow-x-auto no-scrollbar" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', display: 'block' }}>
          <div className="glass rounded-2xl overflow-hidden" style={{ minWidth: '720px', width: '100%' }}>
            <table className="w-full text-sm">
              <thead className="bg-primary/5 text-foreground">
                <tr>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Rank</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Team Size</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Team Deposit</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Reward</th>
                </tr>
              </thead>
              <tbody>
                {LEADERSHIP_RANKS.map((row) => (
                  <tr key={row.rank} className="border-t border-primary/10">
                    <td className="px-6 py-4 font-semibold text-primary flex items-center gap-2 whitespace-nowrap">
                      <Crown className="h-4 w-4" />
                      {row.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.team} Users</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.deposit} USDT</td>
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">{row.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          Note: Leadership bonus is calculated the same way as the referral bonus
        </p>
      </section>

      {/* ================= ONBOARDING BONUS ================= */}
      <section id="onboarding" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Unlock Instant <span className="text-gradient">Onboarding Bonuses</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Earn an Onboarding Bonus When Your Referrals Make an Initial
            Placement into a 30-Day or 60-Day Liquidity Plan
          </p>
        </div>

        <div className="mt-10 overflow-x-auto no-scrollbar" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', display: 'block' }}>
          <div className="max-w-2xl mx-auto glass rounded-2xl overflow-hidden" style={{ minWidth: '520px', width: '100%' }}>
            <table className="w-full text-sm">
              <thead className="bg-primary/5 text-foreground">
                <tr>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Deposit Range</th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">Bonus</th>
                </tr>
              </thead>
              <tbody>
                {ONBOARDING_BONUS.map((row) => (
                  <tr key={row.range} className="border-t border-primary/10">
                    <td className="px-6 py-4 whitespace-nowrap">{row.range}</td>
                    <td className="px-6 py-4 font-semibold text-primary whitespace-nowrap">{row.bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= $TURBO REWARDS ================= */}
      <section id="turbo-rewards" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Earn Additional <span className="text-gradient">$Turbo Rewards</span> Automatically
          </h2>
          <p className="mt-3 text-muted-foreground">
            Power and Ultimate Package Users can Receive Additional $Turbo Rewards
            on Top of Their Fixed Package Returns
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TURBO_REWARDS_STEPS.map((step, i) => (
            <Card key={i} className="glass p-5 border-primary/15 flex flex-col gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full gradient-primary grid place-items-center text-primary-foreground font-bold">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-14 space-y-14">
          <div>
            <h3 className="text-xl font-semibold text-center mb-6">
              Additional Reward Allocation by Deposit Size
            </h3>
            <div className="mt-10 overflow-x-auto no-scrollbar" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', display: 'block' }}>
              <div className="glass rounded-2xl overflow-hidden" style={{ minWidth: '720px', width: '100%' }}>
                <table className="w-full text-sm">
                  <thead className="bg-primary/5 text-foreground">
                    <tr>
                      <th className="px-6 py-4 text-left whitespace-nowrap">Deposit Range</th>
                      <th className="px-6 py-4 text-left whitespace-nowrap">Total</th>
                      <th className="px-6 py-4 text-left whitespace-nowrap">User</th>
                      <th className="px-6 py-4 text-left whitespace-nowrap">Upline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TURBO_ALLOCATION.map((row) => (
                      <tr key={row.range} className="border-t border-primary/10">
                        <td className="px-6 py-4 whitespace-nowrap">{row.range}</td>
                        <td className="px-6 py-4 font-semibold text-primary whitespace-nowrap">
                          {row.total}
                        </td>
                        <td className="px-6 py-4 font-semibold whitespace-nowrap">{row.user}</td>
                        <td className="px-6 py-4 font-semibold whitespace-nowrap">{row.upline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-center mb-6">
              Monthly Vesting by Rank
            </h3>
            <div className="mt-10 overflow-x-auto no-scrollbar" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', display: 'block' }}>
              <div className="max-w-2xl mx-auto glass rounded-2xl overflow-hidden" style={{ minWidth: '520px', width: '100%' }}>
                <table className="w-full text-sm">
                  <thead className="bg-primary/5 text-foreground">
                    <tr>
                      <th className="px-6 py-4 text-left whitespace-nowrap">Rank</th>
                      <th className="px-6 py-4 text-left whitespace-nowrap">Monthly Vesting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VESTING_BY_RANK.map((row) => (
                      <tr key={row.rank} className="border-t border-primary/10">
                        <td className="px-6 py-4 font-semibold text-primary whitespace-nowrap">
                          {row.rank}
                        </td>
                        <td className="px-6 py-4 font-semibold whitespace-nowrap">{row.vesting}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECURITY SYSTEM ================= */}
      <section id="security" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Security <span className="text-gradient">System</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Designed for Verification and Not Blind Trust
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SECURITY_CARDS.map(({ I, title, desc }) => (
            <Card
              key={title}
              className="glass p-6 border-primary/15 hover:border-primary/40 transition-all hover:-translate-y-1"
            >
              <div className="h-11 w-11 rounded-lg gradient-primary grid place-items-center text-primary-foreground">
                <I className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://bscscan.com/address/0xc90E5785632dAaB9Cb61F5050dA393090541A76D#code"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" className="gradient-primary text-primary-foreground font-semibold">
              <ShieldCheck className="mr-2 h-4 w-4" />
              View Main Contract
            </Button>
          </a>
          <a
            href="https://bscscan.com/token/0x64920E7f4f270f302e8b728f69B5a9Fc24Fda2D3#code"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" variant="outline" className="border-primary/50 font-semibold">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Token Contract
            </Button>
          </a>
        </div>

        <div className="mt-14">
          <h3 className="text-xl font-semibold text-center">Independent Audits</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {AUDITS.map((a) => (
              <Card
                key={a.title}
                className="glass p-6 border-primary/15 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">{a.title}</h4>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
                </div>
                <a href={a.href} target="_blank" rel="noreferrer" className="mt-5">
                  <Button variant="outline" className="w-full border-primary/40">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Report
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW TO REGISTER ================= */}
      <section id="register" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            How to <span className="text-gradient">Register</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Get Started in Just 7 Easy Steps</p>
        </div>

        <div className="mt-10 space-y-10">
          <div className="w-full max-w-4xl mx-auto">
            <YouTube id="qWhSoOSoXmU" title="How to Register on TurboLoop" />
          </div>



          <ol className="space-y-4">
            {REGISTER_STEPS.map((step, i) => {
              const isCopyStep = i === 2;
              return (
                <li key={i}>
                  <Card className="glass p-4 sm:p-5 border-primary/15 flex gap-3 sm:gap-4">
                    <div className="h-9 w-9 shrink-0 rounded-full gradient-primary grid place-items-center text-primary-foreground font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm break-words">{step}</p>
                      {isCopyStep && (
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg bg-background/60 border border-primary/20 px-3 py-2">
                          <code className="text-xs text-primary truncate min-w-0 flex-1 block">
                            {REGISTER_LINK}
                          </code>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-primary/40"
                            onClick={copyLink}
                          >
                            {copied ? (
                              <>
                                <Check className="mr-1 h-3.5 w-3.5" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="mr-1 h-3.5 w-3.5" /> Copy
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>

      </section>

      {/* ================= COMMUNITY EVENT ================= */}
      <section id="community-event" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Community <span className="text-gradient">Event</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Empowering Members Through Collaboration and Innovation
          </p>
        </div>

        <div className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleMedia.map((m, i) => {
            const imgSrc = m.type === "youtube" ? `https://i.ytimg.com/vi/${m.src}/hqdefault.jpg` : m.src;
            const inner = (
              <>
                <img
                  src={imgSrc}
                  alt={m.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                {m.type === "youtube" && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="h-12 w-12 rounded-full gradient-primary grid place-items-center shadow-lg">
                      <Play className="h-5 w-5 text-primary-foreground fill-current" />
                    </span>
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-primary/20 bg-background/80 px-3 py-2 text-xs font-semibold leading-4 text-foreground/95 backdrop-blur-md">
                  {m.alt}
                </div>
              </>
            );
            const className = `relative overflow-hidden rounded-xl glass border-primary/15 aspect-square ${
              i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : ""
            }`;
            return m.type === "youtube" ? (
              <a
                key={i}
                href={`https://www.youtube.com/watch?v=${m.src}`}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            ) : (
              <div key={i} className={className}>{inner}</div>
            );
          })}
        </div>

        {media.length > 5 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="border-primary/40"
              onClick={() => setSeeAllMedia((v) => !v)}
            >
              {seeAllMedia ? "Show Less" : "See More"}
            </Button>
          </div>
        )}
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know before joining TurboLoop
          </p>
        </div>

        <div className="mt-10 max-w-3xl mx-auto space-y-8">
          {FAQ_CATEGORIES.map((cat) => (
            <FAQCategorySection key={cat.category} cat={cat} />
          ))}
        </div>
      </section>

      {/* ================= COMMUNITY & SUPPORT ================= */}
      <section id="community" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Community and <span className="text-gradient">Support</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Stay Connected with Our Community and Access the Support You Need
            Every Step of the Way
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3 max-w-4xl mx-auto">
          {[
            {
              I: MessageCircle,
              title: "WhatsApp Group",
              desc: "Join our WhatsApp community for daily updates and quick support",
              href: "https://chat.whatsapp.com/Ib3Dn58I2624DUBqxDLK0v",
              cta: "Join WhatsApp",
            },
            {
              I: Send,
              title: "Telegram Group",
              desc: "Connect with the global TurboAlliance Telegram community",
              href: "https://t.me/TurboAlliance",
              cta: "Join Telegram",
            },
            {
              I: Users,
              title: "Leader",
              desc: "Talk directly with a TurboLoop leader for personal guidance",
              href: "https://t.me/+9647502606799",
              cta: "Contact Leader",
            },
          ].map(({ I, title, desc, href, cta }) => (
            <Card
              key={title}
              className="glass p-6 border-primary/15 hover:border-primary/40 transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className="h-11 w-11 rounded-lg gradient-primary grid place-items-center text-primary-foreground">
                <I className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{desc}</p>
              <a href={href} target="_blank" rel="noreferrer" className="mt-5">
                <Button className="w-full gradient-primary text-primary-foreground font-semibold">
                  {cta}
                </Button>
              </a>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
