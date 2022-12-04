import {
  FronteggNextJSSession,
  FronteggUserSession,
  FronteggUserTokens,
  getCookieFromArray,
  getSessionFromCookie,
} from '../common';
import { cookies } from 'next/headers';

export async function getSession(): Promise<FronteggNextJSSession | undefined> {
  try {
    const allCookies = cookies().getAll();
    const cookie = getCookieFromArray(allCookies);
    return getSessionFromCookie(cookie);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export async function getUserSession(): Promise<FronteggUserSession | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export async function getUserTokens(): Promise<FronteggUserTokens | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return mapSessionToTokens(session);
}

const mapSessionToTokens = ({ accessToken, refreshToken }: FronteggUserTokens) => ({ accessToken, refreshToken });
