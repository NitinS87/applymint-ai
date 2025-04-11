"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
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

import { SearchBar } from "./search-bar";
import { ActiveFilterTags } from "./active-filter-tags";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { FilterButton } from "./filter-button";

/**
 * Types for filter options and filter props
 */
export type FilterOptions = {
  search?: string;
  domain?: string;
  skill?: string;
  jobType?: string;
  experienceLevel?: string;
  locationType?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: string;
  remote?: boolean;
  postedWithin?: number; // days
  sortBy?: string;
  sortDir?: string;
};

export type FilterTag = {
  label: string;
  onRemove: () => void;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions>(() => {
    // Initialize filters from URL search params
    const params: FilterOptions = {};
    if (searchParams.has('search')) params.search = searchParams.get('search') || undefined;
    if (searchParams.has('domain')) params.domain = searchParams.get('domain') || undefined;
    if (searchParams.has('skill')) params.skill = searchParams.get('skill') || undefined;
    if (searchParams.has('jobType')) params.jobType = searchParams.get('jobType') || undefined;
    if (searchParams.has('experienceLevel')) params.experienceLevel = searchParams.get('experienceLevel') || undefined;
    if (searchParams.has('locationType')) params.locationType = searchParams.get('locationType') || undefined;
    if (searchParams.has('minSalary')) params.minSalary = Number(searchParams.get('minSalary'));
    if (searchParams.has('maxSalary')) params.maxSalary = Number(searchParams.get('maxSalary'));
    if (searchParams.has('sortBy')) params.sortBy = searchParams.get('sortBy') || undefined;
    if (searchParams.has('sortDir')) params.sortDir = searchParams.get('sortDir') || undefined;
    
    return { ...params, ...initialFilters };
  });
  
  const [searchInput, setSearchInput] = useState(filters.search || "");
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

  // Apply filters to URL and navigate
  const applyFilters = (updatedFilters: FilterOptions) => {
    const params = new URLSearchParams();
    
    // Add all non-empty filters to the URL
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.set(key, String(value));
      }
    });

    // Always keep the current page if it exists
    if (searchParams.has('page')) {
      params.set('page', '1'); // Reset to page 1 when filters change
    }
    
    // Navigate to the new URL with filters
    router.push(`/jobs?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilters = { ...filters, search: searchInput };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    const updatedFilters = { ...filters, [filterKey]: value };
    setFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    applyFilters(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {};
    setFilters(clearedFilters);
    setSearchInput("");
    router.push('/jobs');
  };

  // Count active filters for the badge
  const countActiveFilters = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.domain) count++;
    if (filters.skill) count++;
    if (filters.jobType) count++;
    if (filters.experienceLevel) count++;
    if (filters.locationType) count++;
    if (filters.minSalary || filters.maxSalary) count++;
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
        onRemove: () => {
          const updated = { ...filters, search: undefined };
          setFilters(updated);
          setSearchInput("");
          applyFilters(updated);
        },
      });
    }

    if (filters.domain) {
      const domain = domains.find(d => d.id === filters.domain || d.name === filters.domain);
      if (domain) {
        tags.push({
          label: `Domain: ${domain.name}`,
          onRemove: () => {
            const updated = { ...filters, domain: undefined };
            setFilters(updated);
            applyFilters(updated);
          },
        });
      }
    }

    if (filters.skill) {
      const skill = skills.find(s => s.id === filters.skill || s.name === filters.skill);
      if (skill) {
        tags.push({
          label: `Skill: ${skill.name}`,
          onRemove: () => {
            const updated = { ...filters, skill: undefined };
            setFilters(updated);
            applyFilters(updated);
          },
        });
      }
    }

    if (filters.jobType) {
      tags.push({
        label: `Job Type: ${filters.jobType}`,
        onRemove: () => {
          const updated = { ...filters, jobType: undefined };
          setFilters(updated);
          applyFilters(updated);
        },
      });
    }

    if (filters.experienceLevel) {
      tags.push({
        label: `Experience: ${filters.experienceLevel}`,
        onRemove: () => {
          const updated = { ...filters, experienceLevel: undefined };
          setFilters(updated);
          applyFilters(updated);
        },
      });
    }

    if (filters.locationType) {
      tags.push({
        label: `Location Type: ${filters.locationType}`,
        onRemove: () => {
          const updated = { ...filters, locationType: undefined };
          setFilters(updated);
          applyFilters(updated);
        },
      });
    }

    if (filters.minSalary || filters.maxSalary) {
      const salaryText =
        filters.minSalary && filters.maxSalary
          ? `$${filters.minSalary} - $${filters.maxSalary}`
          : filters.minSalary
            ? `Min $${filters.minSalary}`
            : `Max $${filters.maxSalary}`;

      tags.push({
        label: `Salary: ${salaryText}`,
        onRemove: () => {
          const updated = { ...filters, minSalary: undefined, maxSalary: undefined };
          setFilters(updated);
          applyFilters(updated);
        },
      });
    }

    if (filters.remote) {
      tags.push({
        label: "Remote Only",
        onRemove: () => {
          const updated = { ...filters, remote: undefined };
          setFilters(updated);
          applyFilters(updated);
        },
      });
    }

    if (filters.postedWithin) {
      tags.push({
        label: `Posted within ${filters.postedWithin} days`,
        onRemove: () => {
          const updated = { ...filters, postedWithin: undefined };
          setFilters(updated);
          applyFilters(updated);
        },
      });
    }

    return tags;
  };

  const filterTags = getFilterTags();

  // Render each filter group for desktop
  const renderDomainFilter = () => (
    <div className="grid grid-cols-1 gap-3">
      {domains.map((domain) => (
        <div key={domain.id} className="flex items-center space-x-2">
          <Checkbox
            id={`domain-${domain.id}`}
            checked={filters.domain === domain.id || filters.domain === domain.name}
            onCheckedChange={(checked) =>
              handleFilterChange("domain", checked ? domain.id : undefined)
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
  );

  const renderJobTypeFilter = () => (
    <div className="grid grid-cols-1 gap-3">
      {JOB_TYPES.map((type) => (
        <div key={type} className="flex items-center space-x-2">
          <Checkbox
            id={`job-type-${type}`}
            checked={filters.jobType === type}
            onCheckedChange={(checked) =>
              handleFilterChange("jobType", checked ? type : undefined)
            }
          />
          <Label htmlFor={`job-type-${type}`} className="flex-grow">
            {type}
          </Label>
        </div>
      ))}
    </div>
  );

  const renderExperienceLevelFilter = () => (
    <div className="grid grid-cols-1 gap-3">
      {EXPERIENCE_LEVELS.map((level) => (
        <div key={level} className="flex items-center space-x-2">
          <Checkbox
            id={`exp-level-${level}`}
            checked={filters.experienceLevel === level}
            onCheckedChange={(checked) =>
              handleFilterChange("experienceLevel", checked ? level : undefined)
            }
          />
          <Label htmlFor={`exp-level-${level}`} className="flex-grow">
            {level}
          </Label>
        </div>
      ))}
    </div>
  );

  const renderMoreFilters = () => (
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
                  checked={filters.locationType === type}
                  onCheckedChange={(checked) =>
                    handleFilterChange("locationType", checked ? type : undefined)
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
                handleFilterChange("remote", checked || undefined)
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
                value={filters.minSalary || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minSalary",
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
                value={filters.maxSalary || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxSalary",
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
                onCheckedChange={(checked) =>
                  handleFilterChange("postedWithin", checked ? 1 : undefined)
                }
              />
              <Label htmlFor="posted-1">Last 24 hours</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="posted-7"
                checked={filters.postedWithin === 7}
                onCheckedChange={(checked) =>
                  handleFilterChange("postedWithin", checked ? 7 : undefined)
                }
              />
              <Label htmlFor="posted-7">Last 7 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="posted-14"
                checked={filters.postedWithin === 14}
                onCheckedChange={(checked) =>
                  handleFilterChange("postedWithin", checked ? 14 : undefined)
                }
              />
              <Label htmlFor="posted-14">Last 14 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="posted-30"
                checked={filters.postedWithin === 30}
                onCheckedChange={(checked) =>
                  handleFilterChange("postedWithin", checked ? 30 : undefined)
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
                        checked={filters.skill === skill.id || filters.skill === skill.name}
                        onCheckedChange={(checked) =>
                          handleFilterChange("skill", checked ? skill.id : undefined)
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
  );

  const countMoreFilters = () => {
    return [
      filters.skill ? 1 : 0,
      filters.locationType ? 1 : 0,
      filters.minSalary || filters.maxSalary ? 1 : 0,
      filters.remote ? 1 : 0,
      filters.postedWithin ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
  };

  return (
    <div className="mb-6">
      <div className="mb-4 flex gap-2">
        {/* Search Bar */}
        <div className="flex-grow">
          <SearchBar 
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearchSubmit}
          />
        </div>

        {/* Mobile Filter Button */}
        <MobileFilterDrawer
          open={showMobileFilters}
          onOpenChange={setShowMobileFilters}
          filters={filters}
          domains={domains}
          skills={skills}
          skillsByCategory={skillsByCategory}
          activeFilterCount={activeFilterCount}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Desktop Filters */}
        <div className="hidden items-center md:flex">
          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Domain Filter */}
          <FilterButton
            label="Domains"
            count={filters.domain ? 1 : 0}
            onApply={handleApplyFilters}
            onClear={() => handleFilterChange("domain", undefined)}
          >
            {renderDomainFilter()}
          </FilterButton>

          {/* Job Type Filter */}
          <FilterButton
            label="Job Type"
            count={filters.jobType ? 1 : 0}
            onApply={handleApplyFilters}
            onClear={() => handleFilterChange("jobType", undefined)}
          >
            {renderJobTypeFilter()}
          </FilterButton>

          {/* Experience Level Filter */}
          <FilterButton
            label="Experience"
            count={filters.experienceLevel ? 1 : 0}
            onApply={handleApplyFilters}
            onClear={() => handleFilterChange("experienceLevel", undefined)}
          >
            {renderExperienceLevelFilter()}
          </FilterButton>

          {/* More Filters */}
          <FilterButton
            label="More Filters"
            count={countMoreFilters()}
            side="right"
            onApply={handleApplyFilters}
            onClear={() => {
              handleFilterChange("skill", undefined);
              handleFilterChange("locationType", undefined);
              handleFilterChange("minSalary", undefined);
              handleFilterChange("maxSalary", undefined);
              handleFilterChange("remote", undefined);
              handleFilterChange("postedWithin", undefined);
            }}
          >
            {renderMoreFilters()}
          </FilterButton>
        </div>
      </div>

      {/* Active Filters Display */}
      <ActiveFilterTags
        tags={filterTags}
        onClearAll={handleClearFilters}
      />
    </div>
  );
}
