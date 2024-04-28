import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

export default function AvatarGroup({
  data,
  slug,
}: {
  data: {
    id: string;
    name: string;
    profileUrl?: string;
  };
  slug?: string;
}) {
  return (
    <>
      <Link href={`/chats/${data.id}?type=group`}>
        <div
          className={`${
            data.id === slug ? "bg-muted" : ""
          } flex items-centers justify-start gap-5 px-3 py-3 rounded-lg hover:bg-muted`}
        >
          <Avatar>
            <AvatarImage src={data.profileUrl || "https://github.com/shadcn.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
            <div className="flex items-center">
              <h1 className="text-lg font-semibold">{data.name}</h1>
            </div>
        </div>
      </Link>
    </>
  );
}
