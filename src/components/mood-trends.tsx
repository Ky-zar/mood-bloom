"use client";

import React, { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { startOfWeek, startOfMonth } from 'date-fns';
import { useMoodStore } from '@/lib/store';
import { type Mood, moodOptions, type MoodEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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
  const allEntries = useMoodStore((state) => state.entries);
  const { toast } = useToast();

  const handleExport = () => {
    exportMoodsToPDF(allEntries);
    toast({
        title: "Exporting PDF",
        description: "Your mood history PDF is being generated."
    });
  };

  const weeklyData = useMemo(() => processMoodData(allEntries, startOfWeek(new Date())), [allEntries]);
  const monthlyData = useMemo(() => processMoodData(allEntries, startOfMonth(new Date())), [allEntries]);

  const chartConfig = moodOptions.reduce((acc, mood) => {
      acc[mood] = { label: mood.charAt(0).toUpperCase() + mood.slice(1), color: moodChartColors[mood] };
      return acc;
  }, {} as any);

  return (
    <div className="grid gap-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-3xl">Mood Trends</CardTitle>
            <CardDescription>Visualize your mood patterns over time.</CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline" size="sm">
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
                {weeklyData.every(d => d.count === 0) ? <p className="text-muted-foreground">No data for this week yet.</p> : (
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={weeklyData} layout="vertical" margin={{ left: 10 }}>
                         <XAxis type="number" hide />
                         <YAxis dataKey="mood" type="category" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))' }} tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                         <ChartTooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<ChartTooltipContent hideLabel />} />
                         <Bar dataKey="count" radius={5} />
                    </BarChart>
                </ChartContainer>
                )}
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>This Month's Moods</CardTitle>
                <CardDescription>A summary of your moods from this month.</CardDescription>
            </CardHeader>
            <CardContent>
                 {monthlyData.every(d => d.count === 0) ? <p className="text-muted-foreground">No data for this month yet.</p> : (
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={monthlyData} layout="vertical" margin={{ left: 10 }}>
                         <XAxis type="number" hide />
                         <YAxis dataKey="mood" type="category" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--foreground))' }} tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                         <ChartTooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<ChartTooltipContent hideLabel />} />
                         <Bar dataKey="count" radius={5} />
                    </BarChart>
                </ChartContainer>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
