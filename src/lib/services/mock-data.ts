// Mock data for demonstration purposes
// In a real app, this would be fetched from the database

export const mockCompanies = [
  {
    id: "company-1",
    name: "Tech Innovations Inc.",
    logo: null,
    website: "https://techinnovations.example.com",
    description:
      "A leading technology company specializing in innovative software solutions for enterprises. Tech Innovations Inc. has been at the forefront of digital transformation for over a decade.",
    industry: ["Technology", "Software Development"],
    location: "San Francisco, CA",
    size: "501-1000 employees",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "company-2",
    name: "Health Solutions",
    logo: null,
    website: "https://healthsolutions.example.com",
    description:
      "Healthcare technology provider focused on improving patient outcomes through innovative digital health platforms and analytics solutions.",
    industry: ["Healthcare", "Technology"],
    location: "Boston, MA",
    size: "201-500 employees",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "company-3",
    name: "FinTech Global",
    logo: null,
    website: "https://fintechglobal.example.com",
    description:
      "Financial technology services company providing cutting-edge payment processing, banking, and investment solutions to clients worldwide.",
    industry: ["Finance", "Technology"],
    location: "New York, NY",
    size: "1001-5000 employees",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockDomains = [
  {
    id: "domain-1",
    name: "Technology",
    description: "Jobs related to Technology",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "domain-2",
    name: "Healthcare",
    description: "Jobs related to Healthcare",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "domain-3",
    name: "Finance",
    description: "Jobs related to Finance",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "domain-4",
    name: "Education",
    description: "Jobs related to Education",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "domain-5",
    name: "Marketing",
    description: "Jobs related to Marketing",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSkills = [
  {
    id: "skill-1",
    name: "JavaScript",
    category: "Technical Skills",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "skill-2",
    name: "React",
    category: "Technical Skills",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "skill-3",
    name: "Python",
    category: "Technical Skills",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "skill-4",
    name: "SQL",
    category: "Technical Skills",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "skill-5",
    name: "Project Management",
    category: "Soft Skills",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "skill-6",
    name: "Communication",
    category: "Soft Skills",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "skill-7",
    name: "Leadership",
    category: "Soft Skills",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "skill-8",
    name: "Problem Solving",
    category: "Soft Skills",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockJobs = Array.from({ length: 12 }).map((_, i) => {
  const companyIndex = i % mockCompanies.length;
  const company = mockCompanies[companyIndex];

  const domains = [mockDomains[i % mockDomains.length]];

  // Add secondary domain sometimes
  if (i % 3 === 0) {
    const secondDomainIndex = (i + 1) % mockDomains.length;
    domains.push(mockDomains[secondDomainIndex]);
  }

  const jobSkills = mockSkills.slice(0, 3 + (i % 4)).map((skill) => ({
    id: `job-skill-${i}-${skill.id}`,
    jobId: `job-${i + 1}`,
    skillId: skill.id,
    skill,
    isPrimary: i % 2 === 0 ? true : false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const experienceLevels = ["Entry", "Mid", "Senior", "Lead", "Executive"];
  const locationTypes = ["Remote", "Hybrid", "On-site"];

  // More detailed descriptions for each job
  const jobDescriptions = [
    "We are seeking a talented and experienced Senior Frontend Developer to join our dynamic team. The ideal candidate will be responsible for building high-quality user interfaces and implementing complex web applications using modern JavaScript frameworks.",
    "Our Data Science team is looking for a skilled Data Scientist to analyze complex datasets and develop machine learning models that drive business decisions. You will work with cross-functional teams to extract valuable insights from data.",
    "We're looking for a strategic Product Manager to lead our product development efforts. The ideal candidate will have a track record of successfully launching products and managing the entire product lifecycle.",
    "Our engineering team is seeking a DevOps Engineer to build and maintain our CI/CD pipelines and cloud infrastructure. You will be responsible for ensuring our systems are reliable, scalable, and secure.",
    "We're seeking a talented UX Designer who is passionate about creating intuitive and engaging user experiences. You will work closely with product managers and developers to create designs that delight our users.",
    "Our growing marketing team needs a Marketing Specialist to develop and execute marketing campaigns across multiple channels. You will be responsible for driving user acquisition and engagement.",
    "We need an experienced Project Manager to lead cross-functional teams and ensure successful delivery of complex projects. You will be responsible for planning, execution, and tracking of key initiatives.",
    "Our sales team is expanding and looking for a motivated Sales Representative to identify and pursue new business opportunities. You will be responsible for the full sales cycle from prospecting to closing deals.",
  ];

  return {
    id: `job-${i + 1}`,
    title: [
      "Senior Frontend Developer",
      "Data Scientist",
      "Product Manager",
      "DevOps Engineer",
      "UX Designer",
      "Marketing Specialist",
      "Project Manager",
      "Sales Representative",
    ][i % 8],
    description: jobDescriptions[i % 8],
    responsibilities: [
      "Lead the development of frontend components and features",
      "Collaborate with design and backend teams for seamless integration",
      "Implement responsive designs and ensure cross-browser compatibility",
      "Optimize applications for maximum performance",
      "Conduct code reviews and mentor junior developers",
    ].join("\n"),
    requirements: [
      "5+ years of experience in frontend development",
      "Proficiency in JavaScript, React, and modern CSS frameworks",
      "Experience with state management libraries like Redux or MobX",
      "Knowledge of web performance optimization techniques",
      "Bachelor's degree in Computer Science or related field",
    ].join("\n"),
    preferredSkills: [
      "Experience with TypeScript and Next.js",
      "Knowledge of GraphQL and Apollo Client",
      "Understanding of accessibility standards",
      "Experience with unit testing frameworks",
      "Previous work in an agile environment",
    ].join("\n"),
    companyId: company.id,
    company,
    location: [
      "San Francisco, CA",
      "New York, NY",
      "Remote",
      "Boston, MA",
      "London, UK",
    ][i % 5],
    locationType: locationTypes[i % 3],
    salary: 80000 + i * 10000,
    salaryMax: 100000 + i * 20000,
    salaryCurrency: "USD",
    salaryPeriod: "YEARLY",
    jobType: jobTypes[i % 4],
    experienceLevel: experienceLevels[i % 5],
    applicationLink: "https://example.com/apply",
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i % 14)), // 0-13 days ago
    domains,
    subdomains: [],
    skills: jobSkills,
    applications: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: Math.floor(Math.random() * 100),
    clickCount: Math.floor(Math.random() * 50),
    imageUrl: null,
    qrCodeUrl: null,
  };
});
