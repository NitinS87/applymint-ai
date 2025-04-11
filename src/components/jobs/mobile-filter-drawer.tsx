"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPERIENCE_LEVELS, JOB_TYPES, LOCATION_TYPES } from "@/lib/types";
import type { Domain, Skill } from "@/lib/types";
import type { FilterOptions } from "./job-filter";

type MobileFilterDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  domains: Domain[];
  skills: Skill[];
  skillsByCategory: Record<string, Skill[]>;
  activeFilterCount: number;
  onFilterChange: (key: string, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
};

export function MobileFilterDrawer({
  open,
  onOpenChange,
  filters,
  domains,
  skills,
  skillsByCategory,
  activeFilterCount,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: MobileFilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex gap-2 md:hidden">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-center text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Jobs</SheetTitle>
          <SheetDescription>
            Narrow down your job search with specific criteria
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <Accordion type="multiple" className="w-full">
            {/* Domains Filter */}
            <AccordionItem value="domains">
              <AccordionTrigger>Domains</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`domain-${domain.id}-mobile`}
                        checked={filters.domain === domain.id || filters.domain === domain.name}
                        onCheckedChange={(checked) =>
                          onFilterChange("domain", checked ? domain.id : undefined)
                        }
                      />
                      <Label htmlFor={`domain-${domain.id}-mobile`}>
                        {domain.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Job Types Filter */}
            <AccordionItem value="jobTypes">
              <AccordionTrigger>Job Types</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2">
                  {JOB_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`job-type-${type}-mobile`}
                        checked={filters.jobType === type}
                        onCheckedChange={(checked) =>
                          onFilterChange("jobType", checked ? type : undefined)
                        }
                      />
                      <Label htmlFor={`job-type-${type}-mobile`}>
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Experience Levels Filter */}
            <AccordionItem value="experienceLevels">
              <AccordionTrigger>Experience Level</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <div
                      key={level}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`exp-level-${level}-mobile`}
                        checked={filters.experienceLevel === level}
                        onCheckedChange={(checked) =>
                          onFilterChange("experienceLevel", checked ? level : undefined)
                        }
                      />
                      <Label htmlFor={`exp-level-${level}-mobile`}>
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Location Types Filter */}
            <AccordionItem value="locationTypes">
              <AccordionTrigger>Location Type</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2">
                  {LOCATION_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-type-${type}-mobile`}
                        checked={filters.locationType === type}
                        onCheckedChange={(checked) =>
                          onFilterChange("locationType", checked ? type : undefined)
                        }
                      />
                      <Label htmlFor={`location-type-${type}-mobile`}>
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Skills Filter */}
            <AccordionItem value="skills">
              <AccordionTrigger>Skills</AccordionTrigger>
              <AccordionContent>
                {Object.entries(skillsByCategory).map(
                  ([category, categorySkills]) => (
                    <div key={category} className="mb-4">
                      <h4 className="mb-2 text-sm font-medium">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {categorySkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`skill-${skill.id}-mobile`}
                              checked={filters.skill === skill.id || filters.skill === skill.name}
                              onCheckedChange={(checked) =>
                                onFilterChange("skill", checked ? skill.id : undefined)
                              }
                            />
                            <Label htmlFor={`skill-${skill.id}-mobile`}>
                              {skill.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Salary Range Filter */}
            <AccordionItem value="salary">
              <AccordionTrigger>Salary Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="salary-min-mobile">
                      Minimum Salary
                    </Label>
                    <Input
                      type="number"
                      id="salary-min-mobile"
                      placeholder="Min salary"
                      value={filters.minSalary || ""}
                      onChange={(e) =>
                        onFilterChange(
                          "minSalary",
                          e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary-max-mobile">
                      Maximum Salary
                    </Label>
                    <Input
                      type="number"
                      id="salary-max-mobile"
                      placeholder="Max salary"
                      value={filters.maxSalary || ""}
                      onChange={(e) =>
                        onFilterChange(
                          "maxSalary",
                          e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary-currency-mobile">Currency</Label>
                    <Select
                      value={filters.salaryCurrency || "USD"}
                      onValueChange={(value) =>
                        onFilterChange("salaryCurrency", value)
                      }
                    >
                      <SelectTrigger id="salary-currency-mobile">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Posted Within Filter */}
            <AccordionItem value="postedWithin">
              <AccordionTrigger>Posted Within</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="posted-1-mobile"
                      checked={filters.postedWithin === 1}
                      onCheckedChange={(checked) =>
                        onFilterChange("postedWithin", checked ? 1 : undefined)
                      }
                    />
                    <Label htmlFor="posted-1-mobile">Last 24 hours</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="posted-7-mobile"
                      checked={filters.postedWithin === 7}
                      onCheckedChange={(checked) =>
                        onFilterChange("postedWithin", checked ? 7 : undefined)
                      }
                    />
                    <Label htmlFor="posted-7-mobile">Last 7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="posted-14-mobile"
                      checked={filters.postedWithin === 14}
                      onCheckedChange={(checked) =>
                        onFilterChange("postedWithin", checked ? 14 : undefined)
                      }
                    />
                    <Label htmlFor="posted-14-mobile">Last 14 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="posted-30-mobile"
                      checked={filters.postedWithin === 30}
                      onCheckedChange={(checked) =>
                        onFilterChange("postedWithin", checked ? 30 : undefined)
                      }
                    />
                    <Label htmlFor="posted-30-mobile">Last 30 days</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <SheetFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => {
              onClearFilters();
              onOpenChange(false);
            }}
          >
            Clear Filters
          </Button>
          <SheetClose asChild>
            <Button onClick={onApplyFilters}>Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}