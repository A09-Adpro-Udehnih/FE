import { redirect, type ActionFunctionArgs } from 'react-router';
import { sessionCookie } from '~/lib/auth.server';

export async function action(args: ActionFunctionArgs) {
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionCookie.serialize('', { maxAge: 0 }),
    },
  });
}
