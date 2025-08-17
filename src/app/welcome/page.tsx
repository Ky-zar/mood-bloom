import { WelcomeForm } from "@/components/welcome-form";
import PrivateRoute from "@/components/private-route";

export default function WelcomePage() {
    return (
        <PrivateRoute>
            <div className="flex items-center justify-center min-h-full">
                <WelcomeForm />
            </div>
        </PrivateRoute>
    );
}
