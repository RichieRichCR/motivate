'use client';

import { useEffect, useState } from 'react';
import { getCurrentVersion } from '@/lib/register-sw';

/**
 * Example component showing current app version
 * Can be used in a footer, settings page, or about dialog
 */
export function AppVersion() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    getCurrentVersion().then((info) => {
      if (info?.version) {
        setVersion(info.version.substring(0, 7));
      }
    });
  }, []);

  if (!version) return null;

  return (
    <div className="text-xs text-muted-foreground">Version: {version}</div>
  );
}
