import { unsealData } from 'iron-session';
import { jwtVerify } from 'jose';
import { uncompress } from './cookieHelpers';
import fronteggConfig from './FronteggConfig';
import { FronteggNextJSSession } from './types';

export async function getSessionFromCookie(cookie?: string): Promise<FronteggNextJSSession | undefined> {
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
}
