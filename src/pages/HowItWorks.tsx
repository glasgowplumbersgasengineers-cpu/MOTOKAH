import Header from "@/components/Header";
import TutorialVideos from "@/components/TutorialVideos";
import { usePageTitle } from "@/hooks/usePageTitle";

// The More tab: just the How It Works tutorial video (English or Swahili),
// sized to fit the screen between the header and the bottom nav.
export default function HowItWorks() {
  usePageTitle("How It Works");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto px-4 pt-4 max-w-md h-[calc(100dvh-64px-env(safe-area-inset-top)-100px-env(safe-area-inset-bottom))] lg:h-[calc(100dvh-160px)]">
        <TutorialVideos />
      </div>
    </div>
  );
}
