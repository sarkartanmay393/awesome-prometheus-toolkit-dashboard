"use client";

import { GlobalContext } from "@/app/context";
import { Input } from "@/components/ui/input";
import { createThrottler } from "@/lib/utils";
import { Loader2Icon, Search as SearchIcon, SlashIcon } from "lucide-react";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";

type Props = {
  onSearch?: (searchValue: string) => void;
};

export function Search({ onSearch }: Props) {
  const searchInput = useRef<HTMLInputElement>(null);
  const { searchLoading } = useContext(GlobalContext);
  const [localSearchValue, setLocalSearchValue] = useState("");
  const throttledSearch = useCallback(
    createThrottler((value: string) => {
      if (onSearch) {
        onSearch(value);
      }
    }, 3000),
    [onSearch]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      throttledSearch(localSearchValue);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchValue(e.currentTarget.value);
    // if (!e.target.value.trim()) {
    // throttledSearch('');
    // }
  };

  useEffect(() => {
    if (document && searchInput.current) {
      document.onkeydown = (e) => {
        if (
          e.code === "Slash" &&
          e.key === "/" &&
          document.activeElement !== searchInput.current
        ) {
          searchInput.current?.focus();
          e.preventDefault();
        }
      };
    }
  }, []);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-400" />
      <Input
        ref={searchInput}
        placeholder="Search for a component..."
        className="w-full px-8 pr-12 rounded-sm text-xs"
        value={localSearchValue}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      {searchLoading ? (
        <Loader2Icon className="animate-spin absolute right-2.5 top-3 h-4 w-4 text-slate-500" />
      ) : (
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 absolute right-2.5 top-2 text-slate-500 bg-slate-100"
        >
          /
        </Button>
      )}
    </div>
  );
}
