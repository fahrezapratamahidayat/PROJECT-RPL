import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import CardListTasks from "../card/cardMyTask";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { greetings } from "@/hooks/greetings";
import CardTeams from "../card/cardTeams";
import CardTasksTeams from "../card/cardTasksTeams";
import CardTaskDashboard from "../card/cardTaskDashboard";
export default function DashboardView() {
  return (
    <>
      <main className="py-7 px-3 lg:px-7 flex flex-col gap-4">
        <CardTaskDashboard />
        <div className="w-full flex lg:flex-row sm:flex-row md:flex-row flex-col gap-2">
          <CardListTasks />
          <CardTasksTeams />
        </div>
        <CardTeams />
      </main>
    </>
  );
}
