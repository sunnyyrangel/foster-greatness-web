'use client';

import {
  Utensils,
  Home,
  Briefcase,
  Heart,
  GraduationCap,
  DollarSign,
  Car,
  Shield,
  Baby,
  Scale,
  Users,
  Shirt,
  Lightbulb,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceTag } from '@/lib/findhelp';

// Map service tags to icons
const tagIconMap: Record<string, LucideIcon> = {
  food: Utensils,
  housing: Home,
  work: Briefcase,
  health: Heart,
  healthcare: Heart,
  mental: Heart,
  education: GraduationCap,
  money: DollarSign,
  financial: DollarSign,
  transit: Car,
  transportation: Car,
  legal: Scale,
  family: Users,
  childcare: Baby,
  clothing: Shirt,
  utilities: Lightbulb,
  safety: Shield,
};

// Get icon for a service tag (case-insensitive match)
function getIconForTag(tagId: string, label: string): LucideIcon {
  const lowerLabel = label.toLowerCase();
  const lowerId = tagId.toLowerCase();

  // Check label and id for matches
  for (const [key, icon] of Object.entries(tagIconMap)) {
    if (lowerLabel.includes(key) || lowerId.includes(key)) {
      return icon;
    }
  }

  return HelpCircle;
}

interface ServiceTagSelectorProps {
  tags: ServiceTag[];
  selectedTag: string | null;
  onSelect: (tagId: string) => void;
  isLoading?: boolean;
}

export default function ServiceTagSelector({
  tags,
  selectedTag,
  onSelect,
  isLoading = false,
}: ServiceTagSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No service categories available for this area.</p>
      </div>
    );
  }

  // Sort tags by count (descending) and take top tags
  const sortedTags = [...tags].sort(
    (a, b) => parseInt(b.count || '0') - parseInt(a.count || '0')
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-fg-navy mb-4 text-center">
        What kind of help are you looking for?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedTags.map((tag) => {
          const Icon = getIconForTag(tag.id, tag.label);
          const isSelected = selectedTag === tag.id;
          const count = parseInt(tag.count || '0');

          return (
            <button
              key={tag.id}
              onClick={() => onSelect(tag.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                isSelected
                  ? 'border-fg-blue bg-fg-blue/5 shadow-md'
                  : 'border-gray-200 bg-white hover:border-fg-blue/50'
              }`}
              aria-pressed={isSelected}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                  isSelected ? 'bg-fg-blue text-white' : 'bg-gray-100 text-fg-navy'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-sm font-medium text-center leading-tight ${
                  isSelected ? 'text-fg-blue' : 'text-fg-navy'
                }`}
              >
                {tag.label}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {count} {count === 1 ? 'program' : 'programs'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
