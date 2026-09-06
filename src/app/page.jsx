import SectionFirst from "@/components/homepage/sectionfirst";
import Sectionthird from "@/components/homepage/sectionthird";

import Sectiontwo from "@/components/homepage/sectiontwo";

export default function Home() {
  return (
    <main className="w-full bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      <SectionFirst />
      <Sectiontwo/>
    <Sectionthird/>
    </main>
  );
}