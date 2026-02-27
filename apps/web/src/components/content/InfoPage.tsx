import type { ReactNode } from 'react'

type InfoSection = {
  title: string
  body: ReactNode
}

type InfoPageProps = {
  title: string
  intro: string
  sections: InfoSection[]
}

export function InfoPage({ title, intro, sections }: InfoPageProps) {
  return (
    <main className="shell-container py-12">
      <header className="mb-8 max-w-4xl rounded-[1.8rem] border border-brand-border bg-gradient-to-br from-stone-50 via-white to-stone-100 p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-brand-text-muted">{intro}</p>
      </header>

      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="rounded-[1.5rem] border border-brand-border bg-white/85 p-5">
            <h2 className="text-2xl">{section.title}</h2>
            <div className="mt-2 text-sm leading-7 text-brand-text-muted">{section.body}</div>
          </section>
        ))}
      </div>
    </main>
  )
}
