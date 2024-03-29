"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status }: { data: any; status: string } = useSession();
  return (
    <>
      <div className="sticky max-w-full w-full items-center justify-between font-semibold lg:flex px-10 py-4 border">
        <div className="flex items-center w-max">
          <h1 className="text-2xl">Task</h1>
          <div className="ml-40">
            <h1 className="text-2xl text-muted-foreground">Home</h1>
          </div>
        </div>
        <div className="flex items-center w-max">
          <ul className="inline-flex items-center gap-5 space-x-4">
            <li className="text-sm">
              {status && status === "authenticated" ? (
                <button
                  className=" text-sky-500 text-semibold text-sm"
                  onClick={() => signOut()}
                >
                  Logout
                </button>
              ) : (
                <button
                  className=" text-blue-500 text-sm"
                  onClick={() => signIn()}
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
