import Image from "next/image";
import { siGithub } from "simple-icons";
import SVGWrapper from "./svg-wrapper";

export default function Navbar() {
  return (
    // px-6 py-3
    <nav className="border-b bg-white max-h-[72px]">
      <div className="flex items-end justify-between h-full">
        <div className="flex items-center">
          <Image src={"/logo.svg"} alt={""} width={123} height={72} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <SVGWrapper svgCode={siGithub.svg} alt={""} width={20} height={20} />
          <span className="text-sm text-slate-500">125 stars</span>
        </div>
      </div>
    </nav>
  );
}
