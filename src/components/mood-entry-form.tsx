"use client";

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Tag, Sparkles, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useMoodStore } from '@/lib/store';
import { type Mood, moodOptions } from '@/types';
import { MoodSelector } from './mood-selector';
import { suggestMoodTags } from '@/ai/flows/suggest-mood-tags';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

const moodEntrySchema = z.object({
  mood: z.custom<Mood>((val) => moodOptions.includes(val as Mood), {
    message: "Please select a mood.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type MoodEntryFormData = z.infer<typeof moodEntrySchema>;

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
        new Promise(resolve => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => resolve(func(...args)), waitFor);
        });
}


export function MoodEntryForm() {
  const { toast } = useToast();
  const addEntry = useMoodStore((state) => state.addEntry);
  const [isPending, startTransition] = useTransition();
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const form = useForm<MoodEntryFormData>({
    resolver: zodResolver(moodEntrySchema),
    defaultValues: {
      notes: '',
      tags: [],
    },
  });

  useEffect(() => {
    form.reset({
        date: new Date(),
        notes: '',
        tags: [],
    });
    setIsHydrated(true);
  }, [form]);

  const debouncedSuggestTags = useCallback(debounce(async (notes: string) => {
    if (notes.trim().length < 10) {
      setSuggestedTags([]);
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestMoodTags({ moodEntry: notes });
      setSuggestedTags(result.tags);
    } catch (error) {
      console.error("Failed to suggest tags:", error);
      toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not fetch tag suggestions.",
      });
    } finally {
      setIsSuggesting(false);
    }
  }, 1000), [toast]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue('notes', e.target.value);
    debouncedSuggestTags(e.target.value);
  };
  
  const handleAddTag = (tag: string) => {
    const newTag = tag.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        handleAddTag(tagInput);
        setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


  const onSubmit = (data: MoodEntryFormData) => {
    startTransition(() => {
      addEntry({
        ...data,
        tags: tags,
        date: data.date.toISOString(),
      });
      form.reset({
        date: new Date(),
        notes: '',
        tags: [],
      });
      setTags([]);
      setSuggestedTags([]);
      toast({
        title: "Entry Saved",
        description: "Your mood has been logged successfully.",
      });
    });
  };

  if (!isHydrated) {
    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">How are you feeling today?</CardTitle>
                <CardDescription>Log your mood to track your emotional well-being.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex justify-center space-x-4 py-4">
                    {moodOptions.map(mood => <Skeleton key={mood} className="h-20 w-20 rounded-full" />)}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Skeleton className="h-32 w-full" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Label>Date</Label>
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
             <CardFooter>
                <Button className="w-full" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                </Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">How are you feeling today?</CardTitle>
        <CardDescription>Log your mood to track your emotional well-being.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-8">
            <Controller
                control={form.control}
                name="mood"
                render={({ field, fieldState }) => (
                    <div>
                        <MoodSelector selectedMood={field.value} onSelectMood={field.onChange} />
                        {fieldState.error && <p className="text-sm font-medium text-destructive text-center mt-2">{fieldState.error.message}</p>}
                    </div>
                )}
            />
          
            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    placeholder="What's on your mind? Write about your day, feelings, or anything else."
                    {...form.register('notes')}
                    onChange={handleNotesChange}
                    className="min-h-[120px]"
                />
            </div>

            {(isSuggesting || suggestedTags.length > 0) && (
                 <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        AI Suggested Tags
                    </Label>
                    {isSuggesting ? (
                         <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin"/>
                            <span>Analyzing your notes...</span>
                         </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {suggestedTags.map((tag) => (
                                <Button type="button" variant="outline" size="sm" key={tag} onClick={() => { handleAddTag(tag); }} disabled={tags.includes(tag)}>
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    )}
                 </div>
            )}
            
            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                 <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="rounded-full hover:bg-muted-foreground/20">
                                <X className="h-3 w-3"/>
                            </button>
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center gap-2 border rounded-md px-2">
                    <Tag className="h-4 w-4 text-muted-foreground"/>
                    <input 
                        id="tags"
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder="Add tags (e.g., work, family) and press Enter"
                        className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Date</Label>
                 <Controller
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                 />
            </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Mood Entry
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
