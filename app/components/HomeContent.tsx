import Link from 'next/link'

type Variant = 'solid' | 'overlay'

export default function HomeContent ({
  variant = 'solid'
}: {
  variant?: Variant
}) {
  const projects = [
    {
      title: 'Homehudl Real Estate SaaS Platform',
      subtitle: 'Next.js · TypeScript · Node.js · REST APIs',
      description:
        'Refactored a production SaaS codebase, built multi-role onboarding workflows, and developed reliable data transformation and agent-matching services.',
      links: [{ label: 'Case Study', href: '/projects#homehudl' }]
    },
    {
      title: 'AI-SIEM Conversational Assistant',
      subtitle: 'RAG · Docker · OCI · OpenTelemetry · Splunk',
      description:
        'Deployed a containerized RAG assistant and built observability pipelines for monitoring latency, system health, usage, and distributed service behavior.',
      links: [{ label: 'Case Study', href: '/projects#aisiem' }]
    },
    {
      title: 'iPlanner Course Planning Platform',
      subtitle: 'Next.js · Node.js · MongoDB',
      description:
        'Built a full-stack course planning platform with real-time filtering, schedule generation, REST APIs, and optimized MongoDB schemas.',
      links: [{ label: 'Case Study', href: '/projects#iplanner' }]
    },
    {
      title: 'Let SQL Fly',
      subtitle: 'PostgreSQL · SQL · ETL · Data Modeling',
      description:
        'Designed normalized relational schemas and analytical SQL workflows using joins, CTEs, window functions, and ETL pipelines.',
      links: [{ label: 'Case Study', href: '/projects#let-sql-fly' }]
    },
    {
      title: 'AWS Web Application Deployment',
      subtitle: 'AWS S3 · CloudFront · IAM · GitHub Actions',
      description:
        'Deployed a production web application with least-privilege IAM policies and automated CI/CD through GitHub Actions.',
      links: [{ label: 'Case Study', href: '/projects#aws-deployment' }]
    }
  ]

  const skills = [
    'TypeScript',
    'JavaScript',
    'Python',
    'Java',
    'SQL',
    'React',
    'Next.js',
    'Node.js',
    'Express.js',
    'REST APIs',
    'MongoDB',
    'PostgreSQL',
    'ChromaDB',
    'Docker',
    'AWS',
    'OCI',
    'Azure',
    'OpenTelemetry',
    'Splunk',
    'RAG',
    'CI/CD'
  ]

  // ✅ 两种外观：solid=白底正常主页；overlay=竹林上玻璃层
  const outer =
    variant === 'solid'
      ? 'min-h-screen bg-white text-zinc-900'
      : 'min-h-screen bg-transparent text-zinc-900'

  const container =
    variant === 'solid'
      ? 'mx-auto max-w-5xl px-6 py-16'
      : 'mx-auto max-w-5xl px-6 pt-6 pb-24 sm:pt-10'

  const pillBtnSolid =
    'rounded-full bg-zinc-900/90 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-all backdrop-blur-sm shadow-lg'
  const pillBtnGhost =
    variant === 'solid'
      ? 'rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50'
      : 'rounded-full border border-white/40 bg-white/40 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white/60'

  const subtleText =
    variant === 'solid' ? 'text-zinc-700' : 'text-zinc-900/80 font-medium'
  const subtleText2 = variant === 'solid' ? 'text-zinc-600' : 'text-zinc-800/60'
  const border = variant === 'solid' ? 'border-zinc-200' : 'border-white/30'

  return (
    <main className={`${outer} relative w-full selection:bg-emerald-100`}>
      <div className={`${container} relative z-10`}>
        {/* Hero */}
        <header className='space-y-6'>
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
              variant === 'solid'
                ? 'border-zinc-200 text-zinc-700 bg-white'
                : 'border-white/40 text-zinc-800/80 bg-white/35 backdrop-blur'
            }`}
          >
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
            Open to opportunities · Seattle / Remote
          </div>

          <h1
            className={`text-4xl font-bold tracking-tight sm:text-6xl text-zinc-950 leading-[1.15] ${
              variant === 'overlay'
                ? 'drop-shadow-[0_0_20px_rgba(242,239,230,1)]'
                : ''
            }`}
          >
            Hi, I’m{' '}
            <span className='group relative inline'>
              <span className='underline decoration-zinc-400/50 underline-offset-[12px] group-hover:decoration-emerald-400 transition-colors cursor-pointer'>
                Millor Lei
              </span>
              .
              <span
                className={`ml-2 align-middle text-xs font-medium tracking-wide sm:text-sm ${
                  variant === 'solid' ? 'text-zinc-400' : 'text-zinc-700/55'
                }`}
              >
                hover me
              </span>
              {/* Sticky-note contact popover */}
              <span
                className='
                  pointer-events-none absolute left-0 top-full z-30 mt-3 w-56
                  origin-top-left scale-95 opacity-0
                  transition-all duration-200 ease-out
                  group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100
                '
              >
                <span className='block rounded-[20px] border-2 border-zinc-900 p-[2px] shadow-[0_8px_20px_rgba(0,0,0,0.14)]'>
                  <span
                    className='relative block overflow-hidden rounded-[16px] border border-zinc-200 bg-[#f7f4ec] p-4'
                    style={{
                      backgroundImage: "url('/img/background_1.png')",
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <span className='absolute inset-0 bg-white/72' />
                    <span className='relative z-10 flex flex-col gap-2.5 text-left text-sm font-medium text-zinc-800'>
                      <a
                        href='https://github.com/clay-lei'
                        target='_blank'
                        rel='noreferrer'
                        className='hover:text-emerald-700 hover:underline'
                      >
                        GitHub →
                      </a>
                      <a
                        href='https://www.linkedin.com/in/millor-lei-4a0870232'
                        target='_blank'
                        rel='noreferrer'
                        className='hover:text-emerald-700 hover:underline'
                      >
                        LinkedIn →
                      </a>
                      <a
                        href='mailto:haichenlei@gmail.com'
                        className='hover:text-emerald-700 hover:underline'
                      >
                        Email →
                      </a>
                    </span>
                  </span>
                </span>
              </span>
            </span>
            <br />
            <span className='opacity-90'>
              I build reliable full-stack and AI-powered systems.
            </span>
          </h1>

          <p className={`max-w-3xl text-lg leading-relaxed ${subtleText}`}>
            University of Washington Informatics graduate with experience
            building production SaaS features, full-stack applications, RAG
            systems, and cloud observability pipelines. I focus on reliable
            APIs, scalable data flows, and software that delivers measurable
            product impact.
          </p>

          <div className='flex flex-wrap gap-3'>
            <Link href='/projects' className={pillBtnSolid}>
              View Projects
            </Link>

            <a href='/resume/HL_Resume_2026.pdf' className={pillBtnGhost}>
              Resume
            </a>

            <Link href='/investments' className={pillBtnGhost}>
              Investments
            </Link>
          </div>
        </header>

        {/* Highlights */}
        <section className='mt-14 grid gap-6 sm:grid-cols-3'>
          {[
            {
              label: 'Focus',
              value: 'Full-stack + AI systems',
              note: 'Next.js · Node.js · RAG'
            },
            {
              label: 'Strength',
              value: 'Reliable data flows',
              note: 'APIs · validation · observability'
            },
            {
              label: 'Experience',
              value: 'Production engineering',
              note: 'SaaS · cloud · distributed systems'
            }
          ].map(item => (
            <div
              key={item.label}
              className='rounded-[24px] border-2 border-zinc-900 p-[2px] shadow-[0_8px_20px_rgba(0,0,0,0.14)]'
            >
              <div
                className={`
          relative min-h-[116px] overflow-hidden
          rounded-2xl border p-5
          ${border}
          bg-[#f7f4ec]
        `}
                style={{
                  backgroundImage: "url('/img/background_1.png')",
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className='absolute inset-0 bg-white/72' />

                <div className='relative z-10'>
                  <p className={`text-sm ${subtleText2}`}>{item.label}</p>
                  <p className='mt-1 text-lg font-semibold'>{item.value}</p>
                  <p className={`mt-1 text-sm ${subtleText2}`}>{item.note}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className='mt-16'>
          <div className='flex items-end justify-between gap-4'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Selected Projects
            </h2>
            <Link
              href='/projects'
              className={`text-sm hover:underline ${subtleText}`}
            >
              See all →
            </Link>
          </div>

          <div className='mt-6 grid gap-4 sm:grid-cols-2'>
            {projects.map(p => (
              <div
                key={p.title}
                /* 1. 外层黑边容器：这里是核心改动 */
                className='rounded-[24px] border-2 border-zinc-900 p-[2px] shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all'
              >
                <div
                  className={`
                                    relative overflow-hidden
                                    rounded-2xl border p-6
                                    ${border}
                                    bg-[url('/img/background_2.png')]
                                    bg-cover bg-center
                                    shadow-sm hover:shadow-md transition-shadow
                                  `}
                >
                  <div className='absolute inset-0 bg-white/70 backdrop-blur-[1px]' />
                  <div className='relative z-10'>
                    <p className={`text-sm ${subtleText2}`}>{p.subtitle}</p>
                    <h3 className='mt-2 text-lg font-semibold'>{p.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${subtleText}`}>
                      {p.description}
                    </p>

                    <div className='mt-4 flex flex-wrap gap-3'>
                      {p.links.map(l => (
                        <Link
                          key={l.label}
                          href={l.href}
                          className='text-sm font-medium hover:underline'
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className='mt-16'>
          <h2 className='text-2xl font-semibold tracking-tight'>Skills</h2>
          <div className='mt-5 flex flex-wrap gap-2'>
            {skills.map(s => (
              <span
                key={s}
                className={
                  variant === 'solid'
                    ? 'rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-800'
                    : 'rounded-full border border-white/35 bg-white/45 px-3 py-1 text-sm text-zinc-900'
                }
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`mt-16 border-t pt-8 text-sm ${
            variant === 'solid'
              ? 'border-zinc-200 text-zinc-600'
              : 'border-white/30 text-zinc-800/70'
          }`}
        >
          <p>© {new Date().getFullYear()} Millor Lei.</p>
        </footer>
      </div>
    </main>
  )
}
