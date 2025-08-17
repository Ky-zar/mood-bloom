import { MoodCalendar } from "@/components/mood-calendar";
import PrivateRoute from "@/components/private-route";

export default function CalendarPage() {
    return (
        <PrivateRoute>
            <div>
                <MoodCalendar />
            </div>
        </PrivateRoute>
    );
}
