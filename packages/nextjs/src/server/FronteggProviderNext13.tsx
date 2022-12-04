import React, { PropsWithChildren } from 'react';
import { getSession } from './getSessionNext13';
import { FronteggClientProvider } from '../client';
import { FronteggAppOptions } from '@frontegg/types';

export const FronteggProvider = async ({
  children,
  ...options
}: PropsWithChildren<Omit<FronteggAppOptions, 'contextOptions'>>) => {
  const session = await getSession();
  const envAppUrl = process.env['FRONTEGG_APP_URL'];
  const envBaseUrl = process.env['FRONTEGG_BASE_URL'];
  const envClientId = process.env['FRONTEGG_CLIENT_ID'];

  if (!envAppUrl) {
    throw Error('@frontegg/nextjs: .env.local must contain FRONTEGG_APP_URL');
  }
  if (!envBaseUrl) {
    throw Error('@frontegg/nextjs: .env.local must contain FRONTEGG_BASE_URL');
  }
  if (!envClientId) {
    throw Error('@frontegg/nextjs: .env.local must contain FRONTEGG_CLIENT_ID');
  }

  return (
    <FronteggClientProvider {...{ session, envAppUrl, envBaseUrl, envClientId }} {...options}>
      {children}
    </FronteggClientProvider>
  );
};
