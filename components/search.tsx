"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  searchValue: string;
  onChange: Dispatch<SetStateAction<string>>;
}

export function Search({ searchValue, onChange }: Props) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search for a component..."
        className="w-full pl-8 rounded-sm"
        value={searchValue}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
}