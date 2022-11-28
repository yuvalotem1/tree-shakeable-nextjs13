import { FronteggProviderNext13Server } from '@frontegg/nextjs/server';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        {/* @ts-ignore typescript not familiar with server components*/}
        <FronteggProviderNext13Server>{children}</FronteggProviderNext13Server>
      </body>
    </html>
  );
}
