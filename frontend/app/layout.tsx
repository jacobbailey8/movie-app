
import './globals.css';
import MobileSidebar from './sidebarComponents/MobileSidebar';
import DesktopSidebar from './sidebarComponents/DesktopSidebar';
import ClientSessionProvider from './ClientSessionProvider';

export const metadata = {
  title: 'Movie App',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className=''>
        <ClientSessionProvider>
          <MobileSidebar />
          <DesktopSidebar />
          <main className='bg-neutral-200 min-h-screen min-w-screen p-4'>
            {children}
          </main>
        </ClientSessionProvider>

      </body>
    </html >
  );
}