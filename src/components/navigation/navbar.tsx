"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <div className="sticky max-w-full w-full items-center justify-between font-semibold lg:flex px-10 py-4 border">
        <div className="flex items-center w-max">
          <h1 className="text-2xl">Task</h1>
          <div className="ml-20">
            <ul className="inline-flex items-center gap-4 space-x-4">
              <li className="text-sm">
                <Link href="/">Board</Link>
              </li>
              <li className="text-sm">
                <Link href="/">Planning</Link>
              </li>
              <li className="text-sm">
                <Link href="/">Team</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center w-max">
          <ul className="inline-flex items-center gap-5 space-x-4">
            <li className="text-sm">
              <Link href="/auth/register">Sign up</Link>
            </li>
            <li className="text-sm">
              <Link href="/auth/login">Sign in</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
