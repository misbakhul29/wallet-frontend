// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next'; // Import Metadata type

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = { // Gunakan Metadata type
  title: 'Wallet App',
  description: 'Simple Wallet Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-blue-600 text-white p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Wallet App</h1>
            </nav>
          </header>
          <main className="container mx-auto p-4 py-8 flex justify-center">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}