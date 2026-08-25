import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/components/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LoopIn — Seamless Team Collaboration',
  description:
    'Real-time collaborative Kanban boards with multi-tenant workspaces, drag-and-drop task management, and live team presence.',
  keywords: 'kanban, project management, real-time, collaboration, team workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#16161f',
                border: '1px solid #2a2a3a',
                color: '#f0f0ff',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
