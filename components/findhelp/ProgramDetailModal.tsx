'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Phone,
  Globe,
  Mail,
  MapPin,
  Clock,
  Copy,
  Printer,
  Check,
  AlertCircle,
  Languages,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { Program, Office, NextStep } from '@/lib/findhelp';
import { cleanDescriptionBlock, formatOfficeHours, formatAddress } from '@/lib/findhelp';
import type { CommunityResource } from '@/lib/resources';
import { useResourceBoard } from './ResourceBoardContext';

interface ProgramDetailModalProps {
  programId: string;
  zip: string;
  isOpen: boolean;
  onClose: () => void;
  onTagSearch?: (tagId: string, label: string) => void;
  communityResource?: CommunityResource | null;
}

// Render contact button
function ContactButton({
  icon: Icon,
  label,
  href,
  external = false,
}: {
  icon: typeof Phone;
  label: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 px-4 py-3 bg-fg-blue/10 text-fg-blue rounded-xl font-medium hover:bg-fg-blue/20 transition-colors"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </a>
  );
}

// Office card component
function OfficeCard({ office, index }: { office: Office; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const address = formatAddress(office);
  const hours = formatOfficeHours(office);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h4 className="font-semibold text-fg-navy">
            {office.name || `Location ${index + 1}`}
          </h4>
          {address && <p className="text-sm text-gray-500 truncate">{address}</p>}
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
            >
              <MapPin className="w-4 h-4" />
              {address}
            </a>
          )}

          {office.phone_number && (
            <a
              href={`tel:${office.phone_number}`}
              className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
            >
              <Phone className="w-4 h-4" />
              {office.phone_number}
            </a>
          )}

          {office.email && (
            <a
              href={`mailto:${office.email}`}
              className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
            >
              <Mail className="w-4 h-4" />
              {office.email}
            </a>
          )}

          {office.website_url && (
            <a
              href={office.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
            >
              <Globe className="w-4 h-4" />
              Visit website
            </a>
          )}

          {hours.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4" />
                Hours
              </div>
              <ul className="text-sm text-gray-600 space-y-0.5 pl-6">
                {hours.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {office.supported_languages && office.supported_languages.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Languages className="w-4 h-4" />
                Languages: {office.supported_languages.join(', ')}
              </div>
            </div>
          )}

          {office.notes && (
            <p className="text-sm text-gray-600 italic pt-2 border-t border-gray-100">
              {office.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProgramDetailModal({
  programId,
  zip,
  isOpen,
  onClose,
  onTagSearch,
  communityResource,
}: ProgramDetailModalProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { addToBoard, removeFromBoard, isInBoard } = useResourceBoard();
  const isSaved = communityResource
    ? isInBoard(communityResource.id)
    : program
    ? isInBoard(program.id)
    : false;

  // Fetch program details when modal opens
  useEffect(() => {
    if (!isOpen || !programId || !zip) {
      setProgram(null);
      setLoading(true);
      setError(null);
      return;
    }

    if (communityResource) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/findhelp/programs/${encodeURIComponent(programId)}?zip=${zip}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load program details');
        }

        setProgram(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load program details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, programId, zip, communityResource]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/services?program=${programId}&zip=${zip}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToggle = () => {
    if (communityResource) {
      const rid = communityResource.id;
      const action = isInBoard(rid) ? 'service_program_unsave' : 'service_program_save';
      trackEvent(action, { program_name: communityResource.name, source: 'community' });
      if (isInBoard(rid)) {
        removeFromBoard(rid);
      } else {
        addToBoard({
          id: rid,
          name: communityResource.name,
          provider: communityResource.provider_name,
          description: communityResource.description,
          phone: communityResource.phone,
          address: communityResource.address,
          website: communityResource.website_url,
          savedAt: Date.now(),
        });
      }
      return;
    }

    if (!program) return;

    trackEvent(isSaved ? 'service_program_unsave' : 'service_program_save', { program_name: program.name, source: 'findhelp' });
    if (isSaved) {
      removeFromBoard(program.id);
    } else {
      const office = program.offices[0];
      addToBoard({
        id: program.id,
        name: program.name,
        provider: program.provider_name,
        description: cleanDescriptionBlock(program.description),
        phone: office?.phone_number || undefined,
        address: office ? formatAddress(office) : undefined,
        website: office?.website_url || program.website_url || undefined,
        savedAt: Date.now(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-y-8 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-3xl bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 text-gray-400 hover:text-fg-blue rounded-lg hover:bg-gray-100 transition-colors"
              title="Copy link"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-400 hover:text-fg-blue rounded-lg hover:bg-gray-100 transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fg-blue" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {communityResource && !loading && (
            <div className="space-y-6">
              {/* Title and Save */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                      Community Recommended
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-fg-navy">{communityResource.name}</h2>
                </div>
                <button
                  onClick={handleSaveToggle}
                  className={`flex-shrink-0 p-3 rounded-full transition-colors ${
                    isSaved
                      ? 'bg-red-100 text-red-500 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
                  }`}
                  aria-label={isSaved ? 'Remove from saved' : 'Save program'}
                >
                  <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-fg-navy mb-2">About this program</h3>
                <p className="text-gray-600 whitespace-pre-line">{communityResource.description}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {communityResource.phone && (
                  <a
                    href={`tel:${communityResource.phone}`}
                    className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {communityResource.phone}
                  </a>
                )}
                {communityResource.website_url && (
                  <a
                    href={communityResource.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    Visit website
                  </a>
                )}
                {communityResource.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(communityResource.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
                  >
                    <MapPin className="w-4 h-4" />
                    {communityResource.address}
                  </a>
                )}
              </div>

              {/* Category */}
              <div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {communityResource.category}
                </span>
              </div>
            </div>
          )}

          {program && !loading && !error && (
            <div className="space-y-6">
              {/* Title and Save */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-fg-navy">{program.name}</h2>
                  <p className="text-gray-500">{program.provider_name}</p>
                </div>
                <button
                  onClick={handleSaveToggle}
                  className={`flex-shrink-0 p-3 rounded-full transition-colors ${
                    isSaved
                      ? 'bg-red-100 text-red-500 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
                  }`}
                  aria-label={isSaved ? 'Remove from saved' : 'Save program'}
                >
                  <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-fg-navy mb-2">About this program</h3>
                <p className="text-gray-600 whitespace-pre-line">{cleanDescriptionBlock(program.description)}</p>
              </div>

              {/* Eligibility / Rules */}
              {(() => {
                const displayRules = (program.rules || [])
                  .map((rule) =>
                    rule.description ||
                    (rule.min_age && rule.max_age
                      ? `Ages ${rule.min_age}-${rule.max_age}`
                      : rule.min_age
                      ? `Age ${rule.min_age}+`
                      : rule.max_age
                      ? `Under age ${rule.max_age}`
                      : rule.type) ||
                    null
                  )
                  .filter(Boolean);

                return displayRules.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-fg-navy mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Who can get help
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {displayRules.map((text, i) => (
                        <li key={i}>{text}</li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })()}

              {program.rule_attributes && program.rule_attributes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-fg-navy mb-2">Additional requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {program.rule_attributes.map((attr, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Supported Languages */}
              {program.supported_languages && program.supported_languages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-fg-navy mb-2 flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {program.supported_languages.map((lang, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-fg-blue/10 text-fg-blue rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Coverage Area */}
              {program.coverage_description && (
                <div>
                  <h3 className="font-semibold text-fg-navy mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Service area
                  </h3>
                  <p className="text-gray-600">{program.coverage_description}</p>
                </div>
              )}

              {/* Locations / Offices */}
              {program.offices.length > 0 && (
                <div>
                  <h3 className="font-semibold text-fg-navy mb-3">
                    {program.offices.length === 1 ? 'Location' : `Locations (${program.offices.length})`}
                  </h3>
                  <div className="space-y-3">
                    {program.offices.map((office, i) => (
                      <OfficeCard key={office.office_numeric_id || i} office={office} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Service Tags */}
              {program.service_tags && program.service_tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-fg-navy mb-2">Services provided</h3>
                  <p className="text-xs text-gray-400 mb-2">Click a tag to search for similar programs</p>
                  <div className="flex flex-wrap gap-2">
                    {program.service_tags.map((tag, i) => (
                      <button
                        key={i}
                        onClick={() => onTagSearch?.(tag, tag.replace(/_/g, ' '))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize hover:bg-fg-blue/10 hover:text-fg-blue transition-colors cursor-pointer"
                      >
                        {tag.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with community resource actions */}
        {communityResource && !loading && (
          <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {communityResource.phone && (
                <a
                  href={`tel:${communityResource.phone}`}
                  className="flex items-center gap-3 px-4 py-3 bg-fg-blue/10 text-fg-blue rounded-xl font-medium hover:bg-fg-blue/20 transition-colors"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{communityResource.phone}</span>
                </a>
              )}
              {communityResource.website_url && (
                <a
                  href={communityResource.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-fg-blue/10 text-fg-blue rounded-xl font-medium hover:bg-fg-blue/20 transition-colors"
                >
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">Visit website</span>
                </a>
              )}
              {communityResource.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(communityResource.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-fg-blue/10 text-fg-blue rounded-xl font-medium hover:bg-fg-blue/20 transition-colors"
                >
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">Get directions</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer with main actions */}
        {program && !loading && !error && (
          <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {(program.next_steps || []).slice(0, 4).map((step, i) => {
                const office = program.offices[0];

                switch (step.channel) {
                  case 'phone':
                  case 'phone_office':
                    const phone = step.contact || office?.phone_number;
                    if (!phone) return null;
                    return (
                      <ContactButton
                        key={i}
                        icon={Phone}
                        label={phone}
                        href={`tel:${phone}`}
                      />
                    );

                  case 'website':
                  case 'website_office':
                  case 'external_apply':
                    const url = step.contact || office?.website_url || program.website_url;
                    if (!url) return null;
                    return (
                      <ContactButton
                        key={i}
                        icon={Globe}
                        label="Visit website"
                        href={url}
                        external
                      />
                    );

                  case 'email':
                  case 'email_office':
                    const email = step.contact || office?.email;
                    if (!email) return null;
                    return (
                      <ContactButton
                        key={i}
                        icon={Mail}
                        label={email}
                        href={`mailto:${email}`}
                      />
                    );

                  case 'location':
                    if (!office) return null;
                    const address = formatAddress(office);
                    return (
                      <ContactButton
                        key={i}
                        icon={MapPin}
                        label="Get directions"
                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                        external
                      />
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
