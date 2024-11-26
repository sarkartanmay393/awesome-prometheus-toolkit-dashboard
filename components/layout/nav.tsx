import Image from "next/image";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import CONSTANTS from "@/lib/constants";

export default function Navbar() {
  return (
    <nav className="border-b bg-white max-h-[72px]">
      <div className="container flex items-end justify-between h-full">
        <div className="flex items-center">
          <Image src={"/logo.svg"} alt={""} width={123} height={72} />
        </div>
        <Link href={CONSTANTS.Github_Repo} target="_blank">
          <div className="flex items-center gap-2 mb-2">
            <SiGithub width={20} height={20} opacity={60} />
            <span className="text-sm text-slate-500">125 stars</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
