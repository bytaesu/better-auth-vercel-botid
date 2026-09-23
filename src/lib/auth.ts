import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
// import { captcha } from "better-auth/plugins";
// import { checkBotId } from "botid/server";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["https://*-taesu.vercel.app", "https://better-auth-vercel-botid.vercel.app"],
  plugins: [
    // captcha({
    //   provider: "vercel-botid",
    //   endpoints: ["/sign-up/email", "/sign-in/email"],
    //   checkBotId,
    // }),
    nextCookies()
  ],
});
