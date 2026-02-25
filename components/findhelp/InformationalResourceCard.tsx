'use client';

import { track } from '@vercel/analytics';
import {
  BookOpen,
  FileText,
  Wrench,
  Play,
  Scale,
  ExternalLink,
  Download,
  File,
} from 'lucide-react';
import type { InformationalResource } from '@/lib/resources';

interface InformationalResourceCardProps {
  resource: InformationalResource;
}

const RESOURCE_TYPE_CONFIG: Record<string, { label: string; icon: typeof BookOpen }> = {
  guide: { label: 'Guide', icon: BookOpen },
  fact_sheet: { label: 'Fact Sheet', icon: FileText },
  toolkit: { label: 'Toolkit', icon: Wrench },
  video: { label: 'Video', icon: Play },
  flyer: { label: 'Flyer', icon: File },
  kyr: { label: 'Know Your Rights', icon: Scale },
  referral_tool: { label: 'Referral Tool', icon: Scale },
};

function getTypeConfig(resourceType: string) {
  return RESOURCE_TYPE_CONFIG[resourceType] ?? { label: resourceType, icon: FileText };
}

function isPdfUrl(url: string | null): boolean {
  return url?.toLowerCase().endsWith('.pdf') ?? false;
}

export default function InformationalResourceCard({ resource }: InformationalResourceCardProps) {
  const typeConfig = getTypeConfig(resource.resource_type);
  const TypeIcon = typeConfig.icon;
  const isMultilingual = resource.languages.length > 1 || (resource.languages.length === 1 && resource.languages[0] !== 'en');
  const isPdf = isPdfUrl(resource.url);
  const hasUrl = resource.url != null;

  const handleClick = () => {
    if (!hasUrl) return;
    track('informational_resource_click', {
      title: resource.title,
      type: resource.resource_type,
      source_org: resource.source_org,
    });
    window.open(resource.url!, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={handleClick}
      className={`bg-blue-50/50 border-l-4 border-l-teal-400 rounded-xl border border-gray-200 p-4 transition-all ${
        hasUrl ? 'hover:shadow-md hover:border-gray-300 cursor-pointer group' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-fg-navy line-clamp-2 ${hasUrl ? 'group-hover:text-fg-blue transition-colors' : ''}`}>
            {resource.title}
          </h3>
          {resource.source_org && (
            <p className="text-sm text-gray-500 truncate mt-0.5">{resource.source_org}</p>
          )}
        </div>
        {hasUrl && (
          <div className="flex-shrink-0 p-1.5 text-gray-400 group-hover:text-fg-blue transition-colors">
            {isPdf ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
          </div>
        )}
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{resource.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {/* Resource type badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <TypeIcon className="w-3 h-3" />
          {typeConfig.label}
        </span>

        {/* Language badges — only show if multilingual */}
        {isMultilingual && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            {resource.languages.map(l => l.toUpperCase()).join(' | ')}
          </span>
        )}

        {/* Action hint */}
        {hasUrl && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
            {isPdf ? 'PDF Download' : 'External Link'}
          </span>
        )}
      </div>
    </article>
  );
}
