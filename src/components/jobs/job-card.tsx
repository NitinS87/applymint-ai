"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building, Bookmark, ExternalLink, Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/constants";
import { formatRelativeDate, formatSalaryRange, truncateText } from "@/lib/utils";
import type { JobCardProps } from "@/lib/types";

export function JobCard({ job, onApply, isSaved, onSave, onUnsave }: JobCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleApplyClick = () => {
    onApply(job.id);
  };
  
  const handleBookmarkClick = () => {
    if (isSaved) {
      onUnsave?.(job.id);
    } else {
      onSave?.(job.id);
    }
  };
  
  return (
    <Card 
      className="flex h-full flex-col transition-shadow hover:shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {job.company.logo ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-background">
              <Image
                src={job.company.logo}
                alt={job.company.name}
                fill
                className="object-contain p-1"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-primary/10">
              <Building className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <Link 
              href={ROUTES.JOB_DETAILS(job.id)} 
              className="inline-block hover:text-primary hover:underline"
            >
              <h3 className="font-medium">{job.title}</h3>
            </Link>
            <Link 
              href={ROUTES.COMPANY_DETAILS(job.companyId)}
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              {job.company.name}
            </Link>
          </div>
        </div>
        
        {(onSave || onUnsave) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleBookmarkClick}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
            <span className="sr-only">{isSaved ? "Unsave" : "Save"} job</span>
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="mb-4 text-sm text-muted-foreground">
          {truncateText(job.description, 140)}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {job.jobType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.experienceLevel}
          </Badge>
          {job.locationType && (
            <Badge variant="outline" className="text-xs">
              {job.locationType}
            </Badge>
          )}
          {job.domains && job.domains.slice(0, 2).map((domain) => (
            <Badge key={domain.id} variant="outline" className="text-xs">
              {domain.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <div className="px-6 pb-2">
        <Separator />
      </div>
      
      <CardFooter className="flex-col items-start pt-2">
        <div className="mb-3 flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
          {(job.salary || job.salaryMax) && (
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">
                {formatSalaryRange(job.salary, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatRelativeDate(job.postedDate)}</span>
            
            {job.location && (
              <>
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
              </>
            )}
          </div>
        </div>
        
        <Button 
          className="w-full gap-1" 
          size="sm"
          onClick={handleApplyClick}
        >
          Apply Now
          <ExternalLink className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}