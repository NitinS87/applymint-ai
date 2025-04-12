"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Company,
  Domain,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  LOCATION_TYPES,
  SALARY_PERIOD,
  Skill,
} from "@/lib/types";
import { createJob } from "@/lib/services/job-actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon, CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

// The schema for our job form
const jobFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Job title must be at least 3 characters" }),
  companyId: z.string({ required_error: "Please select a company" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  preferredSkills: z.string().optional(),
  location: z.string().optional(),
  locationType: z.string({ required_error: "Please select location type" }),
  salary: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  salaryCurrency: z
    .string({ required_error: "Please select currency" })
    .default("USD"),
  salaryPeriod: z.string({ required_error: "Please select salary period" }),
  jobType: z.string({ required_error: "Please select job type" }),
  experienceLevel: z.string({
    required_error: "Please select experience level",
  }),
  applicationLink: z.string().url({ message: "Please enter a valid URL" }),
  applicationDeadline: z.date().optional(),
  domains: z
    .array(z.string())
    .min(1, { message: "Please select at least one domain" }),
  subdomains: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

// Infer the type from our schema
type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  companies: Company[];
  domains: Domain[];
  skills: Skill[];
  initialData?: JobFormValues;
}

export function JobForm({
  companies,
  domains,
  skills,
  initialData,
}: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabsValue, setTabsValue] = useState("basic");

  // Initialize the form with default values or provided initial data
  const form = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialData || {
      title: "",
      companyId: "",
      description: "",
      responsibilities: "",
      requirements: "",
      preferredSkills: "",
      location: "",
      locationType: "On-site",
      salary: undefined,
      salaryMax: undefined,
      salaryCurrency: "USD",
      salaryPeriod: "YEARLY",
      jobType: "Full-time",
      experienceLevel: "Mid",
      applicationLink: "",
      domains: [],
      subdomains: [],
      skills: [],
      isActive: true,
    },
  });

  // State for multi-select controls
  const [openCompany, setOpenCompany] = useState(false);
  const [openDomain, setOpenDomain] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);

  // Form submission handler
  async function onSubmit(values: JobFormValues) {
    setIsSubmitting(true);
    try {
      await createJob(values);
      router.push(`/admin/jobs`);
      router.refresh();
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Get selected domains to filter subdomains
  const selectedDomainIds = form.watch("domains");
  const selectedDomains = domains.filter((domain) =>
    selectedDomainIds.includes(domain.id),
  );

  // Filter subdomains based on selected domains
  const availableSubdomains = selectedDomains.flatMap(
    (domain) => domain.subdomains || [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
        <CardDescription>
          Enter the details for the new job listing. All fields marked with *
          are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs
              defaultValue="basic"
              className="w-full"
              value={tabsValue}
              onValueChange={setTabsValue}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="details">Job Details</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="classification">Classification</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Senior Frontend Developer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Company *</FormLabel>
                      <Popover open={openCompany} onOpenChange={setOpenCompany}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCompany}
                              className="w-full justify-between"
                            >
                              {field.value
                                ? companies.find(
                                    (company) => company.id === field.value,
                                  )?.name
                                : "Select company..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search company..."
                              className="h-9"
                            />
                            <CommandEmpty>No company found.</CommandEmpty>
                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                              {companies.map((company) => (
                                <CommandItem
                                  key={company.id}
                                  value={company.id}
                                  onSelect={() => {
                                    form.setValue("companyId", company.id);
                                    setOpenCompany(false);
                                  }}
                                >
                                  {company.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      company.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. San Francisco, CA"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LOCATION_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {JOB_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXPERIENCE_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Minimum Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 50000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Maximum Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 80000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="salaryCurrency"
                      render={({ field }) => (
                        <FormItem className="w-[120px]">
                          <FormLabel>Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="CAD">CAD</SelectItem>
                              <SelectItem value="AUD">AUD</SelectItem>
                              <SelectItem value="INR">INR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salaryPeriod"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Salary Period *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SALARY_PERIOD.map((period) => (
                                <SelectItem key={period} value={period}>
                                  {period.charAt(0) +
                                    period.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicationLink"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Application Link *</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          The official link where candidates can apply for this
                          job
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="applicationDeadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>No deadline</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Leave blank if there is no application deadline
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Publish this job immediately</FormLabel>
                        <FormDescription>
                          When checked, the job will be visible on the platform
                          as soon as it is created
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Job Details Tab */}
              <TabsContent value="details" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a detailed description of the job..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a comprehensive overview of the job position
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List the key responsibilities of this role..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include day-to-day tasks and responsibilities
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Requirements Tab */}
              <TabsContent value="requirements" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the essential requirements for this role..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify the qualifications, education, and experience
                        needed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Skills & Qualifications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any preferred skills or qualifications..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include nice-to-have skills and qualifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technical Skills</FormLabel>
                      <Popover open={openSkill} onOpenChange={setOpenSkill}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openSkill}
                              className="w-full justify-between"
                            >
                              {field.value?.length
                                ? `${field.value.length} skills selected`
                                : "Select skills..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search skills..."
                              className="h-9"
                            />
                            <CommandEmpty>No skill found.</CommandEmpty>
                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                              {skills.map((skill) => (
                                <CommandItem
                                  key={skill.id}
                                  value={skill.name}
                                  onSelect={() => {
                                    const currentValues = field.value || [];
                                    const newValues = currentValues.includes(
                                      skill.id,
                                    )
                                      ? currentValues.filter(
                                          (id) => id !== skill.id,
                                        )
                                      : [...currentValues, skill.id];
                                    form.setValue("skills", newValues);
                                  }}
                                >
                                  <Checkbox
                                    checked={field.value?.includes(skill.id)}
                                    className="mr-2"
                                  />
                                  {skill.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select all relevant technical skills for this position
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Classification Tab */}
              <TabsContent value="classification" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="domains"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domains/Industries *</FormLabel>
                      <Popover open={openDomain} onOpenChange={setOpenDomain}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openDomain}
                              className="w-full justify-between"
                            >
                              {field.value?.length
                                ? `${field.value.length} domains selected`
                                : "Select domains..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search domains..."
                              className="h-9"
                            />
                            <CommandEmpty>No domain found.</CommandEmpty>
                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                              {domains.map((domain) => (
                                <CommandItem
                                  key={domain.id}
                                  value={domain.name}
                                  onSelect={() => {
                                    const currentValues = field.value || [];
                                    const newValues = currentValues.includes(
                                      domain.id,
                                    )
                                      ? currentValues.filter(
                                          (id) => id !== domain.id,
                                        )
                                      : [...currentValues, domain.id];
                                    form.setValue("domains", newValues);
                                  }}
                                >
                                  <Checkbox
                                    checked={field.value?.includes(domain.id)}
                                    className="mr-2"
                                  />
                                  {domain.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select all relevant domains for this job
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {availableSubdomains.length > 0 && (
                  <FormField
                    control={form.control}
                    name="subdomains"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subdomains/Specializations</FormLabel>
                        <div className="space-y-2">
                          {availableSubdomains.map((subdomain) => (
                            <div
                              key={subdomain.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                checked={field.value?.includes(subdomain.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  const newValues = checked
                                    ? [...currentValues, subdomain.id]
                                    : currentValues.filter(
                                        (id) => id !== subdomain.id,
                                      );
                                  form.setValue("subdomains", newValues);
                                }}
                                id={`subdomain-${subdomain.id}`}
                              />
                              <label
                                htmlFor={`subdomain-${subdomain.id}`}
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {subdomain.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormDescription>
                          Select relevant specializations within the selected
                          domains
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              {tabsValue === "classification" ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Job"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    const nextTab =
                      tabsValue === "basic"
                        ? "details"
                        : tabsValue === "details"
                          ? "requirements"
                          : "classification";
                    setTabsValue(nextTab);
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
