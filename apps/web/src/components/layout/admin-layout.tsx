'use client';

import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen min-w-0">
        <Header title={title} />
        <main className="flex-1 p-7 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
