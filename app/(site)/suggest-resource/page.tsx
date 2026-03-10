import { Metadata } from 'next';
import ResourceSuggestionForm from '@/components/resources/ResourceSuggestionForm';

export const metadata: Metadata = {
  title: 'Suggest a Resource | Foster Greatness',
  description: 'Help us grow our resource directory by suggesting programs and services that support foster youth.',
};

export default function SuggestResourcePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-fg-navy font-poppins mb-3">
          Suggest a Resource
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Know a great program or service? Help us grow our resource directory
          so more community members can find the support they need.
        </p>
      </div>
      <ResourceSuggestionForm />
    </div>
  );
}
