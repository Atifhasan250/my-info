import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      {children}
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}
