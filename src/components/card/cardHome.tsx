"use client";

export default function CardDashboard({ icon, title, value }: { icon?: any, title: string, value: number }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex items-center justify-center rounded-full border-blue-500 border">
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm text-muted-foreground">{title}</h4>
          <h1 className="text-2xl font-bold">{value}</h1>
        </div>
      </div>
    </>
  );
}
