import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🔔', name: 'Toast', description: 'Notification messages with variants and positions', path: '/components/toast' },
  { icon: '📦', name: 'Modal', description: 'Dialog windows with custom content', path: '/components/modal' },
  { icon: '⏳', name: 'Loading', description: 'Loading indicators with wrap() pattern', path: '/components/loading' },
  { icon: '❓', name: 'Confirm', description: 'Promise-based confirmation dialogs', path: '/components/confirm' },
  { icon: '📊', name: 'Progress', description: 'Determinate and indeterminate progress', path: '/components/progress' },
  { icon: '📂', name: 'Drawer', description: 'Slide-out panels from any edge', path: '/components/drawer' },
];

const adapters = [
  { name: 'Headless', description: 'Pure Tailwind CSS, zero dependencies' },
  { name: 'shadcn/ui', description: 'Radix UI primitives + Tailwind' },
  { name: 'Mantine', description: 'Full-featured React components' },
  { name: 'Chakra UI', description: 'Simple, modular components' },
  { name: 'MUI', description: 'Material Design components' },
  { name: 'Ant Design', description: 'Enterprise-level UI library' },
];

export function HomePage(): React.ReactElement {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          <span className="text-primary">Omni</span>Feedback
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Universal React feedback management. One API, any UI library.
          Toast, Modal, Loading, Confirm, and more.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/components/toast"
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/muhammetalisongur/omnifeedback"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 px-6 rounded-md border bg-background hover:bg-muted font-medium transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Adapter Selection Info */}
      <section className="p-6 border rounded-lg bg-card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🎨</span>
          <h2 className="text-xl font-semibold">Try Different Adapters</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Use the adapter selector in the header to switch between UI libraries.
          All components work identically across adapters.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {adapters.map((adapter) => (
            <div key={adapter.name} className="p-3 rounded-md bg-muted/50">
              <div className="font-medium">{adapter.name}</div>
              <div className="text-xs text-muted-foreground">{adapter.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Components */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Components</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="group p-6 border rounded-lg bg-card hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {feature.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/components/sheet"
            className="text-primary hover:underline text-sm"
          >
            View all 15 components →
          </Link>
        </div>
      </section>

      {/* Quick Code Example */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Example</h2>
        <div className="p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto">
          <pre className="text-foreground">{`import { useToast, useConfirm } from 'omnifeedback';

function MyComponent() {
  const toast = useToast();
  const confirm = useConfirm();

  const handleDelete = async () => {
    const ok = await confirm.danger({
      title: 'Delete item?',
      description: 'This action cannot be undone.',
    });

    if (ok) {
      // perform delete...
      toast.success('Item deleted!');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}`}</pre>
        </div>
      </section>
    </div>
  );
}
