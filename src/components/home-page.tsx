
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flower2, Calendar, Sparkles, Bot, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "./auth-provider";

const features = [
    {
        icon: <Flower2 className="h-10 w-10 text-primary" />,
        title: "Log Your Mood",
        description: "Quickly capture how you feel each day with a simple, intuitive interface.",
    },
    {
        icon: <Calendar className="h-10 w-10 text-primary" />,
        title: "Visualize Your Journey",
        description: "See your moods on a color-coded calendar to easily spot patterns.",
    },
    {
        icon: <Sparkles className="h-10 w-10 text-primary" />,
        title: "Uncover Your Patterns",
        description: "Gently discover connections and insights into your emotional well-being over time.",
    },
    {
        icon: <Bot className="h-10 w-10 text-primary" />,
        title: "Get Smart Insights",
        description: "Our AI helps you find relevant tags to better understand what influences your mood.",
    },
];

export function HomePage() {
  const { user, loading } = useAuth();

  const buttonText = user ? "Go to Your Dashboard" : "Get Started for Free";
  const buttonLink = user ? "/log-mood" : "/signup";

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-800">
          Welcome to <span className="text-primary">Mood Bloom</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal space to understand your feelings, notice patterns, and nurture your well-being. Start your journey of self-discovery, one mood at a time.
        </p>
        <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
          {loading ? (
             <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
             </>
          ) : (
            <Link href={buttonLink}>{buttonText}</Link>
          )}
        </Button>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
