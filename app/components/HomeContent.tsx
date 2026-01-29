import Link from "next/link";

type Variant = "solid" | "overlay";

export default function HomeContent({ variant = "solid" }: { variant?: Variant }) {
    const projects = [
        {
            title: "Homehudl Onboarding Chatbot",
            subtitle: "Next.js · TypeScript · Node.js",
            description:
                "Built a conversational onboarding flow to replace a static multi-page questionnaire, improving speed and data quality.",
            links: [{ label: "Case Study", href: "/projects#homehudl" }],
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

    // ✅ 两种外观：solid=白底正常主页；overlay=竹林上玻璃层
    const outer =
        variant === "solid"
            ? "min-h-screen bg-white text-zinc-900"
            : "min-h-screen text-zinc-900";

    const container =
        variant === "solid"
            ? "mx-auto max-w-5xl px-6 py-16"
            : "mx-auto max-w-5xl px-6 py-16";

    const card =
        variant === "solid"
            ? "rounded-2xl border border-zinc-200 p-6 shadow-sm"
            // 降低白色的比例，增加模糊度，让它更通透
            : "rounded-2xl border border-white/40 bg-white/30 backdrop-blur-xl p-6 shadow-2xl shadow-zinc-950/5";

    const pillBtnSolid =
        "rounded-full bg-zinc-900/90 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-all backdrop-blur-sm shadow-lg";
    const pillBtnGhost =
        variant === "solid"
            ? "rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            : "rounded-full border border-white/40 bg-white/40 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white/60";

    const subtleText = variant === "solid" ? "text-zinc-700" : "text-zinc-800/80";
    const subtleText2 = variant === "solid" ? "text-zinc-600" : "text-zinc-800/70";
    const border = variant === "solid" ? "border-zinc-200" : "border-white/30";

    return (
        <main className={`${outer} relative`}>
            {variant === "overlay" && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(
                circle at 50% 30%, 
                rgba(210, 225, 215, 0.7) 40%,   /* 中心：淡青绿色 */
                rgba(242, 239, 230, 0.4) 80%,  /* 中间：过渡到纸张色 */
            )`
                    }}
                />
            )}
            <div className={`${container} relative z-10`}>
                {/* Hero */}
                <header className="space-y-6">
                    <div
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${variant === "solid"
                            ? "border-zinc-200 text-zinc-700 bg-white"
                            : "border-white/40 text-zinc-800/80 bg-white/35 backdrop-blur"
                            }`}
                    >
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Available for income · Seattle / Remote
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-zinc-900 drop-shadow-[0_0_15px_rgba(242,239,230,0.9)]">
                        Hi, I’m <span className="underline decoration-zinc-400 underline-offset-8">Millor Lei</span>.
                        <br />
                        I build product-focused web experiences.
                    </h1>

                    <p className={`max-w-2xl text-lg leading-relaxed ${subtleText}`}>
                        Informatics student at UW (graduating 2026) with hands-on experience building
                        full-stack features in Next.js/TypeScript. I care about clean UI, reliable data
                        flows, and measurable impact.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/projects" className={pillBtnSolid}>
                            View Projects
                        </Link>

                        <a href="/resume/HL_Resume.pdf" className={pillBtnGhost}>
                            Resume
                        </a>

                        <a href="mailto:haichenlei@email.com" className={pillBtnGhost}>
                            Email
                        </a>

                        <a
                            href="https://github.com/clay-lei"
                            target="_blank"
                            rel="noreferrer"
                            className={pillBtnGhost}
                        >
                            GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/millor-lei-4a0870232"
                            target="_blank"
                            rel="noreferrer"
                            className={pillBtnGhost}
                        >
                            LinkedIn
                        </a>

                        <Link href="/ink" className={pillBtnGhost}>
                            Ink Scene
                        </Link>
                    </div>
                </header>

                {/* Highlights */}
                <section className="mt-14 grid gap-4 sm:grid-cols-3">
                    {[
                        { label: "Focus", value: "Frontend + Full-stack", note: "Next.js · APIs · UI/UX" },
                        { label: "Strength", value: "Shipping fast", note: "Clean components + iteration" },
                        { label: "Impact", value: "Measured results", note: "Speed, accuracy, clarity" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-[22px] border-2 border-zinc-900 p-[2px] shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                        >
                            <div
                                className={`
                                rounded-2xl border p-5
                                ${border}
                                bg-[url('/img/background_1.png')]
                                bg-cover bg-center
                                relative overflow-hidden
                              `}
                            >
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />

                                <div className="relative z-10">
                                    <p className={`text-sm ${subtleText2}`}>{item.label}</p>
                                    <p className="mt-1 text-lg font-semibold">{item.value}</p>
                                    <p className={`mt-1 text-sm ${subtleText2}`}>{item.note}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Featured */}
                <section className="mt-16">
                    <div className={`rounded-2xl border p-6 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${card} ${border}`}>
                        <div>
                            <p className={`text-sm ${subtleText2}`}>Interactive</p>
                            <h2 className="mt-2 text-xl font-semibold">Ink Bamboo Forest (Three.js)</h2>
                            <p className={`mt-1 text-sm max-w-2xl ${subtleText}`}>
                                A lightweight 3D ink-wash bamboo scene with an intro zoom-in and subtle mouse-driven sway.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link href="/ink" className={pillBtnSolid}>
                                Open Scene →
                            </Link>
                            <Link href="/projects" className={pillBtnGhost}>
                                View Work
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Projects */}
                <section className="mt-16">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="text-2xl font-semibold tracking-tight">Selected Projects</h2>
                        <Link href="/projects" className={`text-sm hover:underline ${subtleText}`}>
                            See all →
                        </Link>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {projects.map((p) => (
                            <div
                                key={p.title}
                                className={`
                                    relative overflow-hidden
                                    rounded-2xl border p-6
                                    ${border}
                                    bg-[url('/img/background_2.png')]
                                    bg-cover bg-center
                                    shadow-sm hover:shadow-md transition-shadow
                                  `}
                            >
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />
                                <div className="relative z-10">
                                    <p className={`text-sm ${subtleText2}`}>{p.subtitle}</p>
                                    <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                                    <p className={`mt-2 text-sm leading-relaxed ${subtleText}`}>
                                        {p.description}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {p.links.map((l) => (
                                            <Link key={l.label} href={l.href} className="text-sm font-medium hover:underline">
                                                {l.label} →
                                            </Link>
                                        ))}
                                    </div>
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
                                className={
                                    variant === "solid"
                                        ? "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-800"
                                        : "rounded-full border border-white/35 bg-white/45 px-3 py-1 text-sm text-zinc-900"
                                }
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className={`mt-16 border-t pt-8 text-sm ${variant === "solid" ? "border-zinc-200 text-zinc-600" : "border-white/30 text-zinc-800/70"}`}>
                    <p>© {new Date().getFullYear()} Millor Lei.</p>
                </footer>
            </div>
        </main>
    );
}
