import React from 'react';

interface DemoSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DemoSection({ title, description, children }: DemoSectionProps): React.ReactElement {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {description && (
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
      )}
      <div className="p-6 border rounded-lg bg-card">
        <div className="flex flex-wrap gap-3">
          {children}
        </div>
      </div>
    </section>
  );
}
