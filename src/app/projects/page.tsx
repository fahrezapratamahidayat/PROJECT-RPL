import CardProjects from "@/components/card/cardProjects";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";

import { FilePlus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="lg:pl-[15.5rem] py-7">
        <div className="flex items-center gap-5 space-x-4">
          <div className="flex items-center ">
            <h1 className="text-base font-bold">Projects</h1>
          </div>
          <div className="flex items-center gap-1">
            <FilePlus className="h-4 w-4" />
            <h1 className="text-sm">Add Project</h1>
          </div>
        </div>
        <div className="flex mt-5 gap-3">
          <div className="w-[73%]">
            <div className="grid grid-cols-3 grid-rows-3 gap-3">
              <CardProjects />
              <CardProjects />
              <CardProjects />
              <CardProjects />
              <CardProjects />
              <CardProjects />
              <CardProjects />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
