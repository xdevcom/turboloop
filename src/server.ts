import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry")
      .then((module) => (module.default ?? module) as ServerEntry)
      .catch((error) => {
        serverEntryPromise = undefined;
        throw error;
      });
  }
  return serverEntryPromise;
}

function attachRuntimeEnvironment(env: unknown) {
  if (!env || typeof env !== "object") return;

  for (const key of ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SERVICE_ROLE_KEY"]) {
    const value = (env as Record<string, unknown>)[key];
    if (typeof value === "string" && !process.env[key]) process.env[key] = value;
  }
}

function errorResponse(headers?: HeadersInit) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("content-type", "text/html; charset=utf-8");
  responseHeaders.set("cache-control", "no-store");
  responseHeaders.delete("content-length");
  responseHeaders.delete("content-encoding");

  return new Response(renderErrorPage(), { status: 500, headers: responseHeaders });
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(new Error(`h3 swallowed SSR error: ${body}`));
  return errorResponse(response.headers);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      attachRuntimeEnvironment(env);
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return errorResponse();
    }
  },
};
