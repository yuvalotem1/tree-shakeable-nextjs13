import { getSession } from '@frontegg/nextjs/server';

export const ServerSession = async () => {
  const session = await getSession();
  return <div>user session server side: {JSON.stringify(session)}</div>;
};
