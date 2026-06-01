import type {Metadata} from 'next';
import './globals.css'; 

export const metadata: Metadata = {
  title: 'Asuma MD Dashboard',
  description: 'Production-ready dashboard for Asuma MD WhatsApp Bot.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
