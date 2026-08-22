import type { ReactNode } from "react";

interface QuestionCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function QuestionCard({ title, subtitle, children }: QuestionCardProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}
