'use client';

import { useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center gap-8 mb-16 min-h-[60vh]">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We encountered an error while loading your dashboard. This has been
            logged and we&apos;ll look into it.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error.message && (
            <div className="p-4 rounded-md bg-muted text-sm">
              <p className="font-mono text-xs wrap-break-word">
                {error.message}
              </p>
            </div>
          )}
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="w-full"
          >
            Go to homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
