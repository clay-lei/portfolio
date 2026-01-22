import Link from "next/link";
import Image from "next/image";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  timeframe?: string;
  overview: string;
  role: string[];
  highlights: string[];
  tech: string[];
  outcomes: string[];
  learnings: string[];
  links?: { label: string; href: string; external?: boolean }[];
  image?: { src: string; alt: string };
};

const projects: Project[] = [
  {
    id: "homehudl",
    title: "Homehudl Onboarding Chatbot",
    subtitle: "Next.js · TypeScript · Node.js",
    timeframe: "Software Development Intern · 2025–Present",
    overview:
      "Built a conversational onboarding flow to replace a static multi-page questionnaire, improving speed, clarity, and data quality while keeping the UI clean and product-friendly.",
    role: [
      "Owned UI implementation for conversational steps and state management",
      "Collaborated with PM/Design to iterate on flow and copy",
      "Integrated client-side validation and structured payload output for backend consumption",
    ],
    highlights: [
      "Designed a chat-like step system with clear progression and recoverable edits",
      "Built reusable question components (text, dropdown, calendar, range, drag list, map/address)",
      "Improved user clarity with microcopy and consistent spacing/typography",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js"],
    outcomes: [
      "Reduced friction by guiding users one step at a time (vs. long form)",
      "More structured answers for downstream matching / processing",
      "Cleaner UI with consistent components and scalable layout patterns",
    ],
    learnings: [
      "How to design UI state so it’s easy to change steps without losing user trust",
      "Where validation belongs (per-step vs. final submit) to reduce frustration",
      "Small copy + spacing changes can dramatically improve completion behavior",
    ],
    links: [
      { label: "Back to top", href: "/projects#top" },
      { label: "Home", href: "/" },
    ],
    // Optional: add an image later (put it in public/images/projects/homehudl/...)
    image: {
      src: "/images/projects/homehudl/hero.png",
      alt: "Homehudl onboarding chatbot UI",
    },
  },
  {
    id: "aisiem",
    title: "AI-SIEM Conversational Assistant (Capstone)",
    subtitle: "RAG · Observability · Splunk · OpenTelemetry",
    timeframe: "UW Capstone · 2025–2026",
    overview:
      "Prototyped an AI assistant for security operations with telemetry, dashboards, and VM-based containerized services, focusing on reliable signals and practical workflows.",
    role: [
      "Implemented observability plumbing for services via OpenTelemetry",
      "Connected telemetry pipeline to Splunk dashboards for monitoring and debugging",
      "Helped define what “useful answers” look like in SOC-style queries",
    ],
    highlights: [
      "Instrumented services and validated traces/logs/metrics end-to-end",
      "Containerized deployment on a VM to mirror real operational constraints",
      "Established a repeatable setup path (config + documentation) for teammates",
    ],
    tech: ["Docker", "OpenTelemetry", "Splunk", "RAG patterns", "VM deployment"],
    outcomes: [
      "Faster debugging with consistent traces and dashboards",
      "Clearer visibility into service health and pipeline reliability",
      "Improved team alignment through shared configs and setup docs",
    ],
    learnings: [
      "Observability is a product: dashboards should answer real questions quickly",
      "Collector/exporter configuration is often the make-or-break point",
      "Operational constraints (VM, permissions, networking) shape architecture decisions",
    ],
    links: [
      { label: "Back to top", href: "/projects#top" },
      { label: "Home", href: "/" },
    ],
    image: {
      src: "/images/projects/aisiem/architecture.png",
      alt: "AI-SIEM architecture / telemetry pipeline diagram",
    },
  },
  {
    id: "iplanner",
    title: "iPlanner Course Planner",
    subtitle: "Node.js · MongoDB · Auth",
    timeframe: "Course project · 2025",
    overview:
      "Built a course planning web app with login, schedule management, add/remove functionality, and requirement checking. Focused on data correctness and a straightforward UX.",
    role: [
      "Implemented planner endpoints to validate and manage courses",
      "Designed schema structure for user + course data inside a single models file",
      "Worked within MVP constraints (no React; HTML pages + backend APIs)",
    ],
    highlights: [
      "Auth via school Google login (project requirement)",
      "Planner endpoints query DB for course validation and CRUD",
      "Migrated from hardcoded JSON toward user-specific persisted data",
    ],
    tech: ["Node.js", "Express", "MongoDB", "HTML/CSS/JS", "REST APIs"],
    outcomes: [
      "Users can build and edit schedules without manual tracking",
      "Data model supports saving courses per user (scalable beyond demo)",
      "Clear separation between static course catalog and user planner data",
    ],
    learnings: [
      "Schemas and endpoints should be designed around user workflows, not data storage convenience",
      "Incremental migration (JSON → DB) is manageable with clear boundaries",
      "Simple UI + clean endpoints often beats over-engineering for MVPs",
    ],
    links: [
      { label: "Back to top", href: "/projects#top" },
      { label: "Home", href: "/" },
    ],
    image: {
      src: "/images/projects/iplanner/ui.png",
      alt: "iPlanner UI screenshot",
    },
  },
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-800">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-zinc-900">{children}</h3>;
}

export default function ProjectsPage() {
  return (
    <main id="top" className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm text-zinc-600">Case Studies</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects
            </h1>
            <p className="max-w-2xl text-zinc-700">
              A selection of projects highlighting product thinking, clean UI,
              and reliable engineering. Each case study includes context,
              decisions, and what I learned.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              ← Home
            </Link>
            <Link
              href="/#contact"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Contact
            </Link>
          </div>
        </header>

        {/* Quick nav */}
        <nav className="mt-10 rounded-2xl border border-zinc-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-zinc-900">Jump to</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a className="cursor-click hover:underline" href="#homehudl">
              Homehudl →
            </a>
            <a className="cursor-click hover:underline" href="#aisiem">
              AI-SIEM →
            </a>
            <a className="cursor-click hover:underline" href="#iplanner">
              iPlanner →
            </a>
          </div>
        </nav>

        {/* Projects */}
        <div className="mt-12 space-y-16">
          {projects.map((p) => (
            <section
              key={p.id}
              id={p.id}
              className="scroll-mt-24 rounded-2xl border border-zinc-200 p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-zinc-600">{p.subtitle}</p>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {p.title}
                  </h2>
                  {p.timeframe ? (
                    <p className="text-sm text-zinc-600">{p.timeframe}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {p.tech.slice(0, 6).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>

              {/* Optional hero image (safe even if file missing? No—so comment out until you add images) */}
              {/* 
              <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
                <Image
                  src={p.image?.src ?? ""}
                  alt={p.image?.alt ?? ""}
                  width={1200}
                  height={700}
                  className="h-auto w-full"
                />
              </div>
              */}

              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                  <SectionTitle>Overview</SectionTitle>
                  <p className="leading-relaxed text-zinc-700">{p.overview}</p>
                </div>

                <div className="space-y-3">
                  <SectionTitle>Role & Collaboration</SectionTitle>
                  <ul className="list-disc space-y-2 pl-5 text-zinc-700">
                    {p.role.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <SectionTitle>Key Work</SectionTitle>
                  <ul className="list-disc space-y-2 pl-5 text-zinc-700">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <SectionTitle>Outcomes</SectionTitle>
                  <ul className="list-disc space-y-2 pl-5 text-zinc-700">
                    {p.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <SectionTitle>What I learned</SectionTitle>
                <ul className="list-disc space-y-2 pl-5 text-zinc-700">
                  {p.learnings.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>

              {/* Footer links */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects#top"
                  className="cursor-click rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Back to top
                </Link>
                <Link
                  href="/"
                  className="cursor-click rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Home
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* Bottom footer */}
        <footer className="mt-16 border-t border-zinc-200 pt-8 text-sm text-zinc-600">
          <p>© {new Date().getFullYear()} Millor Lei. Built with Next.js.</p>
        </footer>
      </div>
    </main>
  );
}
