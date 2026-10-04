import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: 'Gaborganizador Financiero',
  description: 'Aplicación modular e independiente para control de salario, gastos, ingresos extra e inversiones.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Gaborganizador Financiero',
  },
  icons: {
    icon: '/monoicon.png',
    apple: '/monoicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
