"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FilterTag } from "./job-filter";

type ActiveFilterTagsProps = {
  tags: FilterTag[];
  onClearAll: () => void;
};

export function ActiveFilterTags({ tags, onClearAll }: ActiveFilterTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Active filters:</span>
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          {tag.label}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-secondary hover:text-foreground ml-1 h-4 w-4 rounded-full p-0"
            onClick={tag.onRemove}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground h-7 text-xs"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  );
}