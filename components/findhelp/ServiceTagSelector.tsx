'use client';

import {
  Utensils,
  Home,
  Package,
  Car,
  Heart,
  DollarSign,
  Users,
  GraduationCap,
  Briefcase,
  Scale,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceTag } from '@/lib/findhelp';

// ============================================================================
// Findhelp Categories — pulled directly from findhelp.org
// ============================================================================

interface Category {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Parent subcategory tag IDs from findhelp.org for this category */
  parentTags: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    label: 'Food',
    description: 'Food pantries, meals, groceries',
    icon: Utensils,
    parentTags: [
      'community gardens',
      'emergency food',
      'food delivery',
      'food pantry',
      'help pay for food',
      'meals',
      'nutrition education',
    ],
  },
  {
    id: 'housing',
    label: 'Housing',
    description: 'Shelters, rent help, utilities',
    icon: Home,
    parentTags: [
      'help find housing',
      'help pay for housing',
      'housing advice',
      'maintenance & repairs',
      'residential housing',
      'temporary shelter',
    ],
  },
  {
    id: 'goods',
    label: 'Goods',
    description: 'Clothing, supplies, personal items',
    icon: Package,
    parentTags: [
      'baby supplies',
      'clothing',
      'home goods',
      'medical supplies',
      'personal safety',
      'toys & gifts',
    ],
  },
  {
    id: 'transit',
    label: 'Transit',
    description: 'Bus passes, rides, car help',
    icon: Car,
    parentTags: [
      'help pay for transit',
      'transportation',
    ],
  },
  {
    id: 'health',
    label: 'Health',
    description: 'Medical, dental, mental health',
    icon: Heart,
    parentTags: [
      'addiction & recovery',
      'dental care',
      'end-of-life care',
      'health education',
      'help pay for healthcare',
      'medical care',
      'mental health care',
      'sexual and reproductive health',
      'vision care',
    ],
  },
  {
    id: 'money',
    label: 'Money',
    description: 'Financial help, benefits, taxes',
    icon: DollarSign,
    parentTags: [
      'financial assistance',
      'financial education',
      'government benefits',
      'insurance',
      'loans',
      'tax preparation',
    ],
  },
  {
    id: 'care',
    label: 'Care',
    description: 'Childcare, foster care, support',
    icon: Users,
    parentTags: [
      'adoption & foster care',
      'animal welfare',
      'community support services',
      'daytime care',
      'end-of-life care',
      'navigating the system',
      'physical safety',
      'residential care',
      'support network',
    ],
  },
  {
    id: 'education',
    label: 'Education',
    description: 'School, tutoring, college prep',
    icon: GraduationCap,
    parentTags: [
      'help find school',
      'help pay for school',
      'more education',
      'preschool',
      'screening & exams',
      'skills & training',
    ],
  },
  {
    id: 'work',
    label: 'Work',
    description: 'Jobs, training, resume help',
    icon: Briefcase,
    parentTags: [
      'help find work',
      'help pay for work expenses',
      'skills & training',
      'supported employment',
      'workplace rights',
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    description: 'Legal aid, immigration, ID help',
    icon: Scale,
    parentTags: [
      'advocacy & legal aid',
      'mediation',
      'notary',
      'representation',
      'translation & interpretation',
    ],
  },
];

// Build a fast lookup: parent tag ID → category ID
const PARENT_TAG_TO_CATEGORY = new Map<string, string[]>();
for (const cat of CATEGORIES) {
  for (const tag of cat.parentTags) {
    const existing = PARENT_TAG_TO_CATEGORY.get(tag) || [];
    existing.push(cat.id);
    PARENT_TAG_TO_CATEGORY.set(tag, existing);
  }
}

// ============================================================================
// Grouping Logic
// ============================================================================

/**
 * Group Findhelp service tags into categories.
 * Only parent tags (from findhelp.org) are matched.
 * The Findhelp search API automatically includes child tags when searching by parent.
 */
export function groupTagsByCategory(tags: ServiceTag[]): Map<string, { tags: ServiceTag[] }> {
  const grouped = new Map<string, { tags: ServiceTag[] }>();

  for (const category of CATEGORIES) {
    grouped.set(category.id, { tags: [] });
  }

  for (const tag of tags) {
    const categoryIds = PARENT_TAG_TO_CATEGORY.get(tag.id);
    if (!categoryIds) continue;

    for (const categoryId of categoryIds) {
      const group = grouped.get(categoryId);
      if (group) {
        group.tags.push(tag);
      }
    }
  }

  return grouped;
}

// ============================================================================
// Component
// ============================================================================

interface ServiceTagSelectorProps {
  tags: ServiceTag[];
  selectedTag: string | null;
  onSelect: (tagIds: string, label: string, categoryId: string) => void;
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
        {Array.from({ length: 10 }).map((_, i) => (
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

  const groupedTags = groupTagsByCategory(tags);

  return (
    <div>
      <h2 className="text-lg font-semibold text-fg-navy mb-4 text-center">
        What kind of help are you looking for?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((category) => {
          const group = groupedTags.get(category.id)!;
          const Icon = category.icon;
          const tagIds = group.tags.map((t) => t.id).join(',');
          const isSelected = selectedTag === tagIds;

          return (
            <button
              key={category.id}
              onClick={() => onSelect(tagIds, category.label, category.id)}
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
                {category.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
