'use client';

import { useState, FormEvent } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface ZipCodeInputProps {
  onSubmit: (zip: string) => void;
  initialValue?: string;
  isLoading?: boolean;
}

export default function ZipCodeInput({ onSubmit, initialValue = '', isLoading = false }: ZipCodeInputProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmed = value.trim();

    // Validate ZIP code
    if (!trimmed) {
      setError('Please enter your ZIP code');
      return;
    }

    if (!/^\d{5}$/.test(trimmed)) {
      setError('ZIP code must be 5 digits');
      return;
    }

    setError(null);
    onSubmit(trimmed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 5);
    setValue(cleaned);
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <label className="block text-center mb-4">
        <span className="text-lg font-semibold text-fg-navy">
          Enter your ZIP code to find local resources
        </span>
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <MapPin className="w-6 h-6 text-gray-400" />
        </div>

        <input
          type="text"
          inputMode="numeric"
          pattern="\d{5}"
          value={value}
          onChange={handleChange}
          placeholder="12345"
          disabled={isLoading}
          className={`w-full pl-14 pr-32 py-5 text-2xl text-center font-semibold tracking-wider border-2 rounded-2xl outline-none transition-all ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
              : 'border-gray-200 focus:border-fg-blue focus:ring-4 focus:ring-fg-blue/10'
          } disabled:bg-gray-50 disabled:text-gray-500`}
          aria-label="ZIP code"
          aria-invalid={!!error}
          aria-describedby={error ? 'zip-error' : undefined}
        />

        <button
          type="submit"
          disabled={isLoading || value.length < 5}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-6 py-3 bg-fg-navy text-white font-semibold rounded-xl hover:bg-fg-blue disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="hidden sm:inline">Searching</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {error && (
        <p id="zip-error" className="mt-2 text-center text-red-600 text-sm">
          {error}
        </p>
      )}

      <p className="mt-4 text-center text-sm text-gray-500">
        We use your ZIP code to find programs and services near you
      </p>
    </form>
  );
}
