import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Users } from "lucide-react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-centers justify-start gap-5 px-3 py-3 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-muted",
        destructive: "bg-destructive",
        outline: "bg-transparent",
        secondary: " border",
        ghost: "bg-transparent",
        link: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
export interface AvatarGroupProps extends VariantProps<typeof buttonVariants> {
  data: {
    id: string;
    name: string;
    profileUrl?: string;
    membersInGroup?: string[] | number;
    leader: string;
    description: string;
    members: string[];
    created_At?: Date;
  };
  slug: string;
  hrefActive?: boolean;
  className?: string;
}

const AvatarGroups = React.forwardRef<HTMLAnchorElement, AvatarGroupProps>(
  (
    {
      data,
      slug,
      hrefActive = false,
      variant,
      className,
      ...props
    }: AvatarGroupProps,
    ref
  ) => {
    return (
      <Link
        href={hrefActive ? `/chats/${data.id}?type=group` : ""}
        className={cn(buttonVariants({ variant, className }))}
        {...props}
        ref={ref}
      >
        <Avatar>
          <AvatarImage
            src={data.profileUrl || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">{data.name}</h1>
          </div>
          {data.membersInGroup && (
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <p className="text-sm text-muted-foreground">
                {data.membersInGroup} members
              </p>
            </div>
          )}
        </div>
      </Link>
    );
  }
);
AvatarGroups.displayName = "AvatarGroups";
export { AvatarGroups };
// export default function AvatarGroup({
//   data,
//   slug,
//   hrefActive,
// }: {
//   data: {
//     id: string;
//     name: string;
//     profileUrl?: string;
//     membersInGroup?: string[] | number;
//     leader: string;
//     description: string;
//     members: string[];
//     created_At?: Date;
//     updated_At?: Date;
//   };
//   slug?: string;
//   hrefActive?: boolean;

// }) {
//   return (
//     <>

//     </>
//   );
// }
