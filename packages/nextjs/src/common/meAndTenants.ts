import { getTenants, getUsers } from '../api';
import { MeAndTenants } from './types';

export async function meAndTenants(
  reqHeaders?: Record<string, string | null>,
  accessToken?: string
): Promise<MeAndTenants> {
  if (!reqHeaders || !accessToken) {
    return {};
  }
  const headers = { ...reqHeaders, Authorization: `Bearer ${accessToken}` };
  const [user, tenants] = await Promise.all([getUsers(headers), getTenants(headers)]);

  return { user, tenants };
}
