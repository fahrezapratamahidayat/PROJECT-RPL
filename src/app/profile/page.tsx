"use client";
import { AvatarGroups } from "@/components/avatars/avatarGroup";
import ListUsers from "@/components/chat/listUsers";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import DashboardView from "@/components/pages/dashboardView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getTeams } from "@/services/teams/teams";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type teamsDataType = {
  id: string;
  name: string;
  profileUrl?: string;
  membersInGroup?: string[] | number;
  leader: string;
  description: string;
  members: string[];
  created_At?: Date;
  updated_At?: Date;
};

export default function ProfilePage() {
  const { data: session }: { data: any } = useSession();
  const [teams, setTeams] = useState<teamsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <Sidebar />
      <div className="flex flex-col lg:pl-[14rem]">
        <Navbar />
        <main className="py-7 px-3 lg:px-7 flex flex-col gap-4">
          <div className="border flex flex-col justify-center gap-3 px-3 py-2 rounded-lg w-full">
            <div className="flex items-center gap-x-3">
              {session && session.user?.image ? (
                <Avatar className="h-14 w-14">
                  <AvatarImage src={session && session.user.image} />
                  <AvatarFallback>cn</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col space-y-1">
                <h1 className="text-lg font-bold ">
                  {session && session.user?.fullname}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {session && session.user?.email}
                </p>
              </div>
            </div>
            <Separator className="mt-2" />
            <div className="w-full">
              <h1 className="text-lg font-bold">About</h1>
              <p className="txt-muted-foreground mt-2 text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
                optio minima harum blanditiis aperiam nostrum, nobis iure magni
                sint vitae omnis, quasi, deserunt qui ab! Deleniti molestias et
                maiores nulla. Est dolor beatae obcaecati dolore dolorum
                incidunt optio iste eligendi repellat ea excepturi sequi
                recusandae, itaque omnis neque a autem eum cumque. Assumenda
                blanditiis necessitatibus animi dolorum incidunt distinctio
                commodi quos sequi rem facere? Quo optio laborum nisi ab enim
                dolore sunt obcaecati architecto quis quaerat perferendis,
                numquam dolor dignissimos fuga vitae consectetur blanditiis unde
                eaque praesentium! Impedit odit eum, dolore id necessitatibus
                nemo exercitationem quis est totam consequuntur accusantium.
              </p>
            </div>
            <div className="w-full">
              <h1 className="text-lg font-bold">Joined Teams</h1>
              {isLoading && teams.length > 0 ? (
                <h1>Loading</h1>
              ) : (
                <div className="w-full mt-2">
                  {teams.map((team) => (
                    <AvatarGroups
                      key={team.id}
                      data={{
                        ...team,
                        membersInGroup: team.members.length, // Menambahkan jumlah anggota sebagai bagian dari data
                      }}
                      hrefActive={false}
                      variant={"secondary"}
                      slug={session?.user?.email}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
