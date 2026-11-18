'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Heart } from 'lucide-react';

export function SidebarDiscordCta() {
  return (
    <div className="flex-shrink-0 border-t border-border px-3 py-3">
      <div className="p-3 rounded-xl bg-surface-sunken border border-border/80 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-4 shrink-0">
            <Image
              src="/logo.png"
              alt="AWSUG Vadodara"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs font-semibold text-foreground">AWSUG Vadodara</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Community built Amazon S3 Drive explorer.
        </p>
        <a
          href="https://aws.amazon.com/developer/community/usergroups/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
        >
          AWS Community
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
