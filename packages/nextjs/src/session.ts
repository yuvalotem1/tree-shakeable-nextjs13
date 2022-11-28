import { authInitialState } from '@frontegg/redux-store';
import { IncomingMessage } from 'http';
import { unsealData } from 'iron-session';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { parseCookie, uncompress } from './common/cookieHelpers';
import fronteggConfig from './common/FronteggConfig';
import { getSessionFromCookie } from './common/sessionHelpers';
import { FronteggNextJSSession } from './common/types';

type RequestType = IncomingMessage | Request;

export async function getHostedLoginRefreshToken(req: RequestType): Promise<string | undefined> {
  try {
    const cookieStr = 'credentials' in req ? req.headers.get('cookie') || '' : req.headers.cookie || '';

    const sealFromCookies = parseCookie(cookieStr);
    if (!sealFromCookies) {
      return undefined;
    }
    const compressedJwt: string = await unsealData(sealFromCookies, {
      password: fronteggConfig.passwordsAsMap,
    });
    const { refreshToken } = JSON.parse(await uncompress(compressedJwt));

    return refreshToken;
  } catch (e) {
    return undefined;
  }
}

export async function getSession(req: RequestType): Promise<FronteggNextJSSession | undefined> {
  try {
    const cookieStr = 'credentials' in req ? req.headers.get('cookie') || '' : req.headers.cookie || '';
    const sealFromCookies = parseCookie(cookieStr);
    return getSessionFromCookie(sealFromCookies);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export function withSSRSession<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: (
    context: GetServerSidePropsContext<Q>,
    session: FronteggNextJSSession
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return async (context: GetServerSidePropsContext<Q>): Promise<GetServerSidePropsResult<P>> => {
    const session = await getSession(context.req);
    if (session) {
      return handler(context, session);
    } else {
      let loginUrl = fronteggConfig.authRoutes.loginUrl ?? authInitialState.routes.loginUrl;

      if (!loginUrl.startsWith('/')) {
        loginUrl = `/${loginUrl}`;
      }
      return {
        redirect: {
          permanent: false,
          destination: `${loginUrl}?redirectUrl=${encodeURIComponent(context.resolvedUrl ?? context.req.url)}`,
        },
        props: {},
      } as GetServerSidePropsResult<P>;
    }
  };
}
