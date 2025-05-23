import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { TutorsModule } from '~/modules/TutorsModule';
import { TutorsAction } from '~/modules/TutorsModule/action';
import { TutorsLoader } from '~/modules/TutorsModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return TutorsLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return TutorsAction(args);
}

export default function TutorsPage() {
  return <TutorsModule />;
}