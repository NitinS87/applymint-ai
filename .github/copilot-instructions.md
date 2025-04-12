# ApplyMint AI - Coding Style Guide & Project Information

## Project Overview
ApplyMint AI is a job search platform that connects users to employment opportunities in their domain by providing links to official application pages on company career websites. The platform offers advanced filtering, job recommendations, and features for admins to post job listings with social media integration.

## Technology Stack

### Frontend
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API and React Query for server state

### Backend
- **Runtime**: Node.js via Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk with OAuth providers
- **File Storage**: Vercel Blob Storage for image uploads

### Infrastructure
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics

## Coding Conventions

### General
- Use TypeScript for all files
- Maintain consistent file and folder naming
- Prefer functional components over class components
- Use named exports instead of default exports when possible
- Prefer types over interfaces for better consistency and union support

### File Structure
```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── (auth)/           # Authentication routes
│   ├── admin/            # Admin panel routes
│   ├── jobs/             # Job listing routes
│   └── profile/          # User profile routes
├── components/           # Reusable components
│   ├── ui/               # UI components from shadcn
│   ├── forms/            # Form components
│   └── jobs/             # Job-related components
├── lib/                  # Utility functions and shared code
│   ├── utils.ts          # General utilities
│   ├── types.ts          # TypeScript types
│   └── constants.ts      # Constants used across the app
├── hooks/                # Custom React hooks
└── middleware.ts         # Next.js middleware for authentication and routing
prisma/                   # Prisma schema and migrations
public/                   # Static assets
```

### Naming Conventions
- **Files and Folders**: Use kebab-case for files and folders (e.g., `job-card.tsx`)
- **Components**: Use PascalCase for component names (e.g., `JobCard`)
- **Functions**: Use camelCase for function names (e.g., `fetchJobDetails`)
- **Variables**: Use camelCase for variable names (e.g., `jobData`)
- **Types/Interfaces**: Use PascalCase with a descriptive name (e.g., `JobListing`)
- **Constants**: Use UPPER_SNAKE_CASE for global constants (e.g., `MAX_JOBS_PER_PAGE`)

### Component Structure
```tsx
// Import statements
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { JobListing } from '@/lib/types'

// Props type definition
type JobCardProps = {
  job: JobListing
}

// Component definition
export function JobCard({ job }: JobCardProps) {
  // State hooks
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Event handlers
  const handleApplyClick = () => {
    // Logic for applying to the job will go here
  }
  
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded)
  }
  
  // Rendering
  return (
    <div className="rounded-lg border p-4">
      {/* Component content */}
    </div>
  )
}
```

### Form Implementation
Use React Hook Form with shadcn/ui form components for building accessible and type-safe forms.

#### Form Component Structure
```tsx
// Import statements
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Define form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// Component definition
export function LoginForm() {
  // 1. Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    console.log(values)
  }

  // 3. Render the form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
```

#### Form Best Practices
- Use the shadcn/ui Form components for consistent styling and accessibility
- Define validation schema with Zod for type-safe validation
- Leverage React Hook Form's validation and state management
- Use FormMessage to display validation errors
- Provide clear labels and descriptions for form fields
- Group related form fields with appropriate spacing
- Include loading states for form submission
- Prevent multiple submissions with disabled state on submit button

#### Form Components
- `<Form>`: The main wrapper component that provides context for all form elements
- `<FormField>`: Component for building controlled form fields
- `<FormItem>`: Container for each form field with proper spacing
- `<FormLabel>`: Accessible label for form inputs
- `<FormControl>`: Wrapper for the actual input component
- `<FormDescription>`: Additional description or hint text for fields
- `<FormMessage>`: Displays validation errors

#### Complex Form Patterns
- For multi-step forms, use form state to track current step
- For dynamic fields, use `useFieldArray` from React Hook Form
- For conditional fields, use form watch to show/hide based on values
- For file uploads, combine with Vercel Blob Storage or similar services

### CSS/Styling
- Use Tailwind CSS utility classes directly in JSX
- For complex components, use composition of smaller components
- Use CSS variables for theming in `globals.css`
- Follow mobile-first approach for responsive design

### API Routes
- Keep route handlers clean and focused
- Use middleware for authentication and validation
- Follow RESTful conventions
- Return appropriate status codes

```tsx
// Example API route
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id }
    })
    
    if (!job) {
      return Response.json({ error: 'Job not found' }, { status: 404 })
    }
    
    return Response.json(job)
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Package Dependencies

### Core Dependencies
- `next`: ^15.3.0
- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `typescript`: ^5.2.0
- `tailwindcss`: ^4
- `prisma`: ^6.41.0
- `@prisma/client`: ^6.41.0
- `@clerk/nextjs`: ^4.29.0
- `zod`: ^3.24.2

### UI Components
- `@radix-ui/react-*`: Various Radix UI components
- `class-variance-authority`: For component variants
- `clsx`: For conditional classes
- `tailwind-merge`: For merging Tailwind classes
- `lucide-react`: For icons

### Development Dependencies
- `eslint`: ^9
- `eslint-config-next`: ^15
- `prettier`: ^3.0.0
- `prettier-plugin-tailwindcss`: ^0.5.0
- `husky`: ^8.0.0
- `lint-staged`: ^15.0.0

## Best Practices

### Performance
- Use Image component for optimized images
- Implement proper loading states and error boundaries
- Use React.memo() for expensive components
- Implement pagination for large data sets
- Use dynamic imports for code splitting

### Security
- Validate all user inputs with Zod schemas
- Sanitize data before rendering to prevent XSS
- Use prepared statements for database queries (handled by Prisma)
- Implement proper authentication checks with Clerk middleware
- Follow Clerk's best practices for session management

### Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes where needed
- Ensure sufficient color contrast
- Support keyboard navigation
- Test with screen readers

### Testing
- Write unit tests for utility functions
- Write component tests for UI elements
- Write integration tests for API routes
- Use Playwright for E2E testing

### Git Workflow
- Use feature branches
- Write meaningful commit messages
- Create detailed pull requests
- Perform code reviews before merging

## Database Schema
Key tables in the PostgreSQL database:
- `User` - User accounts and profiles
- `Job` - Job listings
- `Company` - Company information
- `Skill` - Skills for jobs and users
- `Application` - Tracking of user job applications
- `JobAlert` - User job alert configurations

## Admin Image Generation
The admin tool for generating Instagram images should:
- Use Canvas API for image generation
- Follow a consistent brand template
- Include configurable layouts based on job type
- Generate QR codes linking to the job listing
- Support company logo placement
- Use a readable font hierarchy for job details

## Next.js Best Practices

### App Router
- Use the App Router for new projects and follow the routing conventions
- Leverage React Server Components for improved performance where possible
- Keep client components lean and use the "use client" directive only when necessary
- Use the built-in loading.tsx, error.tsx, and not-found.tsx files for better UX

### Data Fetching
- Prefer Server Components for data fetching when possible
- Use React Query for client-side data fetching and caching
- Implement proper cache invalidation strategies
- Utilize Next.js parallel data fetching with Promise.all when appropriate

### Rendering Strategies
- Choose the appropriate rendering method based on content type:
  - Static Site Generation (SSG) for content that rarely changes
  - Incremental Static Regeneration (ISR) for content that changes occasionally
  - Server-Side Rendering (SSR) for content that needs to be fresh on each request
  - Client-Side Rendering for highly interactive components

### Image Optimization
- Always use the Next.js Image component with proper sizing
- Implement responsive images with different breakpoints
- Use the priority attribute for above-the-fold images
- Implement proper lazy loading for images below the fold

### Metadata and SEO
- Use the Metadata API for dynamic and static metadata
- Implement proper Open Graph and Twitter card metadata
- Create a comprehensive sitemap.xml and robots.txt
- Implement structured data for rich search results

### Performance
- Implement code splitting with dynamic imports
- Use font optimization with next/font
- Monitor Core Web Vitals and performance metrics
- Implement proper ISR revalidation strategies

### Routing
- Implement shallow routing for URL changes without data refetching when appropriate
- Use middleware for authentication, localization, or other route-level concerns
- Implement proper handling of dynamic routes
- Use route groups for organizational purposes

### Environment Variables
- Properly use .env files (.env.local, .env.development, .env.production)
- Prefix client-side variables with NEXT_PUBLIC_
- Keep sensitive variables server-side only

### Types and Schema Validation
- Define a comprehensive type system for the entire application
- Use Zod for runtime validation of data, especially from external sources
- Generate TypeScript types from Zod schemas to ensure type consistency
- Validate API responses against expected types

### Authentication with Clerk
- Implement Clerk middleware in a middleware.ts file at the project root (or in src/ directory)
- Add ClerkProvider to the application's root layout
- Use Clerk's prebuilt components for sign-in, sign-up, and user profile management
- For protected routes, use middleware configuration to control access
- For custom sign-in/sign-up experiences, follow Clerk's custom pages guide
- Implement route protection using the following pattern:

```tsx
// middleware.ts example
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Public routes that don't require authentication
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Always run for API routes
    '/api/(.*)',
  ],
}
```

- Use server-side authentication helpers:

```tsx
// Server component example
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId } = await auth()
  
  if (!userId) {
    // Handle unauthenticated user
    return <div>Please sign in to access this page</div>
  }
  
  // Protected content
  return <div>Protected content for user {userId}</div>
}
```

- Use client-side authentication hooks:

```tsx
// Client component example
'use client'

import { useUser } from '@clerk/nextjs'

export function ProfileButton() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <div>Please sign in</div>
  }
  
  return <div>Hello, {user.firstName}!</div>
}
```

- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.