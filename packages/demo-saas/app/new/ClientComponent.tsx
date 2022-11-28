'use client';
import { useAuthUserOrNull } from '@frontegg/nextjs';

export const User = () => {
  const user = useAuthUserOrNull();
  return <div>client user: {JSON.stringify(user)}</div>;
};
