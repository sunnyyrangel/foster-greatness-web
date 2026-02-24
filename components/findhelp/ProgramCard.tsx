'use client';

import { track } from '@vercel/analytics';
import { Heart, Phone, Globe, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import type { ProgramLite, NextStep } from '@/lib/findhelp';
import {
  cleanDescriptionInline,
  getAvailabilityInfo,
  getFreeReducedText,
  getOpenStatus,
  getPrimaryContact,
} from '@/lib/findhelp';
import { useResourceBoard } from './ResourceBoardContext';

interface ProgramCardProps {
  program: ProgramLite;
  onClick: () => void;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  id?: string;
  compact?: boolean;
  source?: 'community' | 'findhelp';
}

// Render action button for next step
function NextStepButton({ step, program }: { step: NextStep; program: ProgramLite }) {
  const office = program.offices[0];

  switch (step.channel) {
    case 'phone':
    case 'phone_office':
      const phone = step.contact || office?.phone_number;
      if (!phone) return null;
      return (
        <a
          href={`tel:${phone}`}
          onClick={(e) => { e.stopPropagation(); track('service_contact_click', { type: 'call', program: program.name }); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-fg-blue/10 text-fg-blue rounded-lg text-sm font-medium hover:bg-fg-blue/20 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
      );

    case 'website':
    case 'website_office':
    case 'external_apply':
      const url = step.contact || office?.website_url || program.website_url;
      if (!url) return null;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { e.stopPropagation(); track('service_contact_click', { type: 'website', program: program.name }); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-fg-blue/10 text-fg-blue rounded-lg text-sm font-medium hover:bg-fg-blue/20 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          Website
        </a>
      );

    case 'email':
    case 'email_office':
      const email = step.contact || office?.email;
      if (!email) return null;
      return (
        <a
          href={`mailto:${email}`}
          onClick={(e) => { e.stopPropagation(); track('service_contact_click', { type: 'email', program: program.name }); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-fg-blue/10 text-fg-blue rounded-lg text-sm font-medium hover:bg-fg-blue/20 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          Email
        </a>
      );

    case 'location':
      const address = office
        ? `${office.address1 || ''} ${office.city || ''} ${office.state || ''} ${office.postal || ''}`
        : step.contact;
      if (!address) return null;
      return (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(address.trim())}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { e.stopPropagation(); track('service_contact_click', { type: 'directions', program: program.name }); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-fg-blue/10 text-fg-blue rounded-lg text-sm font-medium hover:bg-fg-blue/20 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          Directions
        </a>
      );

    default:
      return null;
  }
}

export default function ProgramCard({ program, onClick, isHighlighted, onMouseEnter, onMouseLeave, id, compact, source }: ProgramCardProps) {
  const { addToBoard, removeFromBoard, isInBoard } = useResourceBoard();
  const isSaved = isInBoard(program.id);

  const availability = getAvailabilityInfo(program.availability);
  const freeReduced = getFreeReducedText(program.free_or_reduced);
  const openStatus = getOpenStatus(program.offices);
  const contact = getPrimaryContact(program);

  // Unique next steps (deduplicate by channel)
  const uniqueSteps = program.next_steps.reduce((acc, step) => {
    if (!acc.some((s) => s.channel === step.channel)) {
      acc.push(step);
    }
    return acc;
  }, [] as NextStep[]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    track(isSaved ? 'service_program_unsave' : 'service_program_save', { program: program.name });
    if (isSaved) {
      removeFromBoard(program.id);
    } else {
      addToBoard({
        id: program.id,
        name: program.name,
        provider: program.provider_name,
        description: cleanDescriptionInline(program.description),
        phone: contact?.phone || undefined,
        address: contact?.address || undefined,
        website: contact?.website || undefined,
        savedAt: Date.now(),
      });
    }
  };

  // Compact card for widget mode
  if (compact) {
    return (
      <article
        id={id}
        onClick={onClick}
        className="bg-white rounded-xl border border-gray-200 px-4 py-3 hover:shadow-md hover:border-fg-blue/30 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-fg-navy group-hover:text-fg-blue transition-colors truncate">
              {program.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500 truncate">{program.provider_name}</span>
              {source === 'community' && (
                <span className="flex-shrink-0 text-xs font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                  Community
                </span>
              )}
              {program.distance !== undefined && program.distance > 0 && (
                <span className="flex-shrink-0 text-xs text-gray-400">
                  {program.distance.toFixed(1)} mi
                </span>
              )}
              {freeReduced && (
                <span className="flex-shrink-0 text-xs font-medium text-green-600">{freeReduced}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {uniqueSteps.slice(0, 2).map((step, i) => (
              <NextStepButton key={`${step.channel}-${i}`} step={step} program={program} />
            ))}
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-fg-blue transition-colors" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      id={id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-fg-blue/30 transition-all cursor-pointer group ${
        isHighlighted ? 'ring-2 ring-fg-blue shadow-lg' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-fg-navy group-hover:text-fg-blue transition-colors line-clamp-2">
            {program.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{program.provider_name}</p>
        </div>

        <button
          onClick={handleSaveToggle}
          className={`flex-shrink-0 p-2 rounded-full transition-colors ${
            isSaved
              ? 'bg-red-100 text-red-500 hover:bg-red-200'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
          }`}
          aria-label={isSaved ? 'Remove from saved programs' : 'Save program'}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {source === 'community' && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
            Community Recommended
          </span>
        )}

        {source !== 'community' && (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${availability.color}`}>
            {availability.text}
          </span>
        )}

        {freeReduced && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {freeReduced}
          </span>
        )}

        {program.distance !== undefined && program.distance > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <MapPin className="w-3 h-3" />
            {program.distance.toFixed(1)} mi
          </span>
        )}

        {openStatus && (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              openStatus.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Clock className="w-3 h-3" />
            {openStatus.text}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{cleanDescriptionInline(program.description)}</p>

      {/* Next Steps / Actions */}
      {uniqueSteps.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uniqueSteps.slice(0, 3).map((step, i) => (
            <NextStepButton key={`${step.channel}-${i}`} step={step} program={program} />
          ))}
          {uniqueSteps.length > 3 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500">
              +{uniqueSteps.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Click hint */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end">
        <span className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-fg-blue transition-colors">
          View details
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </article>
  );
}
