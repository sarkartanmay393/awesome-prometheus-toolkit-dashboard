import Link from "next/link";
import SVGWrapper from "./svg-wrapper";
import GetLast9Logo from "@/assets/getLast9Icon";
import { GITHUB_REPO } from "@/lib/constants";

export default function Bottom() {
  return (
    <footer className="w-full flex flex-col items-center justify-center font-thin border-t h-[56px]">
      <div className="w-full flex justify-between items-center text-slate-400 gap-0.5">
        <Link href={GITHUB_REPO} target="_blank">
          <p className="text-[12px] font-[500] whitespace-nowrap overflow-hidden text-ellipsis">Contribute on GitHub</p>
        </Link>
        <div className="flex items-center gap-2 text-[12px] font-[500]">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis">Maintained by Last9</p>
          <SVGWrapper svgCode={GetLast9Logo()} width={20} height={20} />
        </div>
      </div>
    </footer>
  );
}
