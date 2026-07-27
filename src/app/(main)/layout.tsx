import { ReactNode } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';

interface MainLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: MainLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
