'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// --- Types ---
type Project = {
  id: string
  title: string
  subtitle: string
  timeframe?: string
  overview: string
  role: string[]
  highlights: string[]
  tech: string[]
  outcomes: string[]
  learnings: string[]
  links?: { label: string; href: string; external?: boolean }[]
  image?: { src: string; alt: string }
}

// 必须禁用 SSR 才能加载 Three.js
const InkBambooScene = dynamic(
  () => import('@/app/UI/InkBambooScene').then(mod => mod.default),
  {
    ssr: false,
    loading: () => <div className='fixed inset-0 bg-[#f2efe6]' />
  }
)

const projects: Project[] = [
  {
    id: 'homehudl',
    title: 'Homehudl Real Estate SaaS Platform',
    subtitle: 'Next.js · TypeScript · Node.js · REST APIs',
    timeframe: 'Software Developer · Sep 2025 – May 2026',
    overview:
      'Worked on a production real estate SaaS platform supporting multi-role onboarding, structured client data, backend integrations, and real-time agent matching.',
    role: [
      'Developed full-stack product features across the Next.js frontend and Node.js service layer',
      'Refactored application architecture into reusable services, shared types, and centralized API workflows',
      'Collaborated with product and engineering stakeholders to improve onboarding reliability and completion'
    ],
    highlights: [
      'Refactored a large Next.js and TypeScript codebase into modular service-oriented components',
      'Built dynamic onboarding workflows supporting multiple user roles and conditional form paths',
      'Designed a transformation pipeline that converted client state into backend-compatible JSON schemas',
      'Implemented authentication-aware API requests, schema validation, and structured error handling',
      'Developed services supporting agent matching, API synchronization, and engagement creation'
    ],
    tech: [
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'REST APIs',
      'Schema Validation',
      'Tailwind CSS'
    ],
    outcomes: [
      'Improved development velocity by 30% through shared services and modular architecture',
      'Increased onboarding completion by 40% through clearer multi-step user workflows',
      'Reduced user drop-off by 25% through more reliable matching and data synchronization'
    ],
    learnings: [
      'Frontend reliability depends heavily on consistent schemas and clear API contracts',
      'Multi-role products require state management designed around user workflows rather than individual screens',
      'Reusable service layers reduce duplicated logic and make production debugging significantly easier'
    ],
    image: {
      src: '/images/projects/homehudl/hero.png',
      alt: 'Homehudl real estate onboarding platform'
    }
  },
  {
    id: 'aisiem',
    title: 'AI-SIEM Conversational Assistant',
    subtitle: 'RAG · Docker · OCI · OpenTelemetry · Splunk',
    timeframe: 'Software Development Intern · Dec 2025 – Jun 2026',
    overview:
      'Deployed and instrumented a containerized AI assistant designed for security operations, combining retrieval-augmented generation, cloud infrastructure, and end-to-end observability.',
    role: [
      'Deployed and maintained containerized services on Oracle Cloud Infrastructure',
      'Built RAG workflows connecting chatbot services with ChromaDB knowledge retrieval',
      'Implemented telemetry pipelines for monitoring LLM and service behavior',
      'Developed backend workflows for retrieval, chatbot interactions, and human-agent escalation'
    ],
    highlights: [
      'Containerized chatbot, vector database, telemetry collector, and analytics services with Docker',
      'Built RAG pipelines using ChromaDB and LLM orchestration',
      'Instrumented request latency, usage metrics, logs, and traces with OpenTelemetry',
      'Integrated telemetry with Splunk dashboards for system monitoring and debugging',
      'Designed distributed logging and tracing workflows across multiple services'
    ],
    tech: [
      'Python',
      'Docker',
      'OCI',
      'ChromaDB',
      'RAG',
      'OpenTelemetry',
      'Splunk',
      'REST APIs'
    ],
    outcomes: [
      'Created end-to-end visibility into chatbot latency, usage, errors, and service health',
      'Improved fault detection and debugging through centralized logs, traces, and dashboards',
      'Established a repeatable cloud deployment and observability workflow for the project'
    ],
    learnings: [
      'Observability should be designed around operational questions, not just collected metrics',
      'RAG reliability depends on retrieval quality, data organization, and service-level monitoring',
      'Cloud networking, secrets, deployment configuration, and telemetry are core parts of AI product engineering'
    ],
    image: {
      src: '/images/projects/aisiem/architecture.png',
      alt: 'AI-SIEM RAG and observability architecture'
    }
  },
  {
    id: 'iplanner',
    title: 'iPlanner Course Planning Platform',
    subtitle: 'Next.js · Node.js · MongoDB',
    timeframe: 'Full-Stack Project · Winter 2025',
    overview:
      'Built a full-stack course planning application that allows users to search courses, manage schedules, and generate academic plans using persistent application data.',
    role: [
      'Developed frontend and backend workflows for course search and schedule management',
      'Designed REST API endpoints for course validation, filtering, and planner operations',
      'Created MongoDB and Mongoose schemas for users, courses, and saved schedules'
    ],
    highlights: [
      'Implemented real-time course filtering and schedule generation',
      'Built create, read, update, and delete workflows for user schedules',
      'Designed REST APIs connecting the planner interface to persistent MongoDB data',
      'Optimized schema structure and database queries for scalable course datasets'
    ],
    tech: [
      'Next.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'REST APIs'
    ],
    outcomes: [
      'Enabled users to build and update course schedules without manual tracking',
      'Moved planner data from hardcoded files into user-specific database records',
      'Created reusable API and schema patterns for future planning features'
    ],
    learnings: [
      'Database schemas should reflect real user workflows rather than only storage convenience',
      'Clear API boundaries make frontend and backend development easier to test independently',
      'Query design becomes increasingly important as the course dataset grows'
    ],
    image: {
      src: '/images/projects/iplanner/ui.png',
      alt: 'iPlanner course planning interface'
    }
  },
  {
    id: 'let-sql-fly',
    title: 'Let SQL Fly',
    subtitle: 'PostgreSQL · SQL · ETL · Data Modeling',
    timeframe: 'Data Analytics Project · Spring 2025',
    overview:
      'Designed a relational data analytics platform for querying and processing large structured datasets using PostgreSQL and advanced SQL.',
    role: [
      'Designed normalized schemas and relationships across more than six entities',
      'Developed analytical queries for reporting and data exploration',
      'Built ETL workflows to clean, transform, and load structured datasets'
    ],
    highlights: [
      'Created normalized relational schemas with primary and foreign key constraints',
      'Wrote advanced queries using joins, CTEs, aggregations, and window functions',
      'Processed and analyzed datasets containing more than one million records',
      'Improved query structure through indexing and relational design'
    ],
    tech: [
      'PostgreSQL',
      'SQL',
      'CTEs',
      'Window Functions',
      'ETL',
      'Relational Modeling'
    ],
    outcomes: [
      'Maintained data integrity across interconnected entities',
      'Enabled complex analytical reporting over large datasets',
      'Created repeatable data transformation and query workflows'
    ],
    learnings: [
      'Good relational modeling reduces query complexity and prevents inconsistent data',
      'Indexes and query plans matter significantly when datasets grow',
      'ETL design should make data validation and failure handling explicit'
    ]
  },
  {
    id: 'aws-deployment',
    title: 'AWS Web Application Deployment',
    subtitle: 'AWS S3 · CloudFront · IAM · GitHub Actions',
    timeframe: 'Cloud Deployment Project · Autumn 2024',
    overview:
      'Deployed a production web application using AWS infrastructure and automated the delivery workflow through GitHub Actions.',
    role: [
      'Configured S3 hosting and CloudFront content delivery',
      'Created IAM policies following least-privilege access principles',
      'Implemented automated build and deployment workflows using GitHub Actions'
    ],
    highlights: [
      'Hosted static application assets through Amazon S3',
      'Configured CloudFront for faster global content delivery',
      'Restricted deployment permissions using least-privilege IAM policies',
      'Automated deployment whenever approved code was pushed to the repository'
    ],
    tech: ['AWS', 'S3', 'CloudFront', 'IAM', 'GitHub Actions', 'CI/CD'],
    outcomes: [
      'Created a repeatable deployment process with fewer manual steps',
      'Improved application delivery through CDN-based distribution',
      'Reduced credential exposure through scoped IAM permissions'
    ],
    learnings: [
      'Deployment automation should be treated as part of the application architecture',
      'Cloud permissions should be scoped to the smallest practical set of actions',
      'A simple CI/CD pipeline can significantly improve deployment reliability'
    ]
  }
]

function Tag ({ children }: { children: React.ReactNode }) {
  return (
    <span className='rounded-full border border-zinc-200/50 bg-white/40 px-3 py-1 text-sm text-zinc-800 backdrop-blur-sm'>
      {children}
    </span>
  )
}

function SectionTitle ({ children }: { children: React.ReactNode }) {
  return <h3 className='text-lg font-semibold text-zinc-900'>{children}</h3>
}

export default function ProjectsPage () {
  return (
    // 关键点1: 移除 bg-white，改为 bg-transparent
    <main
      id='top'
      className='relative min-h-screen bg-transparent text-zinc-900'
    >
      {/* 关键点2: 背景层固定定位，z-index 为 0 */}
      <div className='fixed inset-0 z-0'>
        <InkBambooScene backgroundOnly />
      </div>

      {/* 关键点3: 内容层 pointer-events-none 允许点击穿透到 Canvas 触发惊风雨效果 */}
      <div className='relative z-10 pointer-events-none'>
        <div className='mx-auto max-w-5xl px-6 py-16 pointer-events-auto'>
          {/* Header 使用毛玻璃背景以便在竹林背景上识别文字 */}
          <header className='flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between bg-white/20 backdrop-blur-md p-8 rounded-3xl border border-white/30 shadow-sm'>
            <div className='space-y-3'>
              <p className='text-sm font-medium text-zinc-600'>Case Studies</p>
              <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                Projects
              </h1>
              <p className='max-w-2xl text-zinc-700'>
                Selected work across production SaaS, full-stack development, AI
                infrastructure, cloud deployment, observability, and data
                systems.
              </p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <Link
                href='/'
                className='rounded-full border border-zinc-300 bg-white/50 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors'
              >
                ← Home
              </Link>
              <Link
                href='/#contact'
                className='rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800'
              >
                Contact
              </Link>
            </div>
          </header>

          {/* Quick nav */}
          <nav className='mt-10 rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm'>
            <p className='text-sm font-medium text-zinc-900'>Jump to</p>

            <div className='mt-3 flex flex-wrap gap-4 text-sm'>
              {[
                { id: 'homehudl', label: 'Homehudl' },
                { id: 'aisiem', label: 'AI-SIEM' },
                { id: 'iplanner', label: 'iPlanner' },
                { id: 'let-sql-fly', label: 'Let SQL Fly' },
                { id: 'aws-deployment', label: 'AWS Deployment' }
              ].map(item => (
                <a
                  key={item.id}
                  className='transition-all hover:underline'
                  href={`#${item.id}`}
                >
                  {item.label} →
                </a>
              ))}
            </div>
          </nav>

          {/* Projects */}
          <div className='mt-12 space-y-20'>
            {projects.map(p => (
              <section
                key={p.id}
                id={p.id}
                // 关键点4: 增加半透明背景 bg-white/60 和毛玻璃模糊 backdrop-blur-lg
                className='scroll-mt-24 rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-lg sm:p-10'
              >
                <div className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-zinc-500 uppercase tracking-wider'>
                      {p.subtitle}
                    </p>
                    <h2 className='text-3xl font-bold tracking-tight text-zinc-900'>
                      {p.title}
                    </h2>
                    {p.timeframe && (
                      <p className='text-sm text-zinc-600 italic'>
                        {p.timeframe}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {p.tech.map(t => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>

                <div className='mt-10 grid gap-12 sm:grid-cols-2'>
                  <div className='space-y-4'>
                    <SectionTitle>Overview</SectionTitle>
                    <p className='leading-relaxed text-zinc-700'>
                      {p.overview}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <SectionTitle>Role & Collaboration</SectionTitle>
                    <ul className='list-disc space-y-3 pl-5 text-zinc-700'>
                      {p.role.map(r => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className='space-y-4'>
                    <SectionTitle>Key Work</SectionTitle>
                    <ul className='list-disc space-y-3 pl-5 text-zinc-700'>
                      {p.highlights.map(h => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className='space-y-4'>
                    <SectionTitle>Outcomes</SectionTitle>
                    <ul className='list-disc space-y-3 pl-5 text-zinc-700'>
                      {p.outcomes.map(o => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className='mt-12 pt-8 border-t border-zinc-200/50'>
                  <SectionTitle>What I learned</SectionTitle>
                  <ul className='mt-4 list-disc space-y-3 pl-5 text-zinc-700'>
                    {p.learnings.map(l => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>

                <div className='mt-10 flex flex-wrap gap-3'>
                  <Link
                    href='/projects#top'
                    className='rounded-full border border-zinc-300 bg-white/50 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors'
                  >
                    Back to top
                  </Link>
                  <Link
                    href='/'
                    className='rounded-full border border-zinc-300 bg-white/50 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors'
                  >
                    Home
                  </Link>
                </div>
              </section>
            ))}
          </div>

          <footer className='mt-20 border-t border-zinc-200/30 pt-8 text-sm text-zinc-600 flex justify-between items-center'>
            <p>© {new Date().getFullYear()} Millor Lei. Built with Next.js.</p>
            <p className='font-calligraphy italic opacity-40 text-lg'>
              万竿烟雨
            </p>
          </footer>
        </div>
      </div>
    </main>
  )
}
