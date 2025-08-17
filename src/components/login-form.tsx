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
import { signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useAuth } from "./auth-provider";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  if (user) {
    router.push('/log-mood');
    return null;
  }

  const onSubmit = (data: LoginFormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signInWithEmail(data.email, data.password);
      if (result.error) {
        setError(result.error);
      } else {
        toast({
            title: "Logged In",
            description: "Welcome back!",
        });
        if (result.isNewUser) {
            router.push("/welcome");
        } else {
            router.push("/log-mood");
        }
      }
    });
  };

  const onGoogleSignIn = () => {
    setError(null);
    startGoogleTransition(async () => {
        const result = await signInWithGoogle();
        if (result.error) {
            setError(result.error);
        } else {
            toast({
                title: "Logged In",
                description: "Welcome!",
            });
            if (result.isNewUser) {
                router.push("/welcome");
            } else {
                router.push("/log-mood");
            }
        }
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
         <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isGooglePending || isPending}>
            {isGooglePending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 56.4l-64.4 64.4C320.5 95.6 286.7 80 248 80c-82.6 0-150.2 67.6-150.2 150.2S165.4 406.2 248 406.2c44.3 0 83.4-18.9 111.9-49.4l62.4 62.4C387.2 462.2 323.2 504 248 504z"></path></svg>
            )}
            Sign in with Google
        </Button>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              disabled={isPending || isGooglePending}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} disabled={isPending || isGooglePending}/>
            {errors.password && (
              <p className="text-sm font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
           <Button type="submit" className="w-full" disabled={isPending || isGooglePending}>
             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="underline hover:text-primary">
                Sign up
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
