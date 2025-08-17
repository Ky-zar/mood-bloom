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
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { updateUserProfile } from "@/lib/auth";

const welcomeSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(20, { message: "Username cannot be longer than 20 characters." }),
});

type WelcomeFormData = z.infer<typeof welcomeSchema>;

export function WelcomeForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeSchema),
  });
  
  const onSubmit = (data: WelcomeFormData) => {
    setError(null);
    startTransition(async () => {
      const result = await updateUserProfile({ displayName: data.username });
      if (result.error) {
        setError(result.error);
      } else {
        toast({
            title: "Welcome!",
            description: "Your username has been set.",
        });
        router.push("/log-mood");
      }
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome to Mood Bloom</CardTitle>
        <CardDescription>
          Please choose a username to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
            <AlertTitle>Update Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              {...register("username")}
              disabled={isPending}
            />
            {errors.username && (
              <p className="text-sm font-medium text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>
           <Button type="submit" className="w-full" disabled={isPending}>
             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
