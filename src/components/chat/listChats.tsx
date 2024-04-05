import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

export default function ListChats({
  showMessage = true,
  data,
}: {
  showMessage?: boolean;
  data?: any;
}) {
  const text: string =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
  return (
    <>
      <Link href={`/chat/${data.id}`}>
        <div className="flex items-centers justify-start gap-5 px-3 py-3 rounded-lg hover:bg-muted">
          <Avatar>
            <AvatarImage src={data.profileUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">{data.fullname}</h1>
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
