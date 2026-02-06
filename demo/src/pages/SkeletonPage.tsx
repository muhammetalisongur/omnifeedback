import React, { useState, useEffect } from 'react';
import { DemoSection } from '../components/DemoSection';
import { Button } from '../components/Button';

export function SkeletonPage(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const resetDemo = (): void => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skeleton</h1>
        <p className="text-muted-foreground">
          Placeholder loading states that mimic the shape of content.
        </p>
      </div>

      <DemoSection
        title="Basic Shapes"
        description="Different skeleton shapes for different content types."
      >
        <div className="w-full space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        title="Card Skeleton"
        description="Skeleton for card-like content."
      >
        <div className="w-full max-w-sm border rounded-lg p-4 space-y-4">
          <div className="h-40 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-full" />
            <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
          </div>
        </div>
      </DemoSection>

      <DemoSection
        title="List Skeleton"
        description="Skeleton for list items."
      >
        <div className="w-full space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-10 h-10 rounded bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="Loading to Content"
        description="Transition from skeleton to actual content."
      >
        <div className="w-full max-w-md">
          {isLoading ? (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded animate-pulse w-1/2" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <div className="font-semibold">John Doe</div>
                <div className="text-muted-foreground text-sm">john@example.com</div>
              </div>
            </div>
          )}
          <Button variant="outline" onClick={resetDemo} className="mt-4">
            Reset Demo
          </Button>
        </div>
      </DemoSection>
    </div>
  );
}
