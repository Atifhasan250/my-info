'use client';

import { cn } from '@/lib/utils';

interface PreloaderProps {
  visible?: boolean;
}

export const Preloader = ({ visible = true }: PreloaderProps) => {
  return (
    <div className={cn('preloader', !visible && 'hidden')}>
      <div className="spinner"></div>
    </div>
  );
};
