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
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { getOrCreateChatRoom } from "@/services/chatting/chattings";
import { useRouter } from "next/navigation";

type Inputs = z.infer<typeof schemaAddTeamsExtended>;

export default function FormAddGroupChats() {
  const [querySearch, setQuerySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const form = useForm<Inputs>({
    resolver: zodResolver(schemaAddTeamsExtended),
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  async function onSubmit(data: Inputs) {
    if(!session?.user?.id) return;
    const { user } = session;
    try {
        const members = [user.id, ...data.members].filter(id => id !== undefined) as string[];
        const chatRoom = await getOrCreateChatRoom(members, 'group', data.name);
        toast({
          title: "Success",
          description: "Group created successfully",
          duration: 2000
        })
        form.reset();
        console.log(chatRoom);
        router.push(`/chats/${chatRoom.id}?type=group`);
    } catch (error) {
        toast({
          title: "Failed",
          description: "Failed to create group",
          duration: 2000
        })
    }
  }
  const usersList = useFetchUsers(querySearch);
  const formattedUsersList = usersList.map((user) => ({
    label: user.fullname + " - " + user.email,
    value: user.id,
    id: user.id,
    email: user.email,
    fullname: user.fullname,
  }));

  const userList = formattedUsersList;
  return (
    <>
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
                    <Input type="text" {...field} {...form.register("name")} />
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
    </>
  );
}
