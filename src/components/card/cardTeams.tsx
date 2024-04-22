"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ellipsis, Loader2, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getTeams } from "@/services/teams/teams";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useTasks } from "@/hooks/useTaskManager";

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
  const { toast } = useToast();

  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsubscribe = getTeams(session?.user?.email, (updatedTeams) => {
      setTeams(updatedTeams);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      setIsLoading(false);
    };
  }, [session?.user?.email]);
  
  const handleDeleteTeam = async (id: string) => {
    const response = await axios.post("/api/delteam", {
      id: id,
    });
    console.log(response);
    if (response.data.status) {
      toast({
        title: "Success",
        description: "Team deleted successfully",
        duration: 2000,
      });
    } else {
      toast({
        title: "Failed",
        description: "Failed to delete team",
        duration: 2000,
      });
    }
  };
  return (
    <div className="border flex flex-col justify-center px-3 py-3 gap-3 rounded-lg w-full">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold ">My Teams</h1>
        <p className="text-sm text-muted-foreground">Teams you are part of</p>
      </div>
      <div className="flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center max-h-[20vh] h-[20vh]">
            <Loader2 className="animate-spin" />
            <span>Loading...</span>
          </div>
        ) : teams.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5 w-full">
            {teams.map((cardData) => (
              <CardTeam
                key={cardData.id}
                cardData={cardData}
                onCLick={() => handleDeleteTeam(cardData.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center max-h-[20vh] h-[20vh]">
            <span>Kamu Belum Ada team</span>
          </div>
        )}
      </div>
    </div>
  );
}

const CardTeam = ({
  cardData,
  onCLick,
}: {
  cardData: teamsDataType;
  onCLick?: () => void;
}) => {
  return (
    <Card>
      <CardHeader className="flex items-center flex-col w-full p-3">
        <div className="w-full flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-7 h-7 p-0" variant="ghost" size={"icon"}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-red-600" onClick={onCLick}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
