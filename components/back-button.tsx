'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = 'inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className={className}
      type="button"
    >
      ← Back
    </button>
  );
}
