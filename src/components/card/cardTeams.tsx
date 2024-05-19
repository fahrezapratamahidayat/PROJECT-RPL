"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Edit2, Ellipsis, Loader2, LogOut, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  getTeams,
  leaveTeam,
  updateTeamWithChatLink,
} from "@/services/teams/teams";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserByIds, getUsersByEmails } from "@/services/users/getUser";
import ListUsers from "../chat/listUsers";
import { ScrollArea } from "../ui/scroll-area";
import DialogEditTeam from "../form/dialogFormEditTeam";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { getOrCreateChatRoom } from "@/services/chatting/chattings";
import { useRouter } from "next/navigation";

type teamsDataType = {
  id: string;
  leader: string;
  name: string;
  description: string;
  members: any[];
  created_At?: Date;
  updated_At?: Date;
  linkGroup?: string;
};
export default function CardTeams() {
  const [teams, setTeams] = useState<teamsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogMembers, setOpenDialogMembers] = useState(false);
  const [dialogEditTeam, setDialogEditTeam] = useState(false);
  const [membersData, setMembersData] = useState<any[]>([]);
  const router = useRouter();

  const [selectedTeam, setSelectedTeam] = useState<teamsDataType>(
    {} as teamsDataType
  );
  const [actionType, setActionType] = useState<"delete" | "leave" | null>(null);
  useEffect(() => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsubscribe = getTeams(session?.user?.id, (updatedTeams) => {
      setTeams(updatedTeams);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      setIsLoading(false);
    };
  }, [session?.user?.id]);
  const confirmAction = () => {
    if (actionType === "delete") {
      handleDeleteTeam(selectedTeam.id);
    } else if (actionType === "leave") {
      handleLeaveTeam(selectedTeam.id);
    }
    setOpenDialog(false);
    setActionType(null);
  };

  const handleDeleteTeam = async (id: string) => {
    const team = teams.find((team) => team.id === id);
    if (team?.leader !== session?.user?.email) {
      toast({
        title: "Failed",
        description: "Only the team leader can delete the team",
        duration: 2000,
        variant: "destructive",
      });
      return;
    }

    const response = await axios.post("/api/delteam", {
      id: id,
    });
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

  const handleLeaveTeam = (id: string) => {
    if (!session?.user?.email) return;

    if (session?.user?.email === selectedTeam.leader) {
      toast({
        title: "Failed",
        description: "You are the leader of the team",
        duration: 2000,
      });
      return;
    }
    leaveTeam(
      id,
      session?.user?.email && session?.user?.email,
      (success: boolean) => {
        if (success) {
          toast({
            title: "Success",
            description: "Team left successfully",
            duration: 2000,
          });
        } else {
          toast({
            title: "Failed",
            description: "Failed to leave team",
            duration: 2000,
          });
        }
      }
    );
  };

  const handleShowMembers = async (selectedTeam: teamsDataType) => {
    setOpenDialogMembers(true);
    setSelectedTeam(selectedTeam);
    if (selectedTeam.members) {
      const id = selectedTeam.members.filter((id) => id);
      if (id.length > 0) {
        const usersData = await getUserByIds(id);
        usersData.sort((a, b) => {
          if (a.email === session?.user?.email) return -1;
          if (b.email === session?.user?.email) return 1;
          if (a.email === selectedTeam.leader) return -1;
          if (b.email === selectedTeam.leader) return 1;
          return 0;
        });
        setMembersData(usersData);
      }
    }
  };

  const handleEditTeam = (selectedTeam: teamsDataType) => {
    setDialogEditTeam(true);
    setSelectedTeam(selectedTeam);
  };
  const handleCreateAndUpdateGroupChat = async (
    selectedTeam: teamsDataType
  ) => {
    try {
      const members = selectedTeam.members.filter(
        (member): member is string => member !== undefined
      );
      alert(JSON.stringify(members, null, 2));
      const chatRoom = await getOrCreateChatRoom(
        members,
        "group",
        selectedTeam.name,
        undefined
      );
      if (chatRoom && chatRoom.id && selectedTeam.id) {
        updateTeamWithChatLink(
          selectedTeam.id,
          chatRoom.id,
          (success: boolean) => {
            if (success) {
              toast({
                title: "Success",
                description:
                  "Team updated with new group chat link successfully.",
                duration: 2000,
                variant: "success",
              });
            } else {
              toast({
                title: "Failed",
                description: "Failed to update team with new group chat link.",
                duration: 2000,
                variant: "destructive",
              });
            }
          }
        );
      }
    } catch (error: any) {
      console.error("Error creating group chat room:", error);
      alert(`Failed to create group chat room: ${error.message}`);
    }
  };
  return (
    <>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "delete" ? "Hapus Tim" : "Keluar dari Tim"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "delete"
                ? "Apakah Anda yakin ingin menghapus tim ini?"
                : "Apakah Anda yakin ingin keluar dari tim ini?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setSelectedTeam({} as teamsDataType)}
            >
              batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Lanjut
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={openDialogMembers} onOpenChange={setOpenDialogMembers}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="mb-2">
              {selectedTeam.name} - Members
            </DialogTitle>
            <ScrollArea className="flex flex-col gap-2 max-h-[250px]">
              {membersData.length > 0 &&
                membersData.map((user) => (
                  <ListUsers
                    className={`${
                      user.email === session?.user?.email ? "bg-muted" : ""
                    }`}
                    key={user.id}
                    isValid={user.email !== session?.user?.email}
                    leader={
                      user.email === selectedTeam.leader
                        ? "Leader"
                        : "" || user.email === session?.user?.email
                        ? "You"
                        : ""
                    }
                    showMessage={true}
                    data={user}
                  />
                ))}
            </ScrollArea>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <DialogEditTeam
        open={dialogEditTeam}
        setOpen={setDialogEditTeam}
        selectedTeam={selectedTeam}
        title="Edit Team"
      />
      <div className="border flex flex-col justify-center px-3 py-3 gap-3 rounded-lg w-full">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold ">My Teams</h1>
          <p className="text-sm text-muted-foreground">Teams you are part of</p>
        </div>
        <div className="flex flex-col mx-2">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[12vh] h-[12vh]">
              <Loader2 className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : teams.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4 w-full">
              {teams.map((cardData) => (
                <CardTeam
                  key={cardData.id}
                  cardData={cardData}
                  onClickLeave={() => {
                    setSelectedTeam(cardData);
                    setActionType("leave");
                    setOpenDialog(true);
                  }}
                  onCLickDelete={() => {
                    setSelectedTeam(cardData);
                    setActionType("delete");
                    setOpenDialog(true);
                  }}
                  showMembers={() => handleShowMembers(cardData)}
                  onClickEdit={() => handleEditTeam(cardData)}
                  onClickGroup={() => {
                    if (!cardData.linkGroup) {
                      handleCreateAndUpdateGroupChat(cardData);
                    }
                    router.push(`/chats/${cardData.linkGroup}?type=group`);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[12vh] h-[12vh]">
              <span>Kamu Belum Ada team</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const CardTeam = ({
  cardData,
  onCLickDelete,
  onClickLeave,
  showMembers,
  onClickEdit,
  onClickGroup,
}: {
  cardData: teamsDataType;
  onCLickDelete: () => void;
  onClickLeave: () => void;
  showMembers?: () => void;
  onClickEdit?: () => void;
  onClickGroup?: () => void;
}) => {
  return (
    <Card>
      <CardHeader className="flex items-center flex-col w-full px-3 py-2  ">
        <div className="w-full flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-7 h-7 p-0" variant="ghost" size={"icon"}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuGroup>
                <DropdownMenuItem className="" onClick={onClickGroup}>
                  <ChatBubbleIcon className="mr-2 h-4 w-4" />
                  Group
                </DropdownMenuItem>
                <DropdownMenuItem className="" onClick={onCLickDelete}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onClickLeave}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onClickEdit}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Avatar className="cursor-pointer" onClick={showMembers}>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-col items-center justify-center gap-2">
          <CardTitle className="text-base text-center font-semibold">
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
