export default function ProjectsPage() {
    return (
      <main className="min-h-screen bg-white text-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
          <h1 className="text-3xl font-semibold">Projects</h1>
  
          <section id="homehudl">
            <h2 className="text-2xl font-semibold">Homehudl Onboarding Chatbot</h2>
            <p className="mt-2 text-zinc-700">
              Full case study content here…
            </p>
          </section>
  
          <section id="aisiem">
            <h2 className="text-2xl font-semibold">
              AI-SIEM Conversational Assistant
            </h2>
          </section>
  
          <section id="iplanner">
            <h2 className="text-2xl font-semibold">iPlanner</h2>
          </section>
        </div>
      </main>
    );
  }
  