import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { redirect } from 'next/navigation'
import DetailsTaskPage from "@/components/pages/detailsTaskPage";

export default function Page({ params }: { params: { slug: string[] } }) {

  if (!params.slug || params.slug.length === 0) {
    redirect('/dashboard')
    return;
  }
  return (
    <>
     <div className="flex min-h-screen w-full flex-col ">
      <Sidebar />
      <div className="flex flex-col lg:pl-[14rem]">
        <Navbar />
        <DetailsTaskPage params={params} />
      </div>
    </div>
    </>
  );
}