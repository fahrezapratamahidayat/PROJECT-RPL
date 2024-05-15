import { LifeBuoy, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { Suspense } from "react";
import Link from "next/link";

export function DropdownAvatar() {
  const { data: session }: { data: any } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {session && session.user.image ? (
          <Avatar className="h-9 w-9">
            <AvatarImage src={session && session.user.image} />
            <AvatarFallback>profile</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4 mt-2">
        <DropdownMenuLabel className="flex flex-col">
          <Suspense fallback={<div>Loading...</div>}>
            {session && session.user.fullname}
            <small className="">{session && session.user.email}</small>
          </Suspense>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href={"/settings"}>settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <Button
            className="h-0 px-0 py-0"
            variant={"ghost"}
            onClick={() => signOut()}
          >
            {" "}
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
