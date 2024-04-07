import ChatUi from "@/components/chat/chatUi";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import PagesLayouts from "@/components/layouts/pagesLayouts";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";

type ChatSlug = {
  params: {
    slug: string;
  };
};

export default function PageChats(props: ChatSlug) {
  const { params } = props;
  return (
    <>
      <Navbar />
      <Sidebar />
      <PagesLayouts>
        <ChatUi slug={params.slug} />
      </PagesLayouts>
      <DarkModeToggle />
    </>
  );
}
