"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

type FilterButtonProps = {
  label: string;
  count?: number;
  side?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
  onApply: () => void;
  onClear: () => void;
};

export function FilterButton({
  label,
  count,
  side = "right",
  children,
  onApply,
  onClear,
}: FilterButtonProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          {label}
          {count && count > 0 ? (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-center text-xs"
            >
              {count}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Select {label}</SheetTitle>
          <SheetDescription>
            Choose options to filter your job search
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex-1 overflow-y-auto">{children}</div>

        <SheetFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClear}
            className="w-full sm:w-auto"
          >
            Clear Selection
          </Button>
          <SheetClose asChild>
            <Button onClick={onApply} className="w-full sm:w-auto">
              Apply
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
