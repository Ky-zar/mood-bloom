import { MoodTrends } from "@/components/mood-trends";
import PrivateRoute from "@/components/private-route";

export default function TrendsPage() {
    return (
        <PrivateRoute>
            <div>
                <MoodTrends />
            </div>
        </PrivateRoute>
    );
}
