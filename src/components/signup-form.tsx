"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signUpWithEmail } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useAuth } from "./auth-provider";

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
    const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  if (user) {
    router.push('/log-mood');
    return null;
  }

  const onSubmit = (data: SignupFormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signUpWithEmail(data.email, data.password);
      if (result.error) {
        setError(result.error);
      } else {
        toast({
            title: "Account Created",
            description: "Welcome to Mood Bloom!",
        });
        router.push("/log-mood");
      }
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Sign up to start tracking your mood.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
             <Alert variant="destructive">
                <AlertTitle>Sign-up Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
           <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline hover:text-primary">
                    Login
                </Link>
            </p>
        </CardFooter>
      </form>
    </Card>
  );
}
