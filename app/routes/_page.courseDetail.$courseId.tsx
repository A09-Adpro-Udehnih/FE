import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { CourseDetailModule } from '~/modules/CourseDetailModule';
import { CourseDetailAction } from '~/modules/CourseDetailModule/action';
import { CourseDetailLoader } from '~/modules/CourseDetailModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return CourseDetailLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return CourseDetailAction(args);
}

export default function CourseDetailPage() {
  return <CourseDetailModule />;
}
