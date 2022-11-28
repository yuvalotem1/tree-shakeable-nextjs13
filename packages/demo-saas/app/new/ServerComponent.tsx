import { getServerSideSession } from '@frontegg/nextjs/server';

export const Session = async () => {
  const session = await getServerSideSession();
  return <div>server session: {JSON.stringify(session)}</div>;
};
