"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  onSearch?: (searchValue: string) => void;
}

export function Search({ onSearch }: Props) {
  const [localSearchValue, setLocalSearchValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch && onSearch(localSearchValue);
    }
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search for a component..."
        className="w-full pl-8 rounded-sm"
        value={localSearchValue}
        onChange={(e) => setLocalSearchValue(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}