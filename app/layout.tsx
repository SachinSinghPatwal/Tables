import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { MUIThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dynamic Data Table Manager',
  description: 'A comprehensive table management system with advanced features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <MUIThemeProvider>
            <div id="theme-root">
              {children}
            </div>
          </MUIThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}