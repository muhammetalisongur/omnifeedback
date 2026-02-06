import React from 'react';
import { DemoSection } from '../components/DemoSection';
import { Button } from '../components/Button';

export function EmptyPage(): React.ReactElement {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Empty</h1>
        <p className="text-muted-foreground">
          Empty state components for when there's no data to display.
        </p>
      </div>

      <DemoSection
        title="Basic Empty State"
        description="Simple empty state with message."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-medium mb-2">No messages</h3>
          <p className="text-muted-foreground text-sm">
            You don't have any messages yet.
          </p>
        </div>
      </DemoSection>

      <DemoSection
        title="With Action"
        description="Empty state with a call-to-action button."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No documents</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first document to get started.
          </p>
          <Button>Create Document</Button>
        </div>
      </DemoSection>

      <DemoSection
        title="Search Empty"
        description="Empty state for no search results."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button variant="outline">Clear Filters</Button>
        </div>
      </DemoSection>

      <DemoSection
        title="Error Empty"
        description="Empty state for error scenarios."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium mb-2">Failed to load</h3>
          <p className="text-muted-foreground text-sm mb-4">
            There was an error loading the data. Please try again.
          </p>
          <Button variant="secondary">Retry</Button>
        </div>
      </DemoSection>

      <DemoSection
        title="Custom Illustration"
        description="Empty state with custom illustration."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <svg
            className="w-24 h-24 mx-auto mb-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground text-sm">
            Start by creating your first project.
          </p>
        </div>
      </DemoSection>
    </div>
  );
}
