"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { useMoodStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { type MoodEntry, type Mood } from '@/types';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';


const moodColorClasses: Record<Mood, string> = {
  radiant: 'bg-mood-radiant/20 border-mood-radiant',
  good: 'bg-mood-good/20 border-mood-good',
  meh: 'bg-mood-meh/20 border-mood-meh',
  bad: 'bg-mood-bad/20 border-mood-bad',
  awful: 'bg-mood-awful/20 border-mood-awful',
};

const moodDotClasses: Record<Mood, string> = {
    radiant: 'bg-mood-radiant',
    good: 'bg-mood-good',
    meh: 'bg-mood-meh',
    bad: 'bg-mood-bad',
    awful: 'bg-mood-awful',
};


function DayWithPopover({ date, entry }: { date: Date, entry: MoodEntry | undefined }) {
    if (!entry) {
        return <div>{format(date, 'd')}</div>;
    }
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative w-full h-full flex items-center justify-center">
                    {format(date, 'd')}
                    <div className={cn("absolute bottom-1 h-1.5 w-1.5 rounded-full", moodDotClasses[entry.mood])} />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Mood on {format(new Date(entry.date), "PPP")}</h4>
                        <p className={cn("text-sm font-semibold capitalize", `text-mood-${entry.mood}`)}>{entry.mood}</p>
                    </div>
                    {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}
                    {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {entry.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}


export function MoodCalendar() {
  const { entries, fetchEntries, loading } = useMoodStore();
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const entriesByDate = useMemo(() => {
    return entries.reduce((acc, entry) => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      acc[dateKey] = entry;
      return acc;
    }, {} as Record<string, MoodEntry>);
  }, [entries]);

  const modifiers = useMemo(() => {
    const mods: Record<string, Date[]> = {
        radiant: [],
        good: [],
        meh: [],
        bad: [],
        awful: [],
    };
    entries.forEach(entry => {
        if (mods[entry.mood]) {
            mods[entry.mood].push(new Date(entry.date));
        }
    });
    return mods;
  }, [entries]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Mood Calendar</CardTitle>
        <CardDescription>A visual overview of your mood patterns. Click on a day to see details.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            modifiers={modifiers}
            modifiersClassNames={moodColorClasses}
            className="p-0"
            components={{
              Day: ({ date, ...props }) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  const entry = entriesByDate[dateKey];
                  return <DayWithPopover date={date} entry={entry} />;
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
