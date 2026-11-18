'use client';

import { Shield, Server, Key, Lock } from 'lucide-react';

export function PrivacySettingsPanel() {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-medium text-foreground">Your Data, Your Control</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            AWSUG Vadodara S3 Filesystem is designed with privacy and data sovereignty in mind
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border">
            <Server className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-2">Direct S3 Browser Transfers</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This app communicates with Amazon S3 directly from your web browser. Your files, metadata,
                and file contents are transferred strictly between your device and AWS S3. There is no
                proxy or backend server handling your files.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border">
            <Key className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-2">Local Storage Credentials</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your AWS Access Key ID, Secret Access Key, and configuration are persisted strictly in your
                browser's local storage for session convenience. They are never sent to any server other
                than Amazon S3 authenticated API endpoints. Always remember to disconnect on shared devices.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border">
            <Lock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-2">No Tracking or Ads</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                There are no third-party trackers, no advertisements, and no tracking cookies. Built by the
                community for pure utility and speed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
