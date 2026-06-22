import { AlertCircle } from 'lucide-react';

type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-2xl border border-gray-800 text-center min-h-[200px]">
      <div className="bg-[#1f364d] p-4 rounded-full mb-4">
        <AlertCircle size={32} className="text-primary opacity-80" />
      </div>
      <p className="text-gray-300 font-medium">{message}</p>
    </div>
  );
}
