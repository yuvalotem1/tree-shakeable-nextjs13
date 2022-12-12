import React, { PropsWithChildren } from 'react';
import { getSession } from './getSessionNext13';
import { FronteggClientProvider } from '../client';
import { FronteggAppOptions } from '@frontegg/types';
import { meAndTenants } from '../common';
import { headers } from 'next/headers';

export const FronteggProvider = async ({
  children,
  ...options
}: PropsWithChildren<Omit<FronteggAppOptions, 'contextOptions'>>) => {
  const session = await getSession();
  const acceptEncoding = headers().get('accept-encoding');
  const acceptLanguage = headers().get('accept-language');
  const cookie = headers().get('cookie');
  const accept = headers().get('accept');
  const userAgent = headers().get('user-agent');
  const connection = headers().get('connection');
  const cacheControl = headers().get('cache-control');
  const { user, tenants } = await meAndTenants(
    {
      'accept-encoding': acceptEncoding,
      'accept-language': acceptLanguage,
      cookie,
      accept,
      'user-agent': userAgent,
      connection,
      'cache-control': cacheControl,
    },
    session?.accessToken
  );

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
    <FronteggClientProvider {...{ session, envAppUrl, envBaseUrl, envClientId, user, tenants }} {...options}>
      {children}
    </FronteggClientProvider>
  );
};
