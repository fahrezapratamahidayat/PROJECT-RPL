export default function ChatPanelLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        className={`${className} flex gap-2 py-7 px-3 lg:px-7 items-start h-full w-full`}
      >
        {children}
      </div>
    </>
  );
}
