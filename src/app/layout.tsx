import '@/app/globals.css';
import { AuthProvider } from '@/context/auth-context';
import { NotificationProvider } from '@/context/notification-context';
import { ZustandBridge } from '@/context/zustand-bridge';
import { UploadProvider } from '@/features/upload/context/upload-context';
import { ThemeProvider } from '@/providers/theme-provider';
import { headers } from 'next/headers';
import { SITE_URL, PROJECT_NAME, COMMUNITY_NAME } from '@/config/links';
import { ConfirmDialogHost } from '@/shared/components/ui/confirm-dialog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${PROJECT_NAME} - AWS S3 Drive Interface`,
  description:
    'Browser-based Google Drive-like interface for Amazon S3 storage buckets. Built by AWS User Group Vadodara.',
  icons: {
    icon: [{ url: '/favicon.ico' }],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/favicon.ico' }],
  },
  keywords: [
    'AWSUG Vadodara',
    'AWS S3',
    'S3 file manager',
    'Amazon S3 Drive',
    'S3 browser client',
    'cloud storage drive',
    'Vadodara AWS Community',
  ],
  authors: [{ name: COMMUNITY_NAME }],
  creator: COMMUNITY_NAME,
  publisher: COMMUNITY_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${PROJECT_NAME} - AWS S3 Drive Interface`,
    description:
      'Browser-based Google Drive-like interface for Amazon S3 storage buckets. Built by AWS User Group Vadodara.',
    url: SITE_URL,
    siteName: PROJECT_NAME,
    images: [
      {
        url: '/logo.png',
        width: 318,
        height: 159,
        alt: PROJECT_NAME,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storageKey = 'ui-theme';
                  const theme = localStorage.getItem(storageKey);
                  const root = document.documentElement;
                  
                  if (theme === 'dark') {
                    root.setAttribute('data-theme', 'dark');
                  } else if (theme === 'light') {
                    root.setAttribute('data-theme', 'light');
                  } else {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.setAttribute('data-theme', systemTheme);
                  }
                } catch (e) {
                  // Theme setup failed, use default
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ZustandBridge />
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <UploadProvider>
              <NotificationProvider>
                {children}
                <ConfirmDialogHost />
              </NotificationProvider>
            </UploadProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
