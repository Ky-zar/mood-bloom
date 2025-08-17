import { MoodEntryForm } from "@/components/mood-entry-form";
import PrivateRoute from "@/components/private-route";

export default function LogMoodPage() {
  return (
    <PrivateRoute>
      <div className="w-full">
        <MoodEntryForm />
      </div>
    </PrivateRoute>
  );
}
