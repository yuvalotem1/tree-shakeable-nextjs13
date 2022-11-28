import React, { PropsWithChildren } from 'react';
import { getServerSideSession } from './getServerSideSession';
import { FronteggClientProvider } from '../client';
import { FronteggAppOptions } from '@frontegg/types';

type FronteggProviderNext13Props = Omit<FronteggAppOptions, 'contextOptions'>;

export const FronteggProviderNext13Server = async ({
  children,
  ...options
}: PropsWithChildren<FronteggProviderNext13Props>) => {
  const session = await getServerSideSession();
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
