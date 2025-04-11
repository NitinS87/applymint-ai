# **Project Requirements Document: ApplyMint AI**

## **Project Overview**
ApplyMint AI is a job search and application platform that helps users find employment opportunities in their domain and connect them to official application pages on company career websites. The platform leverages AI to enhance the job search experience and streamline the job discovery process.

## **Functional Requirements**

The following table outlines the detailed functional requirements of the ApplyMint AI application:

| Requirement ID | Description | User Story | Expected Behavior/Outcome |
|----------------|-------------|------------|---------------------------|
| FR001 | Job Search | As a user, I want to search for jobs in my domain so I can find relevant opportunities. | The system should provide a robust search interface with comprehensive filters for domain/industry, job role, location, experience level, salary range, job type (full-time, part-time, contract), company size, remote work options, and posting date. Results should update in real-time and be sortable by relevance, date, and salary. |
| FR002 | Job Listings | As a user, I want to view detailed job listings so I can understand the position requirements. | Each job listing should display job title, company, location, salary range, description, requirements, application deadline, and domain/industry classification. Listings should also include tags for key technologies, skills, and qualifications required. |
| FR003 | External Application Links | As a user, I want to be redirected to official job application pages so I can apply directly on the company's website. | The system should provide an "Apply Now" button that redirects users to the official application page on the company's careers website. No applications will be processed within the ApplyMint platform. |
| FR004 | User Profiles | As a user, I want to create and maintain a profile so I can save my preferences and application history. | Users should be able to create profiles with personal information, work experience, skills, education, and resume upload functionality. Profiles should also include preferred job domains and industries for better matching. |
| FR005 | Job Recommendations | As a user, I want to receive personalized job recommendations based on my profile and search history. | The system should use AI algorithms to suggest relevant jobs to users based on their profile data, skills, domain preferences, and previous searches. |
| FR006 | Job Alerts | As a user, I want to set up alerts for specific job types so I can be notified when new opportunities arise. | Users should be able to configure alerts with custom parameters including domain, location, salary, experience level, and keywords, receiving notifications via email or in-app messages. |
| FR007 | Application Tracking | As a user, I want to track the jobs I've been redirected to so I can manage my job search effectively. | The system should maintain a history of jobs the user has clicked through to apply, with the ability to add status updates manually and set follow-up reminders. |
| FR008 | Company Information | As a user, I want to view information about the hiring companies so I can evaluate if they match my preferences. | Company profiles should include basic information, domain/industry, culture, benefits, and reviews if available. |
| FR009 | Resume Builder | As a user, I want assistance in creating an effective resume so I can improve my chances of getting hired. | The system should provide templates and AI-powered suggestions for resume improvement based on targeted job domains and industries. |
| FR010 | Admin Job Posting Tool | As an admin, I want to manually add job listings through a form so I can ensure quality content on the platform. | Admins should have access to a form where they can input job details, which are then saved to the database and formatted for social media sharing. |
| FR011 | Social Media Job Sharing | As an admin, I want job listings to be automatically formatted as images for Instagram so I can promote them on social media. | The system should generate visually appealing images containing job details in a standardized layout for Instagram posting. |
| FR012 | Advanced Filtering | As a user, I want to apply multiple filters simultaneously to narrow down my job search results to exactly what I'm looking for. | The system should provide a comprehensive filtering system that allows multiple selections within each category (e.g., multiple domains, multiple locations) and combinatorial filtering across categories with the ability to save filter combinations for future use. |

## **Admin Job Posting Tool (FR010 & FR011 Details)**

### **Purpose**
To provide administrators with a tool to manually add job listings from various company career websites and automatically format them for social media promotion.

### **Features**
1. **Job Input Form**: A comprehensive form for admins to input all job details including:
   - Job title
   - Company name
   - Location (remote/on-site/hybrid)
   - Domain/Industry (with multi-select options)
   - Sub-domains/Specializations
   - Required skills (primary and secondary)
   - Experience level
   - Salary range
   - Job type (full-time, part-time, contract, internship)
   - Application deadline
   - Job description
   - Required qualifications
   - Preferred qualifications
   - Application link (URL to the official job posting on company website)

2. **Database Integration**: All submitted job details should be stored in the PostgreSQL database.

3. **Automatic Image Generation**: Upon submission, the system should:
   - Generate a visually appealing image containing key job details
   - Use a consistent layout/template
   - Incorporate the company logo if available
   - Include a QR code linking to the full job listing

4. **Instagram Post Preparation**: The generated image should be:
   - Sized correctly for Instagram (1080 × 1080 pixels)
   - Available for download
   - Optionally, integrate with Instagram API for direct posting

## **Non-Functional Requirements**

| Requirement ID | Category | Description |
|----------------|----------|-------------|
| NFR001 | Performance | The system should load search results within 2 seconds. |
| NFR002 | Usability | The user interface should be intuitive and accessible on both desktop and mobile devices. |
| NFR003 | Security | User data and credentials must be encrypted and securely stored. |
| NFR004 | Reliability | The system should have an uptime of at least 99.5%. |
| NFR005 | Scalability | The architecture should support scaling to handle up to 100,000 concurrent users. |
| NFR006 | Data Privacy | The system must comply with GDPR and other relevant data protection regulations. |
| NFR007 | Integration | The system should provide APIs for integration with other job platforms and social media. |

## **Technical Specifications**

### **Platform**
- Web application built using Next.js
- Responsive design for mobile and desktop users

### **Database**
- PostgreSQL for structured data storage
- Efficient indexing for job search functionality
- Advanced taxonomy system for domains, skills, and job categories

### **Technologies**
- Frontend: React.js, TypeScript, Tailwind CSS
- Backend: Node.js, Next.js API routes
- Authentication: OAuth 2.0, JWT
- Image Generation: Canvas API or similar technology
- AI Components: Natural Language Processing for job matching and recommendations

### **Integration Points**
- Job board APIs for aggregating external job listings
- Link tracking for outbound application clicks
- Social media APIs for posting formatted job images
- Email service for notifications and alerts

## **Future Enhancements**
- AI-powered interview preparation tools
- Salary negotiation assistance
- Career path planning
- Automated application follow-ups
- Integration with LinkedIn and other professional networks

## **Project Timeline**
- Phase 1: Admin tools and social media integration
- Phase 2: Core job search and application functionality
- Phase 3: User profiles and application tracking
- Phase 4: AI-powered recommendations and enhancements
