import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { CourseBrowsingModule } from '~/modules/CourseBrowsingModule';
import { CourseBrowsingAction } from '~/modules/CourseBrowsingModule/action';
import { CourseBrowsingLoader } from '~/modules/CourseBrowsingModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return CourseBrowsingLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return CourseBrowsingAction(args);
}

export default function CourseBrowsingPage() {
  return <CourseBrowsingModule />;
}
