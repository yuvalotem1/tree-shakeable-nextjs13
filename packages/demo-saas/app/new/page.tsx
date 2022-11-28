import { Session } from './ServerComponent';
import { User } from './ClientComponent';

export default function NewPage() {
  return (
    <div>
      <h1>This page is part of beta app dir</h1>
      {/* @ts-ignore typescript not familiar with server components*/}
      <Session />
      <User />
    </div>
  );
}
