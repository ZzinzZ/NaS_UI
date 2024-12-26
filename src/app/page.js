import { BackgroundGradientAnimation } from "@/components/layoutComponent/BackgroundGradientAnimation ";
import LandingContent from "@/components/layoutComponent/LandingContent";

export default function Home() {
  return (
    <BackgroundGradientAnimation>
      <div className="relative z-10">
        <LandingContent />
      </div>
    </BackgroundGradientAnimation>
  );
}
