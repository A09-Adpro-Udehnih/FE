import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { CourseEnrolledDetailModule } from '~/modules/CourseEnrolledDetailModule';
import { CourseEnrolledDetailAction } from '~/modules/CourseEnrolledDetailModule/action';
import { CourseEnrolledDetailLoader } from '~/modules/CourseEnrolledDetailModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return CourseEnrolledDetailLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return CourseEnrolledDetailAction(args);
}

export default function CourseEnrolledDetailPage() {
  return <CourseEnrolledDetailModule />;
}
