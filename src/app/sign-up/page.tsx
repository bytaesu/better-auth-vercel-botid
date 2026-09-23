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
import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <h1>Create an account</h1>
          </CardTitle>
          <CardDescription>
            Better Auth handles registration while BotID checks the request in
            the background.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="gap-1">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link href="/sign-in" className={buttonVariants({ variant: "link" })}>
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
