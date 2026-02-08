import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlaygroundStore, type AdapterType } from '../stores/playground-store';

const features = [
  { icon: '🔔', name: 'Toast', description: 'Notification messages with variants and positions', path: '/toast' },
  { icon: '📦', name: 'Modal', description: 'Dialog windows with custom content', path: '/modal' },
  { icon: '⏳', name: 'Loading', description: 'Loading indicators with wrap() pattern', path: '/loading' },
  { icon: '❓', name: 'Confirm', description: 'Promise-based confirmation dialogs', path: '/confirm' },
  { icon: '📊', name: 'Progress', description: 'Determinate and indeterminate progress', path: '/progress' },
  { icon: '📂', name: 'Drawer', description: 'Slide-out panels from any edge', path: '/drawer' },
];

const adapters: { name: string; value: AdapterType; description: string }[] = [
  { name: 'Headless', value: 'headless', description: 'Pure Tailwind CSS, zero dependencies' },
  { name: 'shadcn/ui', value: 'shadcn', description: 'Radix UI primitives + Tailwind' },
  { name: 'Mantine', value: 'mantine', description: 'Full-featured React components' },
  { name: 'Chakra UI', value: 'chakra', description: 'Simple, modular components' },
  { name: 'MUI', value: 'mui', description: 'Material Design components' },
  { name: 'Ant Design', value: 'antd', description: 'Enterprise-level UI library' },
];

export function HomePage(): React.ReactElement {
  const navigate = useNavigate();
  const setAdapterType = usePlaygroundStore((s) => s.setAdapterType);
  const adapterType = usePlaygroundStore((s) => s.adapterType);

  const handleAdapterClick = (value: AdapterType): void => {
    setAdapterType(value);
    navigate('/toast');
  };

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
            to="/toast"
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
          Click an adapter to select it and explore components with that UI library.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {adapters.map((adapter) => (
            <button
              key={adapter.value}
              onClick={() => handleAdapterClick(adapter.value)}
              className={`p-3 rounded-md text-left transition-colors cursor-pointer
                ${adapterType === adapter.value
                  ? 'bg-primary/10 border border-primary'
                  : 'bg-muted/50 hover:bg-muted border border-transparent'
                }`}
            >
              <div className="font-medium">{adapter.name}</div>
              <div className="text-xs text-muted-foreground">{adapter.description}</div>
            </button>
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
            to="/sheet"
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
