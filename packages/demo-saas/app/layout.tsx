import { FronteggProvider } from '@frontegg/nextjs/server';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        {/* @ts-ignore typescript not familiar with server components*/}
        <FronteggProvider>{children}</FronteggProvider>
      </body>
    </html>
  );
}
