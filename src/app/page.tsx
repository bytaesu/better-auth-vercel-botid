import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Wrap the Next.js config",
    description:
      "withBotId adds the rewrites BotID needs so its client challenge is served from your own domain.",
    file: {
      title: "next.config.ts",
      code: `import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withBotId(nextConfig);`,
    },
  },
  {
    title: "Choose the routes to protect",
    description:
      "initBotId challenges the requests you list. This demo lists email sign-up and sign-in, and you can add any other route you want to protect.",
    file: {
      title: "instrumentation-client.ts",
      code: `import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    { path: "/api/auth/sign-up/email", method: "POST" },
    { path: "/api/auth/sign-in/email", method: "POST" },
  ],
});`,
    },
  },
  {
    title: "Verify on the server with Better Auth",
    description:
      "List the same paths in endpoints. Wildcards like /sign-in/* also work. The captcha plugin runs checkBotId before the handler, so a bot gets a 403 before any user is created or looked up.",
    file: {
      title: "auth.ts",
      code: `import { betterAuth } from "better-auth";
import { captcha } from "better-auth/plugins";
import { checkBotId } from "botid/server";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  plugins: [
    captcha({
      provider: "vercel-botid",
      endpoints: ["/sign-up/email", "/sign-in/email"],
      checkBotId,
    }),
  ],
});`,
    },
  },
];

const tryItFile = {
  title: "Terminal",
  language: "bash",
  code: `curl -X POST https://better-auth-vercel-botid.vercel.app/api/auth/sign-up/email \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Testing-1",
    "email": "testing-1@placeholder.invalid",
    "password": "password1234"
  }'`,
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
      <header className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-5xl">
          Better Auth × Vercel BotID
        </h1>
        <p className="text-muted-foreground text-pretty">
          Vercel BotID is an invisible CAPTCHA that protects against
          sophisticated bots without showing visible challenges or requiring
          user action.
        </p>
        <div className="flex gap-2">
          <Link href="/sign-up" className={buttonVariants()}>
            Try sign up
          </Link>
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "outline" })}
          >
            Sign in
          </Link>
        </div>
      </header>

      <ol className="mt-24 flex flex-col gap-20 sm:mt-32 md:gap-28">
        {steps.map((step, index) => {
          const reversed = index % 2 === 1;
          return (
            <li
              key={step.file.title}
              className={cn(
                "flex flex-col gap-8 md:items-center md:gap-14",
                reversed ? "md:flex-row-reverse" : "md:flex-row",
              )}
            >
              <div className="flex flex-col gap-3 md:w-2/5">
                <span className="font-mono text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-semibold tracking-tight">
                  {step.title}
                </h2>
                <p className="text-muted-foreground text-pretty">
                  {step.description}
                </p>
              </div>
              <div
                className={cn(
                  "min-w-0 transition-transform duration-300 ease-out hover:rotate-0 md:w-3/5 motion-reduce:transition-none",
                  reversed ? "md:rotate-2" : "md:-rotate-2",
                )}
              >
                <CodeBlock files={[step.file]} className="shadow-lg" />
              </div>
            </li>
          );
        })}
      </ol>

      <section className="mx-auto mt-28 flex max-w-2xl flex-col gap-6 md:mt-36">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Now try it out
          </h2>
          <figure className="flex flex-col gap-2">
            <blockquote className="text-muted-foreground text-pretty italic">
              “BotID actively runs JavaScript on page sessions and sends headers
              to the server. If you test with curl or visit a protected route
              directly, BotID will block you in production.”
            </blockquote>
            <figcaption className="text-xs text-muted-foreground">
              <a
                href="https://vercel.com/docs/botid/get-started"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Vercel BotID docs
              </a>
            </figcaption>
          </figure>
        </div>
        <div className="flex flex-col items-center gap-3">
          <CodeBlock files={[tryItFile]} className="w-full shadow-lg" />
          <ArrowDown aria-hidden className="size-4 text-muted-foreground" />
          <pre className="max-w-full overflow-x-auto rounded-lg border bg-card px-4 py-3 font-mono text-[0.8125rem]">
            <span className="text-destructive">403</span>{" "}
            {`{"code":"VERIFICATION_FAILED","message":"Captcha verification failed"}`}
          </pre>
        </div>
      </section>
    </main>
  );
}
