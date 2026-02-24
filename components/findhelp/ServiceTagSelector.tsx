'use client';

import {
  Utensils,
  Home,
  Briefcase,
  Heart,
  GraduationCap,
  Car,
  Scale,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceTag } from '@/lib/findhelp';

/**
 * SDOH (Social Determinants of Health) Category Definitions
 * Maps broad categories to Findhelp service tag keywords
 */
interface SDOHCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  keywords: string[]; // Matches against tag id and label (case-insensitive)
}

export const SDOH_CATEGORIES: SDOHCategory[] = [
  {
    id: 'food',
    label: 'Food & Nutrition',
    description: 'Food pantries, meals, SNAP benefits',
    icon: Utensils,
    keywords: ['food', 'meal', 'nutrition', 'snap', 'wic', 'pantry', 'hunger'],
  },
  {
    id: 'housing',
    label: 'Housing & Shelter',
    description: 'Rent help, shelters, utilities',
    icon: Home,
    keywords: ['housing', 'shelter', 'rent', 'homeless', 'utility', 'utilities', 'energy'],
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    description: 'Medical, dental, mental health',
    icon: Heart,
    keywords: ['health', 'medical', 'dental', 'vision', 'mental', 'substance', 'addiction', 'crisis', 'disability'],
  },
  {
    id: 'employment',
    label: 'Employment & Income',
    description: 'Jobs, training, financial help',
    icon: Briefcase,
    keywords: ['work', 'job', 'employment', 'career', 'income', 'financial', 'money', 'tax', 'benefits'],
  },
  {
    id: 'education',
    label: 'Education',
    description: 'School, tutoring, college prep',
    icon: GraduationCap,
    keywords: ['education', 'school', 'tutor', 'ged', 'college', 'literacy', 'learn'],
  },
  {
    id: 'transportation',
    label: 'Transportation',
    description: 'Bus passes, rides, car help',
    icon: Car,
    keywords: ['transport', 'transit', 'bus', 'car', 'ride', 'travel'],
  },
  {
    id: 'legal',
    label: 'Legal Services',
    description: 'Legal aid, immigration, ID help',
    icon: Scale,
    keywords: ['legal', 'law', 'immigration', 'id ', 'identification', 'court', 'custody'],
  },
  {
    id: 'family',
    label: 'Family & Childcare',
    description: 'Childcare, parenting, family support',
    icon: Users,
    keywords: ['family', 'child', 'parent', 'baby', 'infant', 'youth', 'teen', 'senior', 'elder', 'aging'],
  },
];

/**
 * Match a service tag to SDOH categories based on keywords
 */
function matchTagToCategories(tag: ServiceTag): string[] {
  const tagText = `${tag.id} ${tag.label}`.toLowerCase();
  const matches: string[] = [];

  for (const category of SDOH_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (tagText.includes(keyword.toLowerCase())) {
        matches.push(category.id);
        break; // Only match once per category
      }
    }
  }

  return matches;
}

/**
 * Group service tags by SDOH category and sum counts
 */
export function groupTagsByCategory(tags: ServiceTag[]): Map<string, { tags: ServiceTag[]; totalCount: number }> {
  const grouped = new Map<string, { tags: ServiceTag[]; totalCount: number }>();

  // Initialize all categories
  for (const category of SDOH_CATEGORIES) {
    grouped.set(category.id, { tags: [], totalCount: 0 });
  }

  // Group tags
  for (const tag of tags) {
    const categoryMatches = matchTagToCategories(tag);
    const count = parseInt(tag.count || '0');

    for (const categoryId of categoryMatches) {
      const group = grouped.get(categoryId);
      if (group) {
        group.tags.push(tag);
        group.totalCount += count;
      }
    }
  }

  return grouped;
}

interface ServiceTagSelectorProps {
  tags: ServiceTag[];
  selectedTag: string | null; // Now stores comma-separated tag IDs
  onSelect: (tagIds: string, label: string) => void; // Updated to pass label too
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
            className="h-28 bg-gray-100 rounded-xl animate-pulse"
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

  // Group tags by SDOH category
  const groupedTags = groupTagsByCategory(tags);

  // Filter to categories with programs and sort by count
  const availableCategories = SDOH_CATEGORIES
    .filter((cat) => {
      const group = groupedTags.get(cat.id);
      return group && group.totalCount > 0;
    })
    .sort((a, b) => {
      const countA = groupedTags.get(a.id)?.totalCount || 0;
      const countB = groupedTags.get(b.id)?.totalCount || 0;
      return countB - countA;
    });

  if (availableCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No service categories available for this area.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-fg-navy mb-4 text-center">
        What kind of help are you looking for?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableCategories.map((category) => {
          const group = groupedTags.get(category.id)!;
          const Icon = category.icon;

          // Create comma-separated tag IDs for this category
          const tagIds = group.tags.map((t) => t.id).join(',');
          const isSelected = selectedTag === tagIds;

          return (
            <button
              key={category.id}
              onClick={() => onSelect(tagIds, category.label)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                isSelected
                  ? 'border-fg-blue bg-fg-blue/5 shadow-md'
                  : 'border-gray-200 bg-white hover:border-fg-blue/50'
              }`}
              aria-pressed={isSelected}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-fg-blue text-white' : 'bg-gray-100 text-fg-navy'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-sm font-semibold text-center leading-tight mb-1 ${
                  isSelected ? 'text-fg-blue' : 'text-fg-navy'
                }`}
              >
                {category.label}
              </span>
              <span className="text-xs text-gray-400 text-center">
                {group.totalCount.toLocaleString()} programs
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
