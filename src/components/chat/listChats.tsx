import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ListChats() {
  const text: string =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
  const ListChats = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      className="flex items-centers justify-start gap-5"
      ref={ref}
      {...props}
    >
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold">ShadCn</h1>
          {/* <div className="w-1 h-1 rounded-full bg-green-500 mt-1"></div>
                  <span className="text-xs text-muted-foreground">Online</span> */}
        </div>
        <p className="text-sm text-muted-foreground w-full">
          {text.length > 40 ? text.slice(0, 40) + "..." : text}
        </p>
      </div>
    </div>
  ));
  ListChats.displayName = "ListChats";
  return <ListChats />;
}
