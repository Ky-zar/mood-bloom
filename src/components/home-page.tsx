"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flower2, BarChart, Calendar, Bot } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

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
        icon: <BarChart className="h-10 w-10 text-primary" />,
        title: "Discover Trends",
        description: "Understand your emotional landscape with insightful weekly and monthly charts.",
    },
    {
        icon: <Bot className="h-10 w-10 text-primary" />,
        title: "Get Smart Insights",
        description: "Our AI helps you find relevant tags to better understand what influences your mood.",
    },
];

export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <div className="flex justify-center mb-6">
          <Image src="https://placehold.co/600x400.png" alt="Calm landscape" width={600} height={400} className="rounded-xl shadow-lg" data-ai-hint="calm landscape" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-800">
          Welcome to <span className="text-primary">Mood Bloom</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal space to understand your feelings, notice patterns, and nurture your well-being. Start your journey of self-discovery, one mood at a time.
        </p>
        <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/log-mood">Log Your First Mood</Link>
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
