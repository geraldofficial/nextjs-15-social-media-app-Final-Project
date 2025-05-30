"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

export default function SearchField() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 400);

  // Live search as you type (debounced)
  useEffect(() => {
    if (debouncedQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedQ)}`);
    }
  }, [debouncedQ, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input
          name="q"
          placeholder="Search"
          className="pe-10"
          autoFocus
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
