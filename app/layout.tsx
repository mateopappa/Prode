import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Prode Niagara - RGP',
  description: 'Adivina el nombre de la nueva camioneta Niagara',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(239,223,0,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.1),_transparent_28%),linear-gradient(135deg,#000000_0%,#111111_40%,#181818_100%)] text-white">
          <div className="renault-noise fixed inset-0 -z-20 opacity-80" />
          <div className="fixed inset-0 -z-10">
            <div className="absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-[#EFDF00]/15 blur-3xl" />
            <div className="absolute top-32 right-[-5rem] h-80 w-80 rounded-full bg-white/8 blur-3xl" />
            <div className="absolute bottom-[-5rem] left-1/3 h-96 w-96 rounded-full bg-[#BBBCBC]/10 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px renault-accent-line opacity-80" />
          </div>

          <div className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-black/35 px-4 py-2 text-center text-[11px] tracking-[0.24em] text-white/65 backdrop-blur-md">
            Página no oficial de RGP. Sin vínculo, patrocinio ni aprobación de la empresa.
          </div>

          {/* Contenido */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
