import { unsealData } from 'iron-session';
import { jwtVerify } from 'jose';
import fronteggConfig from '../common/FronteggConfig';
import { getCookieFromArray, uncompress } from '../common/cookieHelpers';
import { FronteggNextJSSession, FronteggUserSession, FronteggUserTokens } from '../common/types';
import { cookies } from 'next/headers';

export async function getServerSideSession(): Promise<FronteggNextJSSession | undefined> {
  try {
    const cookie = getCookieFromArray(cookies);
    if (!cookie) {
      return undefined;
    }
    const compressedJwt: string = await unsealData(cookie, {
      password: fronteggConfig.passwordsAsMap,
    });
    const uncompressedJwt = await uncompress(compressedJwt);
    const { accessToken, refreshToken } = JSON.parse(uncompressedJwt);

    if (!accessToken) {
      return undefined;
    }
    const publicKey = await fronteggConfig.getJwtPublicKey();
    const { payload }: any = await jwtVerify(accessToken, publicKey);

    const session: FronteggNextJSSession = {
      accessToken,
      user: payload,
      refreshToken,
    };
    if (session.user.exp * 1000 < Date.now()) {
      return undefined;
    }
    return session;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export async function getUserSession(): Promise<FronteggUserSession | null> {
  const session = await getServerSideSession();
  return session?.user ?? null;
}

export async function getUserTokens(): Promise<FronteggUserTokens | null> {
  const session = await getServerSideSession();
  if (!session) {
    return null;
  }
  return mapSessionToTokens(session);
}

const mapSessionToTokens = ({ accessToken, refreshToken }: FronteggUserTokens) => ({ accessToken, refreshToken });
