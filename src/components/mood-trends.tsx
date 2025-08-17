"use client";

import React, { useMemo, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { startOfWeek, startOfMonth } from 'date-fns';
import { useMoodStore } from '@/lib/store';
import { type Mood, moodOptions, type MoodEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportMoodsToPDF } from '@/lib/pdf-export';
import { useToast } from '@/hooks/use-toast';

const moodChartColors: Record<Mood, string> = {
  radiant: "hsl(var(--mood-radiant))",
  good: "hsl(var(--mood-good))",
  meh: "hsl(var(--mood-meh))",
  bad: "hsl(var(--mood-bad))",
  awful: "hsl(var(--mood-awful))",
};


function processMoodData(entries: MoodEntry[], startDate: Date) {
    const filteredEntries = entries.filter(entry => new Date(entry.date) >= startDate);

    const moodCounts = moodOptions.reduce((acc, mood) => {
        acc[mood] = 0;
        return acc;
    }, {} as Record<Mood, number>);

    filteredEntries.forEach(entry => {
        if (moodCounts[entry.mood] !== undefined) {
            moodCounts[entry.mood]++;
        }
    });

    return moodOptions.map(mood => ({
        mood,
        count: moodCounts[mood],
        fill: moodChartColors[mood]
    })).sort((a,b) => b.count - a.count);
}


export function MoodTrends() {
  const { entries, fetchEntries, loading, error } = useMoodStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleExport = () => {
    exportMoodsToPDF(entries);
    toast({
        title: "Exporting PDF",
        description: "Your mood history PDF is being generated."
    });
  };

  const weeklyData = useMemo(() => processMoodData(entries, startOfWeek(new Date())), [entries]);
  const monthlyData = useMemo(() => processMoodData(entries, startOfMonth(new Date())), [entries]);

  const chartConfig = moodOptions.reduce((acc, mood) => {
      acc[mood] = { label: mood.charAt(0).toUpperCase() + mood.slice(1), color: moodChartColors[mood] };
      return acc;
  }, {} as any);

  const renderChart = (data: any[], title: string, description: string) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    if (error) {
        return <p className="text-destructive">{error}</p>
    }
    if (data.every(d => d.count === 0)) {
        return <p className="text-muted-foreground">No data for this period yet.</p>;
    }
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 10 }}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="mood" type="category" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))' }} tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                 <ChartTooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<ChartTooltipContent hideLabel />} />
                 <Bar dataKey="count" radius={5} />
            </BarChart>
        </ChartContainer>
    );
  }

  return (
    <div className="grid gap-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-3xl">Mood Trends</CardTitle>
            <CardDescription>Visualize your mood patterns over time.</CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline" size="sm" disabled={entries.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export to PDF
          </Button>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>This Week's Moods</CardTitle>
                <CardDescription>A summary of your moods from this week.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderChart(weeklyData, "This Week's Moods", "A summary of your moods from this week.")}
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>This Month's Moods</CardTitle>
                <CardDescription>A summary of your moods from this month.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderChart(monthlyData, "This Month's Moods", "A summary of your moods from this month.")}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
