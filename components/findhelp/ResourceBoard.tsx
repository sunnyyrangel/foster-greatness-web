'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { X, Trash2, Mail, Share2, Printer, Phone, MapPin, Globe, ChevronRight } from 'lucide-react';
import { useResourceBoard } from './ResourceBoardContext';

interface ResourceBoardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceBoard({ isOpen, onClose }: ResourceBoardProps) {
  const { savedPrograms, removeFromBoard, clearBoard } = useResourceBoard();
  const [confirmClear, setConfirmClear] = useState(false);

  // Format programs for export
  const formatProgramsText = () => {
    return savedPrograms
      .map((p) => {
        const lines = [`${p.name} (${p.provider})`];
        if (p.description) lines.push(`${p.description}`);
        if (p.phone) lines.push(`Phone: ${p.phone}`);
        if (p.address) lines.push(`Address: ${p.address}`);
        if (p.website) lines.push(`Website: ${p.website}`);
        return lines.join('\n');
      })
      .join('\n\n---\n\n');
  };

  // Email export
  const handleEmail = () => {
    trackEvent('service_board_export', { method: 'email', count: savedPrograms.length });
    const subject = encodeURIComponent('My Saved Programs - Foster Greatness');
    const body = encodeURIComponent(
      `Here are the programs I saved from Foster Greatness:\n\n${formatProgramsText()}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // Web Share API
  const handleShare = async () => {
    trackEvent('service_board_export', { method: 'share', count: savedPrograms.length });
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Saved Programs - Foster Greatness',
          text: `Here are the programs I saved:\n\n${formatProgramsText()}`,
        });
      } catch (error) {
        // User cancelled or share failed - that's ok
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback to email on desktop
      handleEmail();
    }
  };

  // Print
  const handlePrint = () => {
    trackEvent('service_board_export', { method: 'print', count: savedPrograms.length });
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>My Saved Programs - Foster Greatness</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #1a2949; border-bottom: 2px solid #0067a2; padding-bottom: 10px; }
          .program { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
          .program:last-child { border-bottom: none; }
          .name { font-size: 18px; font-weight: bold; color: #1a2949; margin-bottom: 4px; }
          .provider { color: #6b7280; margin-bottom: 4px; }
          .description { color: #374151; font-size: 14px; margin-bottom: 8px; white-space: pre-line; }
          .detail { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: #374151; font-size: 14px; }
          .icon { width: 16px; color: #0067a2; }
          footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>My Saved Programs</h1>
        ${savedPrograms
          .map(
            (p) => `
          <div class="program">
            <div class="name">${p.name}</div>
            <div class="provider">${p.provider}</div>
            ${p.description ? `<div class="description">${p.description}</div>` : ''}
            ${p.phone ? `<div class="detail"><span class="icon">P</span> ${p.phone}</div>` : ''}
            ${p.address ? `<div class="detail"><span class="icon">A</span> ${p.address}</div>` : ''}
            ${p.website ? `<div class="detail"><span class="icon">W</span> ${p.website}</div>` : ''}
          </div>
        `
          )
          .join('')}
        <footer>
          Generated from Foster Greatness Resource Search<br>
          www.fostergreatness.co/services
        </footer>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Handle clear confirmation
  const handleClearClick = () => {
    if (confirmClear) {
      clearBoard();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      // Reset after 3 seconds
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-fg-navy">
            Saved Programs ({savedPrograms.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {savedPrograms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ChevronRight className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">No programs saved yet</p>
              <p className="text-sm text-gray-400">
                Click the heart icon on any program to save it here
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {savedPrograms.map((program) => (
                <li key={program.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-fg-navy truncate">
                        {program.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{program.provider}</p>

                      {program.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{program.description}</p>
                      )}

                      <div className="mt-2 space-y-1">
                        {program.phone && (
                          <a
                            href={`tel:${program.phone}`}
                            className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{program.phone}</span>
                          </a>
                        )}
                        {program.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{program.address}</span>
                          </div>
                        )}
                        {program.website && (
                          <a
                            href={program.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-fg-blue hover:underline"
                          >
                            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">Visit website</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromBoard(program.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      aria-label={`Remove ${program.name} from saved programs`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with actions */}
        {savedPrograms.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2 mb-3">
              <button
                onClick={handleEmail}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-fg-blue text-white rounded-lg font-medium hover:bg-fg-navy transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-fg-blue text-white rounded-lg font-medium hover:bg-fg-navy transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-fg-blue text-white rounded-lg font-medium hover:bg-fg-navy transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>

            <button
              onClick={handleClearClick}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-lg font-medium transition-colors ${
                confirmClear
                  ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {confirmClear ? 'Click again to confirm' : 'Clear all'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
