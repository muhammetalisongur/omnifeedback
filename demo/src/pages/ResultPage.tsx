import React from 'react';
import { DemoSection } from '../components/DemoSection';
import { Button } from '../components/Button';

export function ResultPage(): React.ReactElement {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Result</h1>
        <p className="text-muted-foreground">
          Result pages for operation outcomes. Display success, error, or info states.
        </p>
      </div>

      <DemoSection
        title="Success Result"
        description="Positive outcome display."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Payment Successful</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Your payment of $99.00 has been processed successfully.
          </p>
          <div className="flex gap-2 justify-center">
            <Button>View Receipt</Button>
            <Button variant="outline">Back to Home</Button>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        title="Error Result"
        description="Negative outcome display."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Payment Failed</h3>
          <p className="text-muted-foreground text-sm mb-4">
            We couldn't process your payment. Please try again.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="destructive">Try Again</Button>
            <Button variant="outline">Contact Support</Button>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        title="Info Result"
        description="Neutral information display."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Verification Pending</h3>
          <p className="text-muted-foreground text-sm mb-4">
            We've sent a verification email to your inbox.
          </p>
          <Button variant="secondary">Resend Email</Button>
        </div>
      </DemoSection>

      <DemoSection
        title="Warning Result"
        description="Cautionary outcome display."
      >
        <div className="w-full p-8 border rounded-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Account Suspended</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Your account has been temporarily suspended. Please contact support.
          </p>
          <Button>Contact Support</Button>
        </div>
      </DemoSection>
    </div>
  );
}
