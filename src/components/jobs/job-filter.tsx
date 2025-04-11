"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EXPERIENCE_LEVELS, JOB_TYPES, LOCATION_TYPES } from "@/lib/types";

// Define types for filter props
type Domain = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

type Skill = {
  id: string;
  name: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
};

type FilterOptions = {
  search?: string;
  domains?: string[];
  skills?: string[];
  jobTypes?: string[];
  experienceLevels?: string[];
  locationTypes?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  remote?: boolean;
  postedWithin?: number; // days
};

type JobFilterProps = {
  domains: Domain[];
  skills: Skill[];
  initialFilters?: FilterOptions;
};

export function JobFilter({
  domains,
  skills,
  initialFilters = {},
}: JobFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search || "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const category = skill.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilters = { ...filters, search: searchInput };
    setFilters(updatedFilters);
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    const updatedFilters = { ...filters, [filterKey]: value };
    setFilters(updatedFilters);
  };

  const handleCheckboxToggle = (
    filterKey: string,
    value: string,
    currentValues: string[] = [],
  ) => {
    let newValues: string[];

    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    handleFilterChange(filterKey, newValues);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {};
    setFilters(clearedFilters);
    setSearchInput("");
  };

  // Count active filters for the badge
  const countActiveFilters = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.domains?.length) count++;
    if (filters.skills?.length) count++;
    if (filters.jobTypes?.length) count++;
    if (filters.experienceLevels?.length) count++;
    if (filters.locationTypes?.length) count++;
    if (filters.salaryMin || filters.salaryMax) count++;
    if (filters.remote) count++;
    if (filters.postedWithin) count++;
    return count;
  };

  const activeFilterCount = countActiveFilters();

  // Filter tags to show selected filters
  const getFilterTags = () => {
    const tags = [];

    if (filters.search) {
      tags.push({
        label: `Search: ${filters.search}`,
        onRemove: () => handleFilterChange("search", ""),
      });
    }

    if (filters.domains?.length) {
      const domainNames = domains
        .filter((d) => filters.domains?.includes(d.id))
        .map((d) => d.name);

      tags.push({
        label: `Domains: ${domainNames.join(", ")}`,
        onRemove: () => handleFilterChange("domains", []),
      });
    }

    if (filters.jobTypes?.length) {
      tags.push({
        label: `Job Types: ${filters.jobTypes.join(", ")}`,
        onRemove: () => handleFilterChange("jobTypes", []),
      });
    }

    if (filters.experienceLevels?.length) {
      tags.push({
        label: `Experience: ${filters.experienceLevels.join(", ")}`,
        onRemove: () => handleFilterChange("experienceLevels", []),
      });
    }

    if (filters.locationTypes?.length) {
      tags.push({
        label: `Location Type: ${filters.locationTypes.join(", ")}`,
        onRemove: () => handleFilterChange("locationTypes", []),
      });
    }

    if (filters.salaryMin || filters.salaryMax) {
      const salaryText =
        filters.salaryMin && filters.salaryMax
          ? `$${filters.salaryMin} - $${filters.salaryMax}`
          : filters.salaryMin
            ? `Min $${filters.salaryMin}`
            : `Max $${filters.salaryMax}`;

      tags.push({
        label: `Salary: ${salaryText}`,
        onRemove: () => {
          handleFilterChange("salaryMin", undefined);
          handleFilterChange("salaryMax", undefined);
        },
      });
    }

    if (filters.remote) {
      tags.push({
        label: "Remote Only",
        onRemove: () => handleFilterChange("remote", false),
      });
    }

    if (filters.postedWithin) {
      tags.push({
        label: `Posted within ${filters.postedWithin} days`,
        onRemove: () => handleFilterChange("postedWithin", undefined),
      });
    }

    return tags;
  };

  const filterTags = getFilterTags();

  return (
    <div className="mb-6">
      {/* Search Bar & Filter Button */}
      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
        <div className="relative flex-grow">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search jobs, skills, companies..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
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
                            checked={filters.domains?.includes(domain.id)}
                            onCheckedChange={() =>
                              handleCheckboxToggle(
                                "domains",
                                domain.id,
                                filters.domains,
                              )
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
                            checked={filters.jobTypes?.includes(type)}
                            onCheckedChange={() =>
                              handleCheckboxToggle(
                                "jobTypes",
                                type,
                                filters.jobTypes,
                              )
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
                            checked={filters.experienceLevels?.includes(level)}
                            onCheckedChange={() =>
                              handleCheckboxToggle(
                                "experienceLevels",
                                level,
                                filters.experienceLevels,
                              )
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
                            checked={filters.locationTypes?.includes(type)}
                            onCheckedChange={() =>
                              handleCheckboxToggle(
                                "locationTypes",
                                type,
                                filters.locationTypes,
                              )
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
                                  checked={filters.skills?.includes(skill.id)}
                                  onCheckedChange={() =>
                                    handleCheckboxToggle(
                                      "skills",
                                      skill.id,
                                      filters.skills,
                                    )
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
                          value={filters.salaryMin || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "salaryMin",
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
                          value={filters.salaryMax || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "salaryMax",
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
                            handleFilterChange("salaryCurrency", value)
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
                          onCheckedChange={() =>
                            handleFilterChange("postedWithin", 1)
                          }
                        />
                        <Label htmlFor="posted-1-mobile">Last 24 hours</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="posted-7-mobile"
                          checked={filters.postedWithin === 7}
                          onCheckedChange={() =>
                            handleFilterChange("postedWithin", 7)
                          }
                        />
                        <Label htmlFor="posted-7-mobile">Last 7 days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="posted-14-mobile"
                          checked={filters.postedWithin === 14}
                          onCheckedChange={() =>
                            handleFilterChange("postedWithin", 14)
                          }
                        />
                        <Label htmlFor="posted-14-mobile">Last 14 days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="posted-30-mobile"
                          checked={filters.postedWithin === 30}
                          onCheckedChange={() =>
                            handleFilterChange("postedWithin", 30)
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
                  handleClearFilters();
                  setShowMobileFilters(false);
                }}
              >
                Clear Filters
              </Button>
              <SheetClose asChild>
                <Button>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Desktop Filter Button */}
        <Button
          type="submit"
          className="hidden md:flex"
          variant={searchInput ? "default" : "outline"}
        >
          Search
        </Button>

        {/* Desktop Filters */}
        <div className="hidden items-center md:flex">
          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Domain Filter Dropdown */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                Domains
                {filters.domains?.length ? (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 text-center text-xs"
                  >
                    {filters.domains.length}
                  </Badge>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Select Domains</SheetTitle>
                <SheetDescription>
                  Choose one or more domains to filter jobs by industry
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`domain-${domain.id}`}
                      checked={filters.domains?.includes(domain.id)}
                      onCheckedChange={() =>
                        handleCheckboxToggle(
                          "domains",
                          domain.id,
                          filters.domains,
                        )
                      }
                    />
                    <Label
                      htmlFor={`domain-${domain.id}`}
                      className="flex-grow"
                    >
                      {domain.name}
                    </Label>
                  </div>
                ))}
              </div>
              <SheetFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange("domains", [])}
                  className="w-full sm:w-auto"
                >
                  Clear Selection
                </Button>
                <SheetClose asChild>
                  <Button className="w-full sm:w-auto">Apply</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Job Type Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                Job Type
                {filters.jobTypes?.length ? (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 text-center text-xs"
                  >
                    {filters.jobTypes.length}
                  </Badge>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Job Types</SheetTitle>
                <SheetDescription>
                  Select the types of employment you're looking for
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {JOB_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`job-type-${type}`}
                      checked={filters.jobTypes?.includes(type)}
                      onCheckedChange={() =>
                        handleCheckboxToggle("jobTypes", type, filters.jobTypes)
                      }
                    />
                    <Label htmlFor={`job-type-${type}`} className="flex-grow">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
              <SheetFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange("jobTypes", [])}
                  className="w-full sm:w-auto"
                >
                  Clear Selection
                </Button>
                <SheetClose asChild>
                  <Button className="w-full sm:w-auto">Apply</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Experience Level Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                Experience
                {filters.experienceLevels?.length ? (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 text-center text-xs"
                  >
                    {filters.experienceLevels.length}
                  </Badge>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Experience Levels</SheetTitle>
                <SheetDescription>
                  Select the experience levels you're looking for
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {EXPERIENCE_LEVELS.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exp-level-${level}`}
                      checked={filters.experienceLevels?.includes(level)}
                      onCheckedChange={() =>
                        handleCheckboxToggle(
                          "experienceLevels",
                          level,
                          filters.experienceLevels,
                        )
                      }
                    />
                    <Label htmlFor={`exp-level-${level}`} className="flex-grow">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
              <SheetFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange("experienceLevels", [])}
                  className="w-full sm:w-auto"
                >
                  Clear Selection
                </Button>
                <SheetClose asChild>
                  <Button className="w-full sm:w-auto">Apply</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* More Filters Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                More Filters
                {filters.skills?.length ||
                filters.locationTypes?.length ||
                filters.salaryMin ||
                filters.salaryMax ||
                filters.remote ||
                filters.postedWithin ? (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 text-center text-xs"
                  >
                    {[
                      filters.skills?.length ? 1 : 0,
                      filters.locationTypes?.length ? 1 : 0,
                      filters.salaryMin || filters.salaryMax ? 1 : 0,
                      filters.remote ? 1 : 0,
                      filters.postedWithin ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                ) : null}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Additional Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with more specific criteria
                </SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <Accordion type="multiple" className="w-full">
                  {/* Location Type Filter */}
                  <AccordionItem value="locationType">
                    <AccordionTrigger>Location Type</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-2">
                        {LOCATION_TYPES.map((type) => (
                          <div
                            key={type}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`location-type-${type}`}
                              checked={filters.locationTypes?.includes(type)}
                              onCheckedChange={() =>
                                handleCheckboxToggle(
                                  "locationTypes",
                                  type,
                                  filters.locationTypes,
                                )
                              }
                            />
                            <Label htmlFor={`location-type-${type}`}>
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Remote Only Filter */}
                  <AccordionItem value="remote">
                    <AccordionTrigger>Remote Work</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remote-only"
                          checked={filters.remote}
                          onCheckedChange={(checked) =>
                            handleFilterChange("remote", checked)
                          }
                        />
                        <Label htmlFor="remote-only">Remote jobs only</Label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Salary Range Filter */}
                  <AccordionItem value="salary">
                    <AccordionTrigger>Salary Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="salary-min">Minimum Salary</Label>
                          <Input
                            type="number"
                            id="salary-min"
                            placeholder="Min salary"
                            value={filters.salaryMin || ""}
                            onChange={(e) =>
                              handleFilterChange(
                                "salaryMin",
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="salary-max">Maximum Salary</Label>
                          <Input
                            type="number"
                            id="salary-max"
                            placeholder="Max salary"
                            value={filters.salaryMax || ""}
                            onChange={(e) =>
                              handleFilterChange(
                                "salaryMax",
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="salary-currency">Currency</Label>
                          <Select
                            value={filters.salaryCurrency || "USD"}
                            onValueChange={(value) =>
                              handleFilterChange("salaryCurrency", value)
                            }
                          >
                            <SelectTrigger id="salary-currency">
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
                            id="posted-1"
                            checked={filters.postedWithin === 1}
                            onCheckedChange={() =>
                              handleFilterChange("postedWithin", 1)
                            }
                          />
                          <Label htmlFor="posted-1">Last 24 hours</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="posted-7"
                            checked={filters.postedWithin === 7}
                            onCheckedChange={() =>
                              handleFilterChange("postedWithin", 7)
                            }
                          />
                          <Label htmlFor="posted-7">Last 7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="posted-14"
                            checked={filters.postedWithin === 14}
                            onCheckedChange={() =>
                              handleFilterChange("postedWithin", 14)
                            }
                          />
                          <Label htmlFor="posted-14">Last 14 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="posted-30"
                            checked={filters.postedWithin === 30}
                            onCheckedChange={() =>
                              handleFilterChange("postedWithin", 30)
                            }
                          />
                          <Label htmlFor="posted-30">Last 30 days</Label>
                        </div>
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
                                    id={`skill-${skill.id}`}
                                    checked={filters.skills?.includes(skill.id)}
                                    onCheckedChange={() =>
                                      handleCheckboxToggle(
                                        "skills",
                                        skill.id,
                                        filters.skills,
                                      )
                                    }
                                  />
                                  <Label htmlFor={`skill-${skill.id}`}>
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
                </Accordion>
              </div>

              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto"
                >
                  Clear All Filters
                </Button>
                <SheetClose asChild>
                  <Button className="w-full sm:w-auto">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Submit button for mobile */}
        <Button type="submit" className="md:hidden">
          Search
        </Button>
      </form>

      {/* Active Filters Display */}
      {filterTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">Active filters:</span>
          {filterTags.map((tag, index) => (
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
            onClick={handleClearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
