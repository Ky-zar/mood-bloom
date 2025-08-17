"use client";

import { Laugh, Smile, Frown, Meh, Angry } from 'lucide-react';
import { type Mood, moodOptions } from '@/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const moodIcons: Record<Mood, React.ReactElement> = {
  radiant: <Laugh className="h-10 w-10 text-mood-radiant" />,
  good: <Smile className="h-10 w-10 text-mood-good" />,
  meh: <Meh className="h-10 w-10 text-mood-meh" />,
  bad: <Frown className="h-10 w-10 text-mood-bad" />,
  awful: <Angry className="h-10 w-10 text-mood-awful" />,
};

const moodLabels: Record<Mood, string> = {
    radiant: 'Radiant',
    good: 'Good',
    meh: 'Meh',
    bad: 'Bad',
    awful: 'Awful',
};

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
}

export function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <TooltipProvider>
        <div className="flex justify-center space-x-4 py-4">
        {moodOptions.map((mood) => (
            <Tooltip key={mood}>
            <TooltipTrigger asChild>
                <button
                type="button"
                onClick={() => onSelectMood(mood)}
                className={cn(
                    'rounded-full p-4 transition-all duration-300 ease-in-out',
                    selectedMood === mood ? 'bg-primary/50 scale-110' : 'bg-card hover:bg-primary/20',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring'
                )}
                >
                {moodIcons[mood]}
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{moodLabels[mood]}</p>
            </TooltipContent>
            </Tooltip>
        ))}
        </div>
    </TooltipProvider>
  );
}
