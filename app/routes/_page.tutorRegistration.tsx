import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { TutorRegistrationModule } from '~/modules/TutorRegistrationModule';
import { TutorRegistrationAction } from '~/modules/TutorRegistrationModule/action';
import { TutorRegistrationLoader } from '~/modules/TutorRegistrationModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return TutorRegistrationLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return TutorRegistrationAction(args);
}

export default function TutorRegistrationPage() {
  return <TutorRegistrationModule />;
}
