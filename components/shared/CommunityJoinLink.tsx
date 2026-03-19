'use client';

import { trackGoogleConversion, CONVERSION_LABELS } from '@/lib/analytics';

interface CommunityJoinLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function CommunityJoinLink({ href, className, children, onClick }: CommunityJoinLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        trackGoogleConversion(CONVERSION_LABELS.community_join);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
