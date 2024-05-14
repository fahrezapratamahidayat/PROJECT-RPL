import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ListUsers({
  showMessage = true,
  data,
  slug,
  className,
  leader,
  isValid = true,
}: {
  showMessage?: boolean;
  data?: any;
  slug?: string;
  className?: string;
  leader?: string;
  isValid?: boolean;
}) {
  return (
    <>
      <Link
        href={isValid ? `/chats/${data.id}?type=direct` : ""}
      >
        <div
          className={cn(
            `${
              data.id === slug ? "bg-muted" : ""
            } ${className} flex items-centers justify-start gap-5 px-3 py-3 rounded-lg hover:bg-muted mx-1 mt-1`,
            {}
          )}
        >
          <Avatar>
            <AvatarImage
              src={data.profileUrl || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">
                {data.fullname} {leader ? `(${leader})` : ""}
              </h1>
              {/* <div className="w-1 h-1 rounded-full bg-green-500 mt-1"></div>
                  <span className="text-xs text-muted-foreground">Online</span> */}
            </div>
            {showMessage && (
              <p className="text-sm text-muted-foreground w-full">
                {data.email > 40 ? data.email.slice(0, 40) + "..." : data.email}
              </p>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}
