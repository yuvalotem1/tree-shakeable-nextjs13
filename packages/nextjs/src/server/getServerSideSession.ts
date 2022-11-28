import {
  FronteggNextJSSession,
  FronteggUserSession,
  FronteggUserTokens,
  getCookieFromArray,
  getSessionFromCookie,
} from '../common';
import { cookies } from 'next/headers';

export async function getServerSideSession(): Promise<FronteggNextJSSession | undefined> {
  try {
    const cookie = getCookieFromArray(cookies);
    return getSessionFromCookie(cookie);
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
