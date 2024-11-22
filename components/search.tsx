"use client";

import { Input } from "@/components/ui/input";
import { createThrottler } from "@/lib/utils";
import { Loader2Icon, Search as SearchIcon } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  onSearch?: (searchValue: string) => void;
};

export function Search({ onSearch }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState("");
  const throttledSearch = useCallback(
    createThrottler((value: string) => {
      if (onSearch) {
        setIsLoading(true);
        onSearch(value);
      }
    }, 3000),
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsLoading(false);
    if (e.key === "Enter") {
      throttledSearch(localSearchValue);
    }
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search for a component..."
        className="w-full px-8 rounded-sm"
        value={localSearchValue}
        onChange={(e) => setLocalSearchValue(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
      {isLoading && (
        <Loader2Icon className="animate-spin absolute right-2.5 top-3 h-4 w-4 text-gray-400" />
      )}
    </div>
  );
}
