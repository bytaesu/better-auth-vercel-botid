import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <h1>Sign in</h1>
          </CardTitle>
          <CardDescription>
            Better Auth handles sign-in while BotID checks the request in the
            background.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="gap-1">
          <span className="text-muted-foreground">New here?</span>
          <Link href="/sign-up" className={buttonVariants({ variant: "link" })}>
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
