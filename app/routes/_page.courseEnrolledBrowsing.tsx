import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { CourseEnrolledBrowsingModule } from '~/modules/CourseEnrolledBrowsingModule';
import { CourseEnrolledBrowsingAction } from '~/modules/CourseEnrolledBrowsingModule/action';
import { CourseEnrolledBrowsingLoader } from '~/modules/CourseEnrolledBrowsingModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return CourseEnrolledBrowsingLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return CourseEnrolledBrowsingAction(args);
}

export default function CourseEnrolledBrowsingPage() {
  return <CourseEnrolledBrowsingModule />;
}
