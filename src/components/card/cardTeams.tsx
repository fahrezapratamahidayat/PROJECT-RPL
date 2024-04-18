"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ellipsis, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getTeams } from "@/services/teams/teams";
import { useSession } from "next-auth/react";

type teamsDataType = {
  id: string;
  leader?: string;
  name?: string;
  description?: string;
  members?: any[];
  created_At?: Date;
  updated_At?: Date;
};
export default function CardTeams() {
  const [teams, setTeams] = useState<teamsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

useEffect(() => {
  console.log("Checking session email:", session?.user?.email);
  if (!session?.user?.email) {
    setIsLoading(false);
    return;
  }
  setIsLoading(true);
  const unsubscribe = getTeams(session?.user?.email, (updatedTeams) => {
    console.log("Updated teams received:", updatedTeams);
    setTeams(updatedTeams);
    setIsLoading(false);
  });

  return () => {
    unsubscribe();
    setIsLoading(false);
  };

}, [session?.user?.email]);
  return (
    <div className="border flex flex-col justify-center gap-3 px-3 py-2 rounded-lg w-full">
      <div className="flex flex-col space-y-1">
        <h1 className="text-lg font-bold ">My Teams</h1>
        <p className="text-sm text-muted-foreground">Teams you are part of</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        {isLoading ? (
          <div className="">
            <Loader2 className="animate-spin" />
            <span>Loading...</span>
          </div>
        ) : teams.length > 0 ? (
          teams.map((cardData) => (
            <CardTeam key={cardData.id} cardData={cardData} />
          ))
        ) : (
          <div className="flex justify-center items-center min-h-[100px]">
            <span>Kamu Belum Ada team</span>
          </div>
        )}
      </div>
    </div>
  );
}

const CardTeam = ({ cardData }: { cardData: teamsDataType }) => {
  return (
    <Card>
      <CardHeader className="flex items-center flex-col w-full p-3">
        <div className="w-full flex items-center justify-end">
          <Ellipsis />
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="text-base font-semibold">
            {cardData.name}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Members {cardData.members?.length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
