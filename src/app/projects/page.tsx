import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";

export default function ProjectsPage() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col ">
        <Sidebar />
        <div className="flex flex-col lg:pl-[14rem]">
          <Navbar />
          <main className="py-7 px-3 lg:px-7 flex flex-col gap-4">

          </main>
        </div>
      </div>
    </>
  );
}
