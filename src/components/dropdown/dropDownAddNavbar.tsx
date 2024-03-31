import {
  Plus,
  SquareCheck,
  StickyNote,
  Users,
} from "lucide-react";
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

export function DropDownAddNavbar() {
  const { data: session }: { data: any } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <div className="flex items-center relative rounded-full bg-secondary">
          <Plus />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4 mt-2">
        <DropdownMenuGroup >
          <DropdownMenuItem className="gap-2">
            <SquareCheck />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Create task</span>
              <span className="text-xs text-muted-foreground">
                Create a new task for today
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Users className="" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Create Team</span>
              <span className="text-xs text-muted-foreground">
                Create your team now
              </span>
            </div>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="gap-2">
            <StickyNote />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Create Project</span>
              <span className="text-xs text-muted-foreground">
                Create a new project for team
              </span>
            </div>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// const DropdownMenuContent = () => {
//   return (
//     <>
//       <DropdownMenuLabel>My Account</DropdownMenuLabel>
//       <DropdownMenuSeparator />
//       <DropdownMenuGroup>
//         <DropdownMenuItem>
//           <User className="mr-2 h-4 w-4" />
//           <span>Profile</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <span>Billing</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <Settings className="mr-2 h-4 w-4" />
//           <span>Settings</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <span>Keyboard shortcuts</span>
//         </DropdownMenuItem>
//       </DropdownMenuGroup>
//       <DropdownMenuSeparator />
//       <DropdownMenuGroup>
//         <DropdownMenuItem>
//           <span>Team</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <Plus className="mr-2 h-4 w-4" />
//           <span>New Team</span>
//         </DropdownMenuItem>
//       </DropdownMenuGroup>
//       <DropdownMenuSeparator />
//       <DropdownMenuItem>
//         <span>GitHub</span>
//       </DropdownMenuItem>
//       <DropdownMenuItem>
//         <LifeBuoy className="mr-2 h-4 w-4" />
//         <span>Support</span>
//       </DropdownMenuItem>
//       <DropdownMenuItem disabled>
//         <span>API</span>
//       </DropdownMenuItem>
//       <DropdownMenuSeparator />
//       <DropdownMenuItem>
//         <LogOut className="mr-2 h-4 w-4" />
//         <span>Log out</span>
//       </DropdownMenuItem>
//     </>
//   );
// };
