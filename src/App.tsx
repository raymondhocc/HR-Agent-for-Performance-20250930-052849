import { Outlet } from 'react-router-dom';
import { AuraHireHeader } from '@/components/AuraHireHeader';
import { AuraHireFooter } from '@/components/AuraHireFooter';
import { Toaster } from '@/components/ui/sonner';
export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-slate-50 dark:from-background dark:to-slate-900">
      <AuraHireHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <AuraHireFooter />
      <Toaster richColors />
    </div>
  );
}