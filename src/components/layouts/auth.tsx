import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className="flex items-center min-h-screen">
        <Card className="mx-auto max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="grid gap-2">{children}</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}