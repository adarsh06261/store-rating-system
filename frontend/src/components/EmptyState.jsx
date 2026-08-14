import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description = 'There is nothing to display yet.' }) {
  return (
    <div className="text-center py-12">
      <Inbox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
