'use client';

import { useState, useCallback } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Accordion from '@radix-ui/react-accordion';
import {
  Baby,
  Shield,
  Globe,
  GraduationCap,
  Briefcase,
  Heart,
  HandHeart,
  Home,
  DollarSign,
  Users,
  ChevronDown,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';

// ============================================================================
// Attribute Tag Groups — values match exact Findhelp API strings
// ============================================================================

interface AttributeTagGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  tags: { value: string; label: string }[];
}

const ATTRIBUTE_TAG_GROUPS: AttributeTagGroup[] = [
  {
    id: 'age',
    label: 'Age Group',
    icon: Baby,
    tags: [
      { value: 'children', label: 'Children (0–12)' },
      { value: 'school-aged children', label: 'School-Aged Children' },
      { value: 'teens', label: 'Teens (13–19)' },
      { value: 'young adults', label: 'Young Adults (18–25)' },
      { value: 'adults', label: 'Adults (26–64)' },
      { value: 'seniors', label: 'Seniors (65+)' },
    ],
  },
  {
    id: 'armed-forces',
    label: 'Armed Forces',
    icon: Shield,
    tags: [
      { value: 'active duty', label: 'Active Duty' },
      { value: 'national guard', label: 'National Guard' },
      { value: 'veterans', label: 'Veterans' },
    ],
  },
  {
    id: 'citizenship',
    label: 'Citizenship',
    icon: Globe,
    tags: [
      { value: 'immigrants', label: 'Immigrants' },
      { value: 'refugees', label: 'Refugees' },
      { value: 'undocumented', label: 'Undocumented' },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    tags: [
      { value: 'students', label: 'Students' },
    ],
  },
  {
    id: 'employment',
    label: 'Employment',
    icon: Briefcase,
    tags: [
      { value: 'employed', label: 'Employed' },
      { value: 'retirement', label: 'Retirement' },
      { value: 'unemployed', label: 'Unemployed' },
    ],
  },
  {
    id: 'gender-identity',
    label: 'Gender & Identity',
    icon: Heart,
    tags: [
      { value: 'female', label: 'Female' },
      { value: 'lgbtqia+', label: 'LGBTQIA+' },
      { value: 'male', label: 'Male' },
      { value: 'transgender or non-binary', label: 'Transgender or Non-Binary' },
    ],
  },
  {
    id: 'guardianship',
    label: 'Guardianship',
    icon: HandHeart,
    tags: [
      { value: 'foster youth', label: 'Foster Youth' },
    ],
  },
  {
    id: 'housing',
    label: 'Housing',
    icon: Home,
    tags: [
      { value: 'home owners', label: 'Home Owners' },
      { value: 'home renters', label: 'Home Renters' },
      { value: 'homeless', label: 'Homeless' },
      { value: 'near homeless', label: 'Near Homeless' },
      { value: 'runaways', label: 'Runaways' },
    ],
  },
  {
    id: 'income',
    label: 'Income',
    icon: DollarSign,
    tags: [
      { value: 'benefit recipients', label: 'Benefit Recipients' },
      { value: 'low-income', label: 'Low-Income' },
    ],
  },
  {
    id: 'household',
    label: 'Household',
    icon: Users,
    tags: [
      { value: 'families', label: 'Families' },
      { value: 'single parent', label: 'Single Parent' },
      { value: 'with children', label: 'With Children' },
      { value: 'individuals', label: 'Individuals' },
    ],
  },
];

// ============================================================================
// Component
// ============================================================================

interface AttributeTagFilterProps {
  selectedTags: Set<string>;
  onChange: (tags: Set<string>) => void;
}

export default function AttributeTagFilter({ selectedTags, onChange }: AttributeTagFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Set<string>>(new Set(selectedTags));

  // Sync draft when popover opens
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setDraft(new Set(selectedTags));
    }
    setOpen(nextOpen);
  }, [selectedTags]);

  const toggleTag = useCallback((value: string) => {
    setDraft(prev => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const handleApply = useCallback(() => {
    onChange(new Set(draft));
    setOpen(false);
  }, [draft, onChange]);

  const handleClearAll = useCallback(() => {
    setDraft(new Set());
  }, []);

  const selectedCount = selectedTags.size;

  // Count selected in draft per group
  const groupDraftCount = (group: AttributeTagGroup) =>
    group.tags.filter(t => draft.has(t.value)).length;

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCount > 0
              ? 'bg-fg-blue/10 text-fg-blue ring-1 ring-fg-blue/30'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          More Filters
          {selectedCount > 0 && (
            <span className="ml-0.5 w-5 h-5 rounded-full bg-fg-blue text-white text-xs flex items-center justify-center">
              {selectedCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          collisionPadding={16}
          sideOffset={8}
          className="w-80 max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
            <h3 className="text-sm font-semibold text-fg-navy">Who It Serves</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Filter programs by who they serve
            </p>
          </div>

          {/* Accordion groups */}
          <Accordion.Root
            type="multiple"
            defaultValue={['guardianship']}
            className="px-2 py-2"
          >
            {ATTRIBUTE_TAG_GROUPS.map((group) => {
              const Icon = group.icon;
              const draftCount = groupDraftCount(group);

              return (
                <Accordion.Item key={group.id} value={group.id} className="border-b border-gray-50 last:border-b-0">
                  <Accordion.Trigger className="flex items-center gap-2 w-full px-2 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-colors group">
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-fg-navy flex-1">{group.label}</span>
                    {draftCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-fg-blue text-white text-xs flex items-center justify-center flex-shrink-0">
                        {draftCount}
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-300 transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
                  </Accordion.Trigger>

                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                      {group.tags.map((tag) => {
                        const checked = draft.has(tag.value);
                        return (
                          <label
                            key={tag.value}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm ${
                              checked ? 'bg-fg-blue/5 text-fg-blue' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleTag(tag.value)}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-fg-blue focus:ring-fg-blue/30 flex-shrink-0"
                            />
                            <span className="truncate">{tag.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-10">
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              disabled={draft.size === 0}
            >
              Clear all
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 bg-fg-blue text-white text-sm font-medium rounded-lg hover:bg-fg-navy transition-colors"
            >
              Apply{draft.size > 0 ? ` (${draft.size})` : ''}
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
