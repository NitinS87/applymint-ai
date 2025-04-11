"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="relative flex-grow">
        <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search jobs, skills, companies..."
          className="pl-9"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      
      <Button
        type="submit"
        className="hidden md:flex"
        variant={value ? "default" : "outline"}
      >
        Search
      </Button>
      
      <Button type="submit" className="md:hidden">
        Search
      </Button>
    </form>
  );
}