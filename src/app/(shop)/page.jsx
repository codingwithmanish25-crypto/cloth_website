import SectionFirst from "@/components/homepage/sectionfirst";
import Sectiontwo from "@/components/homepage/sectiontwo";
import SectionFourth from "../../components/homepage/sectionfourth";
import Sectionthird from "@/components/homepage/sectionthird";
import SectionFifth from "@/components/homepage/sectionFifth";

export default function Home() {
  return (
    <main className="w-full bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      <SectionFirst />
      <Sectiontwo />
      <SectionFourth />
      <Sectionthird />
      <SectionFifth />
    </main>
  );
}
