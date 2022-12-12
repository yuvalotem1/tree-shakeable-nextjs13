import { FronteggProvider } from '@frontegg/nextjs/server';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // @ts-ignore typescript not familiar with server components
    <FronteggProvider>
      <html>
        <head></head>
        <body>{children}</body>
      </html>
    </FronteggProvider>
  );
}
