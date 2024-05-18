"use client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { schemaAddTeamsExtended } from "@/utils/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import MultiSelectFormField from "../ui/multi-select";
import useFetchUsers from "@/hooks/useFetchUsers";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
type teamsDataType = {
  id: string;
  leader: string;
  name: string;
  description?: string;
  members: any[];
  created_At?: Date;
  updated_At?: Date;
};

type Inputs = z.infer<typeof schemaAddTeamsExtended>;
export default function DialogEditTeam({
  open,
  setOpen,
  title,
  selectedTeam,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  showTrigger?: false | true;
  selectedTeam: teamsDataType;
}) {
  const [querySearch, setQuerySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const form = useForm<Inputs>({
    resolver: zodResolver(schemaAddTeamsExtended),
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  async function onSubmit(data: Inputs) {
    const members = selectedTeam?.members?.filter((email) => email);
    const combineMembers = [...members, ...data.members];
    const datas = {
      id: selectedTeam.id,
      name: data.name,
      description: data.description,
      members: combineMembers,
    };
    const respone = await axios.post("/api/updateteams", {
      ...datas,
    });
    if (respone.data.status) {
      setOpen(false);
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Team created successfully",
        duration: 2000,
      });
    } else {
      toast({
        title: "Failed",
        description: "Failed to create team",
        duration: 2000,
      });
    }
    form.reset();
  }
  const usersList = useFetchUsers(querySearch);
  const formattedUsersList = usersList
    .filter(
      (user) =>
        user.email !== selectedTeam.leader &&
        !selectedTeam.members
          ?.map((member) => member.value)
          .includes(user.email)
    )
    .map((user) => ({
      label: user.fullname + " - " + user.email,
      value: user.email,
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    }));

  const userList = formattedUsersList;

  useEffect(() => {
    form.reset({
      name: selectedTeam.name,
      description: selectedTeam.description,
      members: selectedTeam.members?.map((member) => member.value),
    });
  }, [form, selectedTeam]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4 sm:max-w-[450px]">
          <DialogHeader className="border-b pb-4 px-1">
            <DialogTitle className="text-left">{title}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
              <div className={cn("px-1 space-y-1")}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Name Team</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          {...form.register("name")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[40px] resize-none"
                          placeholder="Type your message here."
                          {...field}
                          {...form.register("description")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="members"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Members</FormLabel>
                      <FormControl>
                        <MultiSelectFormField
                          options={userList}
                          popoperClassName="w-[392px]"
                          onValueChange={field.onChange}
                          placeholder="Select members"
                          variant="inverted"
                          animation={2}
                          {...field}
                          {...form.register("members")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isLoading ? (
                <Button className="mt-2 w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </Button>
              ) : (
                <Button className="w-full mt-2" type="submit">
                  Create
                </Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
