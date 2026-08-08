import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TurboLoop | BNB Smart Chain Ecosystem" },
      {
        name: "description",
        content: "Explore TurboLoop's BNB Smart Chain ecosystem: Turbo Buy, Swap, Yield Farming, Referral Network, Leadership, and Smart Contract Security.",
      },
      { name: "author", content: "TurboLoop" },
      { property: "og:site_name", content: "TurboLoop" },
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: "TurboLoop | BNB Smart Chain Ecosystem" },
      {
        property: "og:description",
        content: "Explore TurboLoop's BNB Smart Chain ecosystem: Turbo Buy, Swap, Yield Farming, Referral Network, Leadership, and Smart Contract Security.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://turboport-redesigned.vercel.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "TurboLoop | BNB Smart Chain Ecosystem" },
      {
        name: "twitter:description",
        content: "Explore TurboLoop's BNB Smart Chain ecosystem: Turbo Buy, Swap, Yield Farming, Referral Network, Leadership, and Smart Contract Security.",
      },
      { name: "twitter:domain", content: "turboport-redesigned.vercel.app" },

      {
        property: "og:image",
        content: "https://turboport-redesigned.vercel.app/og-turboport.png?v=20260808",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      {
        property: "og:image:alt",
        content: "TurboLoop ecosystem on BNB Smart Chain",
      },
      {
        name: "twitter:image",
        content: "https://turboport-redesigned.vercel.app/og-turboport.png?v=20260808",
      },
      {
        name: "twitter:image:alt",
        content: "TurboLoop ecosystem on BNB Smart Chain",
      },
    ],
    links: [
      { rel: "canonical", href: "https://turboport-redesigned.vercel.app/" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192.png" },
      { rel: "icon", type: "image/png", sizes: "256x256", href: "/favicon-256.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { name: "theme-color", content: "#000000" },
      { name: "msapplication-TileColor", content: "#000000" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors theme="dark" />
    </>
  );
}
