import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { ProfileModule } from '~/modules/ProfileModule';
import { ProfileAction } from '~/modules/ProfileModule/action';
import { ProfileLoader } from '~/modules/ProfileModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return ProfileLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return ProfileAction(args);
}

export default function ProfilePage() {
  return <ProfileModule />;
}
