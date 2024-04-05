export default function PagesLayouts({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="lg:pl-[15.5rem] py-7 mr-9 flex flex-col gap-4">
        {children}
      </main>
    </>
  );
}
