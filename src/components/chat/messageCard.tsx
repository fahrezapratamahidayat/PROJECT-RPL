import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function MessageCard({
  message,
  className,
  date,
}: {
  message: string;
  className?: string;
  date?: string;
}) {
  return (
    <>
      <div className={`flex ${className} items-start gap-2`}>
        <div className="flex flex-col">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="px-3 py-2.5 bg-secondary rounded-md">
          <p className="text-justify w-full">{message}</p>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
      </div>
    </>
  );
}
