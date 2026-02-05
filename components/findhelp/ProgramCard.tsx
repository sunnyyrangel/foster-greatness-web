'use client';

import { Heart, Phone, Globe, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import type { ProgramLite, NextStep, Office } from '@/lib/findhelp';
import { useResourceBoard } from './ResourceBoardContext';

interface ProgramCardProps {
  program: ProgramLite;
  onClick: () => void;
}

// Get availability badge color and text
function getAvailabilityInfo(availability: string) {
  switch (availability) {
    case 'available':
      return { color: 'bg-green-100 text-green-700', text: 'Available' };
    case 'limited':
      return { color: 'bg-yellow-100 text-yellow-700', text: 'Limited' };
    case 'unavailable':
      return { color: 'bg-red-100 text-red-700', text: 'Unavailable' };
    default:
      return { color: 'bg-gray-100 text-gray-700', text: 'Unknown' };
  }
}

// Get free/reduced indicator
function getFreeReducedText(freeOrReduced: string) {
  switch (freeOrReduced) {
    case 'free':
      return 'Free';
    case 'reduced':
      return 'Reduced cost';
    default:
      return null;
  }
}

// Get open status from nearest office
function getOpenStatus(offices: Office[]): { text: string; isOpen: boolean } | null {
  if (!offices.length) return null;

  // Find first office with open_now_info
  const officeWithHours = offices.find((o) => o.open_now_info);
  if (!officeWithHours?.open_now_info) return null;

  const info = officeWithHours.open_now_info;
  if (info.is_open) {
    return {
      text: info.closes_at ? `Open until ${info.closes_at}` : 'Open now',
      isOpen: true,
    };
  } else {
    return {
      text: info.opens_at ? `Opens ${info.opens_at}` : 'Closed',
      isOpen: false,
    };
  }
}

// Get primary contact info from offices
function getPrimaryContact(program: ProgramLite) {
  const office = program.offices[0];
  if (!office) return null;

  const address = [office.address1, office.city, office.state, office.postal]
    .filter(Boolean)
    .join(', ');

  return {
    phone: office.phone_number,
    address: address || null,
    website: office.website_url || program.website_url,
  };
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
          onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => e.stopPropagation()}
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

export default function ProgramCard({ program, onClick }: ProgramCardProps) {
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
    if (isSaved) {
      removeFromBoard(program.id);
    } else {
      addToBoard({
        id: program.id,
        name: program.name,
        provider: program.provider_name,
        phone: contact?.phone || undefined,
        address: contact?.address || undefined,
        website: contact?.website || undefined,
        savedAt: Date.now(),
      });
    }
  };

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-fg-blue/30 transition-all cursor-pointer group"
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
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${availability.color}`}>
          {availability.text}
        </span>

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
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{program.description}</p>

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
