export default function Home() {
  const projects = [
    {
      title: "Homehudl Onboarding Chatbot",
      subtitle: "Next.js · TypeScript · Node.js",
      description:
        "Built a conversational onboarding flow to replace a static multi-page questionnaire, improving speed and data quality.",
      links: [
        { label: "Case Study", href: "/projects#homehudl" },
      ],
    },
    {
      title: "AI-SIEM Conversational Assistant (Capstone)",
      subtitle: "RAG · Observability · Splunk · OpenTelemetry",
      description:
        "Prototype AI assistant for security operations with telemetry, dashboards, and VM-based containerized services.",
      links: [{ label: "Case Study", href: "/projects#aisiem" }],
    },
    {
      title: "iPlanner Course Planner",
      subtitle: "Node.js · MongoDB · Auth",
      description:
        "Course planning web app with login, schedule management, and requirement checking.",
      links: [{ label: "Case Study", href: "/projects#iplanner" }],
    },
  ];

  const skills = [
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Tailwind CSS",
    "MongoDB",
    "REST APIs",
    "OpenTelemetry",
    "Splunk",
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Available for internships · Seattle / Remote
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Hi, I’m <span className="underline decoration-zinc-300">Millor Lei</span>.
            <br />
            I build product-focused web experiences.
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-zinc-700">
            Informatics student at UW (graduating 2026) with hands-on experience
            building full-stack features in Next.js/TypeScript. I care about clean
            UI, reliable data flows, and measurable impact.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/projects"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              <a href="/projects">View Projects</a>
            </a>
            <a
              href="/resume/HL_Resume.pdf"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Resume
            </a>
            <a
              href="mailto:haichenlei@email.com"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Email
            </a>
            <a
              href="https://github.com/clay-lei"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/millor-lei-4a0870232"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              LinkedIn
            </a>
          </div>
        </header>

        {/* Highlights */}
        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Focus",
              value: "Frontend + Full-stack",
              note: "Next.js · APIs · UI/UX",
            },
            {
              label: "Strength",
              value: "Shipping fast",
              note: "Clean components + iteration",
            },
            {
              label: "Impact",
              value: "Measured results",
              note: "Speed, accuracy, clarity",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-200 p-5 shadow-sm"
            >
              <p className="text-sm text-zinc-600">{item.label}</p>
              <p className="mt-1 text-lg font-semibold">{item.value}</p>
              <p className="mt-1 text-sm text-zinc-600">{item.note}</p>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Selected Projects</h2>
            <a href="/projects" className="text-sm text-zinc-700 hover:underline">
              See all →
            </a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-zinc-600">{p.subtitle}</p>
                <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="text-sm font-medium text-zinc-900 hover:underline"
                    >
                      {l.label} →
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-800"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-200 pt-8 text-sm text-zinc-600">
          <p>© {new Date().getFullYear()} Millor Lei. Built with Next.js.</p>
        </footer>
      </div>
    </main>
  );
}
