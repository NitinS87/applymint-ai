"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  MoreVertical,
  Trash,
  Eye,
  EyeOff,
  ImageIcon,
  Share,
  Download,
} from "lucide-react";
import { SocialMediaImageGenerator } from "@/components/admin/jobs/social-media-image-generator";

interface AdminJobsTableProps {
  jobs: Job[];
}

export function AdminJobsTable({ jobs }: AdminJobsTableProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  const handleGenerateImage = (job: Job) => {
    setSelectedJob(job);
    setShowImageGenerator(true);
  };

  const closeImageGenerator = () => {
    setShowImageGenerator(false);
    setSelectedJob(null);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Social Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-24 text-center"
                >
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <Link href={`/jobs/${job.id}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell>{job.company.name}</TableCell>
                  <TableCell>
                    {format(new Date(job.postedDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.isActive ? "default" : "secondary"}>
                      {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.applications.length}</TableCell>
                  <TableCell>
                    {job.imageUrl ? (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={job.imageUrl} target="_blank">
                          <ImageIcon className="h-4 w-4 text-green-500" />
                        </Link>
                      </Button>
                    ) : (
                      <ImageIcon className="text-muted-foreground h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/jobs/${job.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/jobs/${job.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleGenerateImage(job)}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Generate Social Image
                        </DropdownMenuItem>
                        {job.imageUrl && (
                          <DropdownMenuItem asChild>
                            <Link href={job.imageUrl} target="_blank" download>
                              <Download className="mr-2 h-4 w-4" />
                              Download Image
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showImageGenerator} onOpenChange={setShowImageGenerator}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generate Social Media Image</DialogTitle>
            <DialogDescription>
              Create a shareable image for Instagram and other social media
              platforms.
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <SocialMediaImageGenerator
              job={selectedJob}
              onClose={closeImageGenerator}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
