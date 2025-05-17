import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Percent to AGI - Tracking Progress to Artificial General Intelligence',
  description: 'A humorous yet scientifically-backed tracker of humanity\'s progress toward Artificial General Intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 