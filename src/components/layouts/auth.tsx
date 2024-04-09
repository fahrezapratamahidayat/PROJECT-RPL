import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function AuthLayout({
  children,
  link = "/auth/register",
  description = "Sudah punya akun?",
  descriptionLink = "Sign in",
  title = "Create Your Account",
}: {
  children: React.ReactNode;
  link: "/auth/register" | "/auth/login";
  description: "Sudah punya akun?" | "Belum punya akun?";
  descriptionLink: "Sign in" | "Sign up";
  title: "Create Your Account" | "Login";
}) {
  return (
    <>
      <div className="flex items-center min-h-screen">
        <Card className="mx-auto max-w-lg ">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="">{children}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// export function LoginForm() {
//   return (
//     <Card className="mx-auto max-w-sm">
//       <CardHeader>
//         <CardTitle className="text-2xl">Login</CardTitle>
//         <CardDescription>
//           Enter your email below to login to your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="m@example.com"
//               required
//             />
//           </div>
//           <div className="grid gap-2">
//             <div className="flex items-center">
//               <Label htmlFor="password">Password</Label>
//               <Link href="#" className="ml-auto inline-block text-sm underline">
//                 Forgot your password?
//               </Link>
//             </div>
//             <Input id="password" type="password" required />
//           </div>
//           <Button type="submit" className="w-full">
//             Login
//           </Button>
//           <Button variant="outline" className="w-full">
//             Login with Google
//           </Button>
//         </div>
//         <div className="mt-4 text-center text-sm">
//           Don&apos;t have an account?{" "}
//           <Link href="#" className="underline">
//             Sign up
//           </Link>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
