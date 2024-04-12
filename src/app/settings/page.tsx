/**
 * v0 by Vercel.
 * @see https://v0.dev/t/8VLLjNN0G37
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function Component() {
  return (
    <Card className="w-full max-w-3xl p-4">
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <img
            alt="Avatar"
            className="rounded-full border-4 border-white"
            height={150}
            src="/placeholder.svg"
            style={{
              aspectRatio: "150/150",
              objectFit: "cover",
            }}
            width={150}
          />
          <Button
            className="absolute bottom-0 right-0 translate-x-2/4 group-hover:translate-x-0"
            size="sm"
            variant="ghost"
          >
            <CameraIcon className="h-4 w-4" />
            <span className="sr-only">Change</span>
          </Button>
        </div>
        <div className="space-y-1.5">
          <div className="text-2xl font-bold leading-none">johndoe</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Joined on February 4, 2023</div>
        </div>
      </div>
      <div className="grid gap-2 mt-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" readOnly value="johndoe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea className="min-h-[100px]" id="bio" placeholder="Enter your bio" />
        </div>
      </div>
      <div className="grid gap-4 mt-4">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>Choose when to send you an email.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">New features</h3>
                  </div>
                  <div className="w-24">
                    <Switch defaultChecked id="new-features" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Product updates</h3>
                  </div>
                  <div className="w-24">
                    <Switch id="product-updates" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Weekly digest</h3>
                  </div>
                  <div className="w-24">
                    <Switch defaultChecked id="weekly-digest" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose when to send you a notification.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Email</h3>
                  </div>
                  <div className="w-24">
                    <Switch defaultChecked id="email" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Push notifications</h3>
                  </div>
                  <div className="w-24">
                    <Switch id="push-notifications" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">SMS</h3>
                  </div>
                  <div className="w-24">
                    <Switch defaultChecked id="sms" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Review your account security settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Two-factor authentication</h3>
                  </div>
                  <Link className="text-sm font-medium underline ml-auto" href="#">
                    Enable
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Password</h3>
                  </div>
                  <Link className="text-sm font-medium underline ml-auto" href="#">
                    Change
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  )
}

function CameraIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}